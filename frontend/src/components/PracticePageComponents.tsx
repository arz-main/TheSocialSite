import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "motion/react";
import {
    Pause, Play, SkipForward, Download,
    Send, X, Pencil, Eraser, Minus, Plus, Check, CheckCircle2,
    Square, Loader2, ImageOff
} from "lucide-react";
import { Button } from "./BasicButton";
import { TimerBar, ProgressPills } from "./PracticePageUIComponents";
import { downloadDataUrl } from "../utils/PracticePageUtils";
import type {
    ActiveSessionPanelProps, DrawingReviewGridProps,
    PostDrawingPanelProps, SessionResult
} from "../types/PracticePageTypes";

// ── DrawingCanvas ─────────────────────────────────────────────────────────────
interface DrawingCanvasProps {
    onCapture: (dataUrl: string) => void;
    triggerCapture: boolean;
    clearSignal: number;
    onFirstStroke?: () => void;
}

export function DrawingCanvas({ onCapture, triggerCapture, clearSignal, onFirstStroke }: DrawingCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawing = useRef(false);
    const lastPos = useRef<{ x: number; y: number } | null>(null);
    const hasDrawnRef = useRef(false);
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

    useEffect(() => { fillWhite(); }, [fillWhite]);
    useEffect(() => {
        if (clearSignal > 0) {
            fillWhite();
            hasDrawnRef.current = false;
        }
    }, [clearSignal, fillWhite]);
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
        if (!hasDrawnRef.current) {
            hasDrawnRef.current = true;
            onFirstStroke?.();
        }
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
            <div className="flex items-center gap-1.5 flex-wrap flex-shrink-0 bg-card/80 rounded-lg px-2 py-1.5 border border-border">
                <button onClick={() => setTool("brush")}
                    className={`p-1 rounded-md transition-colors ${tool === "brush" ? "bg-primary text-white" : "text-muted hover:bg-primary/10"}`}>
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setTool("eraser")}
                    className={`p-1 rounded-md transition-colors ${tool === "eraser" ? "bg-primary text-white" : "text-muted hover:bg-primary/10"}`}>
                    <Eraser className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-0.5">
                    <button onClick={() => setBrushSize(s => Math.max(1, s - 1))} className="p-0.5 rounded text-muted hover:text-text">
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs text-muted w-4 text-center">{brushSize}</span>
                    <button onClick={() => setBrushSize(s => Math.min(40, s + 1))} className="p-0.5 rounded text-muted hover:text-text">
                        <Plus className="w-3 h-3" />
                    </button>
                </div>
                <div className="w-px h-4 bg-border" />
                <div className="flex items-center gap-1">
                    {COLORS.map(c => (
                        <button key={c} onClick={() => { setColor(c); setTool("brush"); }}
                            className={`w-4 h-4 rounded-full border-2 transition-transform ${color === c && tool === "brush" ? "scale-125 border-primary" : "border-transparent hover:scale-110"}`}
                            style={{ backgroundColor: c, boxShadow: c === "#ffffff" ? "inset 0 0 0 1px #ccc" : undefined }}
                        />
                    ))}
                </div>
                <button onClick={fillWhite} className="ml-auto text-xs text-muted hover:text-red-400 transition-colors px-1.5 py-0.5 rounded hover:bg-red-50/10">
                    Clear
                </button>
            </div>
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
    onDrawingStarted, captureRef,
}: ActiveSessionPanelProps) {
    const [triggerCapture, setTriggerCapture] = useState(false);

    const captureAndThen = useCallback((cb: () => void) => {
        if (!useCanvas) { cb(); return; }
        setTriggerCapture(true);
        setTimeout(() => { setTriggerCapture(false); cb(); }, 50);
    }, [useCanvas]);

    useEffect(() => {
        if (captureRef) captureRef.current = captureAndThen;
    }, [captureRef, captureAndThen]);

    const handleCapture = useCallback((dataUrl: string) => {
        onCanvasCapture(drawing.id, dataUrl);
    }, [drawing.id, onCanvasCapture]);

    return (
        <div className="flex flex-col w-full h-full overflow-hidden">

            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-2 bg-card border-b border-border shrink-0">
                <span className="text-muted text-xs whitespace-nowrap">
                    <span className="text-text font-bold">{drawingIndex + 1}</span>
                    <span className="mx-0.5 opacity-50">/</span>
                    <span>{totalDrawings}</span>
                </span>
                <div className="flex-1 min-w-0">
                    <ProgressPills total={totalDrawings} current={drawingIndex} />
                </div>
            </div>

            {/* Main */}
            <div className="flex flex-1 overflow-hidden min-h-0">
                {useCanvas ? (
                    <>
                        <div className="w-2/5 relative border-r border-border overflow-hidden bg-black">
                            <img key={drawing.id} src={drawing.src} alt={drawing.label}
                                className="w-full h-full object-contain" />
                            {sessionState === "paused" && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-lg font-semibold">Paused</span>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2">
                                <p className="text-xs text-center text-white/80 truncate drop-shadow">{drawing.label}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col p-2 min-h-0 overflow-hidden bg-background">
                            <DrawingCanvas
                                onCapture={handleCapture}
                                triggerCapture={triggerCapture}
                                clearSignal={clearSignal}
                                onFirstStroke={() => onDrawingStarted?.(drawing.id)}
                            />
                        </div>
                    </>
                ) : (
                    <div className="flex-1 relative overflow-hidden bg-black">
                        <img key={drawing.id} src={drawing.src} alt={drawing.label}
                            className="w-full h-full object-contain" />
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

            {/* Bottom controls — End button next to timer */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-card border-t border-border shrink-0">
                <button
                    onClick={() => captureAndThen(onStop)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/40 hover:bg-red-500/20 hover:border-red-500 text-red-400 hover:text-red-500 text-xs font-bold transition-all shrink-0"
                >
                    <Square className="w-3 h-3 fill-current" /> End
                </button>
                <div className="flex-1 min-w-0">
                    <TimerBar timeLeft={timeLeft} total={timePerDrawing} />
                </div>
                <div className="flex gap-1.5 shrink-0">
                    {sessionState === "paused" ? (
                        <Button variant="primary" size="sm" onClick={onResume}>
                            <Play className="w-3.5 h-3.5" /> Resume
                        </Button>
                    ) : (
                        <Button variant="primary" size="sm" onClick={onPause}>
                            <Pause className="w-3.5 h-3.5" /> Pause
                        </Button>
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
export function PostDrawingPanel({ result, onClose, onUploadToProfile, onDownload }: PostDrawingPanelProps) {
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [uploadedWithRef, setUploadedWithRef] = useState<boolean | null>(null);
    const hasCanvas = !!result.canvasDataUrl;

    const handleUpload = async (withRef: boolean) => {
        if (!hasCanvas || uploadStatus === 'loading' || uploadStatus === 'success') return;
        setUploadedWithRef(withRef);
        setUploadStatus('loading');
        try {
            await onUploadToProfile(withRef);
            setUploadStatus('success');
        } catch {
            setUploadStatus('error');
        }
    };

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
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-primary/10 text-muted transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-5 flex flex-col gap-4">
                    {/* Images */}
                    <div className={`flex gap-3 ${!hasCanvas ? "" : ""}`}>
                        <div className={`relative rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center ${hasCanvas ? "flex-1" : "w-full"}`}>
                            <img src={result.drawing.src} alt="Reference" className="max-h-full max-w-full object-contain" />
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
                                <p className="text-white text-xs">Reference</p>
                            </div>
                        </div>
                        {hasCanvas && (
                            <div className="flex-1 relative rounded-xl overflow-hidden bg-white aspect-video flex items-center justify-center border border-border">
                                <img src={result.canvasDataUrl!} alt="Your drawing" className="max-h-full max-w-full object-contain" />
                                <div className="absolute bottom-0 left-0 right-0 bg-black/40 px-2 py-1">
                                    <p className="text-white text-xs">Your Drawing</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-muted text-center">{result.drawing.label}</p>

                    <div className={`grid gap-3 ${hasCanvas ? "grid-cols-1 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
                        {/* Upload to Profile */}
                        {hasCanvas && (
                            <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                                <div className="flex items-center gap-2 text-text font-semibold text-sm">
                                    <Send className="w-4 h-4 text-primary" /> Post to Profile
                                </div>
                                <p className="text-xs text-muted">Share with your followers</p>
                                {uploadStatus === 'success' ? (
                                    <div className="mt-1 flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 text-xs font-semibold">
                                        <Check className="w-3.5 h-3.5" /> Posted!
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1.5 mt-1">
                                        <button
                                            onClick={() => handleUpload(false)}
                                            disabled={uploadStatus === 'loading'}
                                            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors border
                                                ${uploadedWithRef === false && uploadStatus !== 'error'
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary text-muted hover:text-text"
                                                }`}
                                        >
                                            {uploadStatus === 'loading' && uploadedWithRef === false
                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                : <Check className={`w-3 h-3 ${uploadedWithRef === false ? "opacity-100" : "opacity-0"}`} />
                                            }
                                            Drawing only
                                        </button>
                                        <button
                                            onClick={() => handleUpload(true)}
                                            disabled={uploadStatus === 'loading'}
                                            className={`w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs transition-colors border
                                                ${uploadedWithRef === true && uploadStatus !== 'error'
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border hover:border-primary text-muted hover:text-text"
                                                }`}
                                        >
                                            {uploadStatus === 'loading' && uploadedWithRef === true
                                                ? <Loader2 className="w-3 h-3 animate-spin" />
                                                : <Check className={`w-3 h-3 ${uploadedWithRef === true ? "opacity-100" : "opacity-0"}`} />
                                            }
                                            With reference
                                        </button>
                                        {uploadStatus === 'error' && (
                                            <p className="text-xs text-red-400">Upload failed. Try again.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Send to Friend */}
                        <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                            <div className="flex items-center gap-2 text-text font-semibold text-sm">
                                <Send className="w-4 h-4 text-primary" /> Send to Friend
                            </div>
                            <p className="text-xs text-muted">Share via messages</p>
                            <button
                                className="mt-auto w-full px-2 py-1.5 rounded-lg text-xs border border-border text-muted hover:border-primary hover:text-text transition-colors opacity-50 cursor-not-allowed"
                                disabled
                                title="Coming soon"
                            >
                                Coming soon
                            </button>
                        </div>

                        {/* Download */}
                        <div className="flex flex-col gap-2 p-3 rounded-xl border border-border bg-background">
                            <div className="flex items-center gap-2 text-text font-semibold text-sm">
                                <Download className="w-4 h-4 text-primary" /> Download
                            </div>
                            <p className="text-xs text-muted">Save to your device</p>
                            <button onClick={handleDownload} disabled={!hasCanvas}
                                className="mt-auto w-full px-2 py-1.5 rounded-lg text-xs border border-border hover:border-primary text-muted hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                {hasCanvas ? "Download PNG" : "No canvas to save"}
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
        <div className="flex flex-col h-full rounded-xl bg-card shadow p-5 gap-4 overflow-hidden">
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h2 className="text-xl font-bold text-text">🎉 Session Complete!</h2>
                    <p className="text-sm text-muted mt-0.5">
                        {results.length} drawing{results.length > 1 ? "s" : ""} — click any to share or download
                    </p>
                </div>
                <Button variant="primary" onClick={onFinish}>
                    <CheckCircle2 className="w-4 h-4" /> Finish
                </Button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {results.map((result, i) => {
                        const showCanvas = useCanvas && !!result.canvasDataUrl;
                        return (
                            <motion.div
                                key={result.drawing.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="group relative rounded-xl overflow-hidden bg-black cursor-pointer hover:ring-2 hover:ring-primary transition-all aspect-square"
                                onClick={() => onSelectResult(result)}
                            >
                                <img
                                    src={showCanvas ? result.canvasDataUrl! : result.drawing.src}
                                    alt={result.drawing.label}
                                    className="w-full h-full object-cover"
                                />
                                {showCanvas && (
                                    <img
                                        src={result.drawing.src}
                                        alt="ref"
                                        className="absolute bottom-1 right-1 w-10 h-10 rounded-lg object-cover border-2 border-white/60 shadow"
                                    />
                                )}
                                {!showCanvas && useCanvas && (
                                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-black/60 rounded px-1.5 py-0.5">
                                        <ImageOff className="w-2.5 h-2.5 text-white/70" />
                                        <span className="text-[9px] text-white/70">no drawing</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="flex flex-col items-center gap-1 text-white">
                                        <Send className="w-5 h-5" />
                                        <span className="text-xs font-medium">Share</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 pt-4 pb-1">
                                    <p className="text-white text-[10px] leading-tight truncate">{result.drawing.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
