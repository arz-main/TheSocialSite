import { useState, useEffect, useRef, useCallback } from "react";
import { Brush, Pencil, Clock, Layers, Zap, ImageIcon, MonitorSmartphone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { mockDrawings, mockCategories } from "../_mock/mockPracticePage";
import { PracticeCard, CanvasToggle } from "../components/PracticePageUIComponents";
import { ActiveSessionPanel, DrawingReviewGrid, PostDrawingPanel } from "../components/PracticePageComponents";
import { formatTime } from "../utils/PracticePageUtils";
import type { SessionState, SessionResult } from "../types/PracticePageTypes";
import { usePosts } from "../hooks/usePosts";

/* ── Texture helpers (local, matching Home style) ─────────────────────────── */
function DotGrid({ className = "" }: { className?: string }) {
    return (
        <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="practice-dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                    <circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#practice-dots)" />
        </svg>
    );
}

function InkBlur({ size, className = "" }: { size: number; className?: string }) {
    return <span className={`absolute rounded-full pointer-events-none ${className}`} style={{ width: size, height: size }} />;
}

/* ── Styled slider ────────────────────────────────────────────────────────── */
interface SliderFieldProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    display: string;
    onChange: (v: number) => void;
}
function SliderField({ label, value, min, max, step = 1, display, onChange }: SliderFieldProps) {
    const pct = ((value - min) / (max - min)) * 100;
    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-text">{label}</span>
                <span className="text-sm font-black text-primary tabular-nums">{display}</span>
            </div>
            <div className="relative">
                <input
                    type="range" min={min} max={max} step={step} value={value}
                    onChange={e => onChange(Number(e.target.value))}
                    className="practice-slider w-full"
                    style={{ "--slider-pct": `${pct}%` } as React.CSSProperties}
                />
            </div>
        </div>
    );
}


/* ── Main page ───────────────────────────────────────────────────────────── */
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
    const [drawnIds, setDrawnIds] = useState<Set<number>>(new Set());
    const [results, setResults] = useState<SessionResult[]>([]);
    const [selectedResult, setSelectedResult] = useState<SessionResult | null>(null);
    const [clearSignal, setClearSignal] = useState(0);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timerDrawingRef = useRef<number>(-1);
    const captureRef = useRef<((cb: () => void) => void) | null>(null);

    const { createPost } = usePosts();

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
                    const advance = () => {
                        setDrawingIndex(idx => {
                            const next = idx + 1;
                            if (next >= sessionDrawings.length) {
                                setTimeout(() => setSessionState("done"), 50);
                                return 0;
                            }
                            return next;
                        });
                    };
                    if (captureRef.current) {
                        captureRef.current(advance);
                    } else {
                        advance();
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [sessionState, drawingIndex, sessionDrawings.length, timePerDrawing]);

    const buildResults = useCallback((): SessionResult[] =>
        sessionDrawings.map(d => ({
            drawing: d,
            canvasDataUrl: (useCanvas && drawnIds.has(d.id)) ? (canvasCaptures[d.id] ?? null) : null,
        })),
        [sessionDrawings, canvasCaptures, useCanvas, drawnIds]
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
        setDrawnIds(new Set());
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
        setDrawnIds(new Set());
    };

    const handleFinish = () => {
        setSessionState("idle");
        setResults([]);
        setDrawingIndex(0);
        setCanvasCaptures({});
        setDrawnIds(new Set());
    };

    const handleCanvasCapture = useCallback((drawingId: number, dataUrl: string) => {
        setCanvasCaptures(prev => ({ ...prev, [drawingId]: dataUrl }));
    }, []);

    const handleDrawingStarted = useCallback((drawingId: number) => {
        setDrawnIds(prev => new Set([...prev, drawingId]));
    }, []);

    const isActive = sessionState === "active" || sessionState === "paused";
    const isDone = sessionState === "done";
    const inSession = isActive || isDone;

    const totalTime = numDrawings * timePerDrawing;
    const selectedCount = selectedCategoryIds.length;

    return (
        <>
            <style>{`
                .practice-slider {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 5px;
                    background: linear-gradient(to right, var(--color-primary, #6c63ff) var(--slider-pct, 0%), var(--color-border, #e2e8f0) var(--slider-pct, 0%));
                    border-radius: 99px;
                    outline: none;
                    cursor: pointer;
                }
                .practice-slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--color-primary, #6c63ff);
                    cursor: pointer;
                    border: 3px solid var(--color-background, #fff);
                    box-shadow: 0 0 0 1.5px var(--color-primary, #6c63ff);
                    transition: transform 0.15s;
                }
                .practice-slider::-webkit-slider-thumb:hover { transform: scale(1.2); }
                .practice-slider::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: var(--color-primary, #6c63ff);
                    border: 3px solid var(--color-background, #fff);
                    box-shadow: 0 0 0 1.5px var(--color-primary, #6c63ff);
                    cursor: pointer;
                }
            `}</style>

            <div className="flex flex-col bg-background text-text overflow-hidden"
                style={{ height: "calc(100dvh - 64px)" }}>

                <AnimatePresence mode="wait">

                    {/* SESSION / DONE */}
                    {inSession && (
                        <motion.div key="session"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col h-full overflow-hidden">
                            {isDone ? (
                                <div className="flex-1 h-full p-4 overflow-hidden min-h-0">
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
                                    onDrawingStarted={handleDrawingStarted}
                                    captureRef={captureRef}
                                />
                            )}
                        </motion.div>
                    )}

                    {/* IDLE — setup */}
                    {!inSession && (
                        <motion.div key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex h-full overflow-hidden">

                            {/* LEFT — settings panel */}
                            <div className="relative w-full lg:w-[420px] flex flex-col border-r border-border overflow-hidden shrink-0">
                                <DotGrid className="text-primary opacity-[0.04]" />
                                <InkBlur size={220} className="bg-primary opacity-[0.06] -top-10 -right-10 blur-3xl" />

                                <div className="relative z-10 flex flex-col flex-1 overflow-y-auto px-6 py-6 gap-5">
                                    <div>
                                        <h2 className="text-2xl font-black text-text leading-tight">Configure Session</h2>
                                        <p className="text-sm text-muted mt-0.5">Choose categories and set your timer</p>
                                    </div>

                                    {/* Divider */}
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-px bg-primary/15" />
                                        {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-2.5 bg-primary/25 rounded-full" />)}
                                        <div className="flex-1 h-px bg-primary/15" />
                                    </div>

                                    {/* Categories */}
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted mb-3">
                                            Categories
                                            {selectedCount > 0 && (
                                                <span className="ml-2 text-primary">{selectedCount} selected</span>
                                            )}
                                        </p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {mockCategories.map(cat => (
                                                <PracticeCard
                                                    key={cat.id}
                                                    {...cat}
                                                    selected={selectedCategoryIds.includes(cat.id)}
                                                    onToggle={() => toggleCategory(cat.id)}
                                                    disabled={false}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Sliders */}
                                    <div className="flex flex-col gap-4">
                                        <SliderField
                                            label="Drawings"
                                            value={numDrawings}
                                            min={1} max={20}
                                            display={String(numDrawings)}
                                            onChange={setNumDrawings}
                                        />
                                        <SliderField
                                            label="Time per drawing"
                                            value={timePerDrawing}
                                            min={10} max={300} step={10}
                                            display={formatTime(timePerDrawing)}
                                            onChange={setTimePerDrawing}
                                        />
                                    </div>

                                    {/* Canvas toggle */}
                                    <div className="flex flex-col gap-1.5 px-3 py-3 rounded-xl border border-border bg-background/50">
                                        <div className="flex items-center justify-between">
                                            <CanvasToggle checked={useCanvas} onChange={setUseCanvas} />
                                            <div className="flex items-center gap-1 text-muted/60">
                                                <MonitorSmartphone className="w-3.5 h-3.5" />
                                                <span className="text-[11px]">Digital tablet recommended</span>
                                            </div>
                                        </div>
                                        {useCanvas && (
                                            <p className="text-xs text-muted pl-0.5">Draw alongside the reference image in real time</p>
                                        )}
                                    </div>

                                    {/* Start button */}
                                    <button
                                        onClick={handleStart}
                                        className="w-full py-3.5 rounded-xl bg-primary text-white font-black text-base hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-auto"
                                    >
                                        <Brush className="w-5 h-5" />
                                        Start Session
                                    </button>
                                </div>
                            </div>

                            {/* RIGHT — session layout preview */}
                            <div className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center bg-background">
                                <DotGrid className="text-primary opacity-[0.04]" />
                                <InkBlur size={320} className="bg-primary opacity-[0.05] -top-24 -right-24 blur-3xl" />
                                <InkBlur size={200} className="bg-primary opacity-[0.05] bottom-8 left-0 blur-3xl" />

                                <div className="relative z-10 flex flex-col items-center gap-6 w-full max-w-lg px-10">
                                    <div className="text-center">
                                        <h1 className="text-3xl font-black text-text mb-1">Ready to Practice</h1>
                                        <p className="text-muted text-sm">
                                            {selectedCount === 0 ? "All categories" : `${selectedCount} categor${selectedCount === 1 ? "y" : "ies"}`}
                                            {" · "}{numDrawings} drawing{numDrawings !== 1 ? "s" : ""}
                                            {" · "}{formatTime(timePerDrawing)} each
                                        </p>
                                    </div>

                                    {/* Session layout wireframe */}
                                    <div className="w-full">
                                        <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2.5 text-center">Session layout</p>
                                        <AnimatePresence mode="wait">
                                            {useCanvas ? (
                                                <motion.div
                                                    key="canvas-layout"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="flex gap-3 h-52"
                                                >
                                                    {/* Reference — 40% */}
                                                    <div className="w-[40%] rounded-xl border-2 border-dashed border-primary/50 bg-primary/[0.04] flex flex-col items-center justify-center gap-2">
                                                        <ImageIcon className="w-7 h-7 text-primary/40" />
                                                        <span className="text-xs font-bold text-primary/60">Reference</span>
                                                        <span className="text-[10px] text-muted/50">40%</span>
                                                    </div>
                                                    {/* Canvas — 60% */}
                                                    <div className="flex-1 rounded-xl border-2 border-dashed border-border bg-muted/[0.03] flex flex-col items-center justify-center gap-2">
                                                        <Pencil className="w-7 h-7 text-muted/40" />
                                                        <span className="text-xs font-bold text-muted/60">Your Canvas</span>
                                                        <span className="text-[10px] text-muted/40">Draw here</span>
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="ref-layout"
                                                    initial={{ opacity: 0, y: 6 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -6 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="h-52 rounded-xl border-2 border-dashed border-primary/50 bg-primary/[0.04] flex flex-col items-center justify-center gap-2"
                                                >
                                                    <ImageIcon className="w-10 h-10 text-primary/40" />
                                                    <span className="text-sm font-bold text-primary/60">Reference Image</span>
                                                    <span className="text-xs text-muted/50">Study and draw on paper</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Stats row */}
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1.5 text-muted">
                                            <Layers className="w-3.5 h-3.5" />
                                            <span>{numDrawings} drawings</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-border" />
                                        <div className="flex items-center gap-1.5 text-muted">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>{formatTime(timePerDrawing)} each</span>
                                        </div>
                                        <div className="w-1 h-1 rounded-full bg-border" />
                                        <div className="flex items-center gap-1.5 text-muted">
                                            <Zap className="w-3.5 h-3.5" />
                                            <span>{formatTime(totalTime)} total</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Post-drawing share modal */}
                <AnimatePresence>
                    {selectedResult && (
                        <PostDrawingPanel
                            result={selectedResult}
                            onClose={() => setSelectedResult(null)}
                            onUploadToProfile={async (withRef) => {
                                if (!selectedResult.canvasDataUrl) throw new Error("no canvas");
                                await createPost({
                                    title: selectedResult.drawing.label,
                                    imageUrl: selectedResult.canvasDataUrl,
                                    category: "Study",
                                    description: withRef
                                        ? `Gesture study with reference: ${selectedResult.drawing.label}`
                                        : `Gesture study: ${selectedResult.drawing.label}`,
                                });
                            }}
                            onDownload={() => { }}
                        />
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}
