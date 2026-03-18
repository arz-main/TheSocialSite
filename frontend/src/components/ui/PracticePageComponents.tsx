import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import {
    Pause, Play, SkipForward, Download, Upload,
    Send, X, Pencil, Eraser, Minus, Plus, Check, Image, CheckCircle2
} from "lucide-react";
import { Button } from "../ui/BasicButton";
import { TimerBar, ProgressPills } from "../ui/PracticePageUIComponents";
import { downloadDataUrl } from "../../utils/PracticePageUtils";
import type {
    ActiveSessionPanelProps, DrawingReviewGridProps,
    PostDrawingPanelProps, SessionResult
} from "../../types/PracticePageTypes";

// ── DrawingCanvas ─────────────────────────────────────────────────────────────
interface DrawingCanvasProps {
    onCapture: (dataUrl: string) => void;
    triggerCapture: boolean;
    clearSignal: number;
}

export function DrawingCanvas({ onCapture, triggerCapture, clearSignal }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const [tool, setTool] = useState<"brush" | "eraser">("brush");
    const [brushSize, setBrushSize] = useState(4);
    const [color, setColor] = useState("#1C0D0C");

    const COLORS = ["#1C0D0C", "#C94A3D", "#4AC2B1", "#FFB703", "#6366f1", "#000000"];

    const fillWhite = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx) return;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }, []);

    // White on mount
    useEffect(() => { fillWhite(); }, [fillWhite]);
    // Clear on new drawing
    useEffect(() => { if (clearSignal > 0) fillWhite(); }, [clearSignal, fillWhite]);
    // Capture
    useEffect(() => {
        if (!triggerCapture) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        onCapture(canvas.toDataURL("image/png"));
    }, [triggerCapture, onCapture]);

    const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        if ("touches" in e) {
            return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
        }
        return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    };

    const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        drawing.current = true;
        lastPos.current = getPos(e, canvas);
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!drawing.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!canvas || !ctx || !lastPos.current) return;
        e.preventDefault();
        const pos = getPos(e, canvas);
        ctx.beginPath();
        ctx.moveTo(lastPos.current.x, lastPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = tool === "eraser" ? "#ffffff" : color;
        ctx.lineWidth = tool === "eraser" ? brushSize * 4 : brushSize;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
        lastPos.current = pos;
    };

    const stopDraw = () => { drawing.current = false; lastPos.current = null; };

    return (
        <div className="flex flex-col h-full gap-1.5 min-h-0">
            {/* Compact toolbar */}
            <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0">
                <button onClick={() => setTool("brush")}
                    className={`p-1 rounded-md transition-colors ${tool === "brush" ? "bg-primary text-white" : "bg-card text-text-opaque hover:bg-primary/10"}`}>
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setTool("eraser")}
                    className={`p-1 rounded-md transition-colors ${tool === "eraser" ? "bg-primary text-white" : "bg-card text-text-opaque hover:bg-primary/10"}`}>
                    <Eraser className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-center gap-0.5">
                    <button onClick={() => setBrushSize(s => Math.max(1, s - 1))} className="p-0.5 rounded text-text-opaque hover:text-text">
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-text-opaque w-4 text-center">{brushSize}</span>
                    <button onClick={() => setBrushSize(s => Math.min(40, s + 1))} className="p-0.5 rounded text-text-opaque hover:text-text">
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
                <div className="flex items-center gap-1">
                    {COLORS.map(c => (
                        <button key={c} onClick={() => { setColor(c); setTool("brush"); }}
                            className={`w-4 h-4 rounded-full border-2 transition-transform ${color === c && tool === "brush" ? "scale-125 border-primary" : "border-transparent hover:scale-110"}`}
                            style={{ backgroundColor: c, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #ccc" : undefined }}
                        />
                    ))}
                </div>
                <button onClick={fillWhite} className="ml-auto text-xs text-text-opaque hover:text-red-400 transition-colors px-1.5 py-0.5 rounded hover:bg-red-50">
                    Clear
                </button>
            </div>
            {/* Canvas fills all remaining height */}
            <canvas
                ref={canvasRef}
                width={800} height={600}
                className="w-full rounded-lg border border-border touch-none cursor-crosshair"
                style={{ background: "#ffffff", display: "block", flex: "1 1 0", minHeight: 0 }}
                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw}
            />
        </div>
    );
}

// ── ActiveSessionPanel ────────────────────────────────────────────────────────
export function ActiveSessionPanel({
    drawing, drawingIndex, totalDrawings, timeLeft, timePerDrawing,
    sessionState, useCanvas, clearSignal, onPause, onResume, onSkip, onStop, onCanvasCapture,
}: ActiveSessionPanelProps) {
    const [triggerCapture, setTriggerCapture] = useState(false);

    const captureAndThen = useCallback((cb: () => void) => {
        if (!useCanvas) { cb(); return; }
        setTriggerCapture(true);
        setTimeout(() => { setTriggerCapture(false); cb(); }, 50);
    }, [useCanvas]);

    const handleCapture = useCallback((dataUrl: string) => {
        onCanvasCapture(drawing.id, dataUrl);
    }, [drawing.id, onCanvasCapture]);

    return (
        // Exactly fills parent (which is already clamped to viewport minus navbar+footer)
        <div className="flex flex-col w-full h-full overflow-hidden">

            {/* ── Top bar — compact ── */}
            <div className="flex items-center gap-3 px-4 py-2 bg-card border-b border-border flex-shrink-0">
                <span className="text-text-opaque text-xs whitespace-nowrap">
                    <span className="text-text font-semibold">{drawingIndex + 1}</span>
                    <span className="mx-0.5">/</span>
                    {totalDrawings}
                </span>
                <div className="flex-1 min-w-0">
                    <ProgressPills total={totalDrawings} current={drawingIndex} />
                </div>
                <button onClick={() => captureAndThen(onStop)}
                    className="flex items-center gap-1 px-2 py-1 border border-border hover:border-red-400 hover:text-red-400 text-text-opaque text-xs rounded-lg transition-colors flex-shrink-0">
                    End
                </button>
            </div>

            {/* ── Main — fills remaining space, no overflow ── */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                {useCanvas ? (
                    <>
                        {/* Reference — 40% width, image letterboxed to fill */}
                        <div className="w-2/5 relative flex items-center justify-center border-r border-border overflow-hidden bg-background p-2">
                            <img
                                key={drawing.id}
                                src={drawing.src}
                                alt={drawing.label}
                                className="rounded-lg shadow object-contain"
                                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                            />
                            {sessionState === "paused" && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-lg font-semibold">Paused</span>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-xs text-center text-white/80 truncate drop-shadow">{drawing.label}</p>
                            </div>
                        </div>
                        {/* Canvas — 60%, fills height exactly */}
                        <div className="flex-1 flex flex-col p-2 min-h-0 overflow-hidden bg-background">
                            <DrawingCanvas
                                onCapture={handleCapture}
                                triggerCapture={triggerCapture}
                                clearSignal={clearSignal}
                            />
                        </div>
                    </>
                ) : (
                    // No canvas — reference letterboxed, fills available space exactly
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-background">
                        <img
                            key={drawing.id}
                            src={drawing.src}
                            alt={drawing.label}
                            style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                        {sessionState === "paused" && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <span className="text-white text-2xl font-semibold tracking-wide">Paused</span>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-6 py-3">
                            <p className="text-white text-xs font-medium">{drawing.label}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* ── Bottom controls — compact ── */}
            <div className="flex items-center gap-3 px-4 py-2 bg-card border-t border-border flex-shrink-0">
                <TimerBar timeLeft={timeLeft} total={timePerDrawing} />
                <div className="flex gap-1.5 flex-shrink-0">
                    {sessionState === "paused" ? (
                        <Button variant="primary" size="sm" onClick={onResume}><Play className="w-3.5 h-3.5" /> Resume</Button>
                    ) : (
                        <Button variant="primary" size="sm" onClick={onPause}><Pause className="w-3.5 h-3.5" /> Pause</Button>
                    )}
                    <Button variant="primary" size="sm" onClick={() => captureAndThen(onSkip)}>
                        <SkipForward className="w-3.5 h-3.5" /> Skip
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ── PostDrawingPanel ──────────────────────────────────────────────────────────
export function PostDrawingPanel({ result, onClose, onUploadToProfile, onSendToFriend, onDownload }: PostDrawingPanelProps) {
    const [uploadedWithRef, setUploadedWithRef] = useState<boolean | null>(null);

    const handleDownload = () => {
        if (result.canvasDataUrl) downloadDataUrl(result.canvasDataUrl, `drawing-${result.drawing.id}.png`);
        onDownload();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                    <h3 className="text-text font-bold text-lg">Share Your Drawing</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 text-text-opaque transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                    <div className="flex gap-3">
                        <div className="flex-1 relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
                            <img src={result.drawing.src} alt="Reference" className="max-h-full max-w-full object-contain" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                <p className="text-white text-xs">Reference</p>
                            </div>
                        </div>
                        {result.canvasDataUrl ? (
                            <div className="flex-1 relative rounded-xl overflow-hidden bg-white aspect-video flex items-center justify-center border border-border">
                                <img src={result.canvasDataUrl} alt="Your drawing" className="max-h-full max-w-full object-contain" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1">
                                    <p className="text-white text-xs">Your Drawing</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 rounded-xl border-2 border-dashed border-border bg-background aspect-video flex flex-col items-center justify-center gap-2 text-text-opaque">
                                <Image className="w-8 h-8 opacity-40" />
                                <p className="text-xs">No canvas used</p>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-text-opaque text-center">{result.drawing.label}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                            <div className="flex items-center gap-2 text-text font-semibold text-sm">
                                <Upload className="w-4 h-4 text-primary" /> Upload to Profile
                            </div>
                            <p className="text-xs text-text-opaque">Share with your followers</p>
                            <div className="flex flex-col gap-1.5 mt-1">
                                <button onClick={() => { setUploadedWithRef(false); onUploadToProfile(false); }}
                                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors border ${uploadedWithRef === false ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary text-text-opaque hover:text-text"}`}>
                                    <Check className={`w-3 h-3 ${uploadedWithRef === false ? "opacity-100" : "opacity-0"}`} />
                                    Drawing only
                                </button>
                                <button onClick={() => { setUploadedWithRef(true); onUploadToProfile(true); }}
                                    className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors border ${uploadedWithRef === true ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary text-text-opaque hover:text-text"}`}>
                                    <Check className={`w-3 h-3 ${uploadedWithRef === true ? "opacity-100" : "opacity-0"}`} />
                                    With reference
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                            <div className="flex items-center gap-2 text-text font-semibold text-sm">
                                <Send className="w-4 h-4 text-primary" /> Send to Friend
                            </div>
                            <p className="text-xs text-text-opaque">Share via messages</p>
                            <button onClick={onSendToFriend}
                                className="mt-auto w-full px-2 py-1.5 rounded-lg text-xs border border-border hover:border-primary text-text-opaque hover:text-primary transition-colors">
                                Choose friend...
                            </button>
                        </div>
                        <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                            <div className="flex items-center gap-2 text-text font-semibold text-sm">
                                <Download className="w-4 h-4 text-primary" /> Download
                            </div>
                            <p className="text-xs text-text-opaque">Save to your device</p>
                            <button onClick={handleDownload} disabled={!result.canvasDataUrl}
                                className="mt-auto w-full px-2 py-1.5 rounded-lg text-xs border border-border hover:border-primary text-text-opaque hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                {result.canvasDataUrl ? "Download PNG" : "No canvas to save"}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ── DrawingReviewGrid ─────────────────────────────────────────────────────────
export function DrawingReviewGrid({ results, useCanvas, onSelectResult, onFinish }: DrawingReviewGridProps) {
    return (
        <div className="flex flex-col h-full rounded-xl bg-card shadow p-5 gap-4 overflow-y-auto">
            <div className="flex items-center justify-between flex-shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-text">🎉 Session Complete!</h2>
                    <p className="text-sm text-text-opaque mt-0.5">
                        {results.length} drawing{results.length > 1 ? "s" : ""} — click any to share or download
                    </p>
                </div>
                {/* Finish goes back to idle/setup */}
                <Button variant="primary" onClick={onFinish}>
                    <CheckCircle2 className="w-4 h-4" /> Finish
                </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {results.map((result, i) => (
                    <motion.div key={result.drawing.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        className="group relative rounded-xl overflow-hidden bg-black cursor-pointer hover:ring-2 hover:ring-primary transition-all aspect-square"
                        onClick={() => onSelectResult(result)}>
                        <img src={result.canvasDataUrl ?? result.drawing.src} alt={result.drawing.label}
                            className="w-full h-full object-cover" />
                        {useCanvas && result.canvasDataUrl && (
                            <img src={result.drawing.src} alt="ref"
                                className="absolute bottom-1 right-1 w-10 h-10 rounded-lg object-cover border-2 border-white/60 shadow" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex flex-col items-center gap-1 text-white">
                                <Upload className="w-5 h-5" />
                                <span className="text-xs font-medium">Share</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1">
                            <p className="text-white text-[10px] leading-tight truncate">{result.drawing.label}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}