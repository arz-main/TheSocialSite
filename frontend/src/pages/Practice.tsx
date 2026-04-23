// pages/Practice.tsx
import { useState, useEffect, useRef, useCallback } from "react";
import { Brush } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { mockDrawings, mockCategories } from "../_mock/mockPracticePage";
import { PracticeCard, CanvasToggle } from "../components/ui/PracticePageUIComponents";
import { ActiveSessionPanel, DrawingReviewGrid, PostDrawingPanel } from "../components/ui/PracticePageComponents";
import { formatTime } from "../utils/PracticePageUtils";
import { Button } from "../components/ui/BasicButton";
import type { SessionState, SessionResult } from "../types/PracticePageTypes";

export default function Practice() {
    const [numDrawings, setNumDrawings] = useState(5);
    const [timePerDrawing, setTimePerDrawing] = useState(60);
    const [sessionState, setSessionState] = useState<SessionState>("idle");
    const [drawingIndex, setDrawingIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [sessionDrawings, setSessionDrawings] = useState<typeof mockDrawings>([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [useCanvas, setUseCanvas] = useState(false);
    const [canvasCaptures, setCanvasCaptures] = useState<Record<number, string>>({});
    const [results, setResults] = useState<SessionResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<SessionResult | null>(null);
    const [clearSignal, setClearSignal] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerDrawingRef = useRef<number>(-1);

    const toggleCategory = (id: number) =>
        setSelectedCategoryIds(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);

    const buildSession = useCallback(() => {
        const pool = selectedCategoryIds.length === 0
            ? mockDrawings
            : mockDrawings.filter(d => selectedCategoryIds.includes(d.categoryId));
        return [...pool].sort(() => Math.random() - 0.5).slice(0, numDrawings);
    }, [numDrawings, selectedCategoryIds]);

    useEffect(() => {
        if (sessionState !== "active") {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        if (timerDrawingRef.current !== drawingIndex) {
            timerDrawingRef.current = drawingIndex;
            setTimeLeft(timePerDrawing);
            setClearSignal(s => s + 1);
        }
        intervalRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current!);
                    setDrawingIndex(idx => {
                        const next = idx + 1;
                        if (next >= sessionDrawings.length) {
                            setTimeout(() => setSessionState("done"), 50);
                            return 0;
                        }
                        return next;
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [sessionState, drawingIndex, sessionDrawings.length, timePerDrawing]);

    const buildResults = useCallback((): SessionResult[] =>
        sessionDrawings.map(d => ({ drawing: d, canvasDataUrl: canvasCaptures[d.id] ?? null })),
        [sessionDrawings, canvasCaptures]
    );

    useEffect(() => {
        if (sessionState === "done") setResults(buildResults());
    }, [sessionState]);

    const handleStart = () => {
        const drawings = buildSession();
        setSessionDrawings(drawings);
        setDrawingIndex(0);
        setTimeLeft(timePerDrawing);
        setCanvasCaptures({});
        setResults([]);
        timerDrawingRef.current = -1;
        setClearSignal(0);
        setSessionState("active");
    };

    const handleSkip = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDrawingIndex(idx => {
            const next = idx + 1;
            if (next >= sessionDrawings.length) {
                setTimeout(() => setSessionState("done"), 50);
                return 0;
            }
            setTimeLeft(timePerDrawing);
            setSessionState("active");
            return next;
        });
    };

    const handleStop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setSessionState("idle");
        setDrawingIndex(0);
        setCanvasCaptures({});
    };

    // Called when user clicks "Finish" on the review grid
    const handleFinish = () => {
        setSessionState("idle");
        setResults([]);
        setDrawingIndex(0);
        setCanvasCaptures({});
    };

    const handleCanvasCapture = useCallback((drawingId: number, dataUrl: string) => {
        setCanvasCaptures(prev => ({ ...prev, [drawingId]: dataUrl }));
    }, []);

    const isActive = sessionState === "active" || sessionState === "paused";
    const isDone = sessionState === "done";
    const inSession = isActive || isDone;

    return (
        // Use 100dvh minus the navbar height (64px) so it never extends past the screen
        <div className="flex flex-col bg-background text-primary overflow-hidden"
            style={{ height: "calc(100dvh - 64px)" }}>

            <AnimatePresence mode="wait">

                {/* ── SESSION / DONE — full screen ── */}
                {inSession && (
                    <motion.div
                        key="session"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col overflow-hidden"
                        style={{ height: "calc(100dvh - 64px)" }}
                    >
                        {isDone ? (
                            <div className="flex-1 p-4 overflow-y-auto">
                                <DrawingReviewGrid
                                    results={results}
                                    useCanvas={useCanvas}
                                    onSelectResult={setSelectedResult}
                                    onFinish={handleFinish}
                                />
                            </div>
                        ) : (
                            <ActiveSessionPanel
                                drawing={sessionDrawings[drawingIndex]}
                                drawingIndex={drawingIndex}
                                totalDrawings={sessionDrawings.length}
                                timeLeft={timeLeft}
                                timePerDrawing={timePerDrawing}
                                sessionState={sessionState}
                                useCanvas={useCanvas}
                                clearSignal={clearSignal}
                                onPause={() => setSessionState("paused")}
                                onResume={() => setSessionState("active")}
                                onSkip={handleSkip}
                                onStop={handleStop}
                                onCanvasCapture={handleCanvasCapture}
                            />
                        )}
                    </motion.div>
                )}

                {/* ── IDLE — setup panel ── */}
                {!inSession && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col flex-1 p-6 overflow-y-auto"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
                            {/* LEFT — settings */}
                            <div className="flex flex-col rounded-xl bg-card shadow p-6 gap-4">
                                <h2 className="text-text font-semibold text-sm uppercase tracking-wide opacity-60">Categories</h2>
                                <div className="grid grid-cols-2 gap-3">
                                    {mockCategories.map(category => (
                                        <PracticeCard
                                            key={category.id}
                                            {...category}
                                            selected={selectedCategoryIds.includes(category.id)}
                                            onToggle={() => toggleCategory(category.id)}
                                            disabled={false}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-col gap-4 pt-2">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-text-opaque">Drawings</span>
                                            <span className="font-semibold text-text">{numDrawings}</span>
                                        </div>
                                        <input type="range" min={1} max={20} value={numDrawings}
                                            onChange={e => setNumDrawings(Number(e.target.value))}
                                            className="w-full accent-primary" />
                                        <div className="flex justify-between text-xs text-text-opaque mt-0.5">
                                            <span>1</span><span>20</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-text-opaque">Time per drawing</span>
                                            <span className="font-semibold text-text">{formatTime(timePerDrawing)}</span>
                                        </div>
                                        <input type="range" min={10} max={300} step={10} value={timePerDrawing}
                                            onChange={e => setTimePerDrawing(Number(e.target.value))}
                                            className="w-full accent-primary" />
                                        <div className="flex justify-between text-xs text-text-opaque mt-0.5">
                                            <span>10s</span><span>5m</span>
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <CanvasToggle checked={useCanvas} onChange={setUseCanvas} />
                                        {useCanvas && (
                                            <p className="text-xs text-text-opaque mt-1.5 ml-14">
                                                Draw alongside the reference — sketches saved at end.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button size="xl" variant="primary" onClick={handleStart} className="mt-auto">
                                    Start Session
                                </Button>
                            </div>

                            {/* RIGHT — preview */}
                            <div className="flex flex-col items-center justify-center rounded-xl bg-card shadow p-6 gap-4 min-h-[300px]">
                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Brush className="w-12 h-12 text-primary" />
                                </div>
                                <h1 className="text-2xl font-bold text-text">Ready to Practice</h1>
                                <p className="text-text-opaque text-sm text-center max-w-xs">
                                    {numDrawings} drawing{numDrawings > 1 ? "s" : ""} × {formatTime(timePerDrawing)} each
                                    {useCanvas ? " · Canvas enabled" : ""}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post-drawing panel modal */}
            <AnimatePresence>
                {selectedResult && (
                    <PostDrawingPanel
                        result={selectedResult}
                        onClose={() => setSelectedResult(null)}
                        onUploadToProfile={withRef => console.log("Upload, withRef:", withRef)}
                        onSendToFriend={() => console.log("Send to friend")}
                        onDownload={() => { }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}