import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    X, Paintbrush, Pencil, Eraser, RotateCcw, Undo,
    ChevronRight, ChevronLeft, Check, Save, Send,
    UserCircle2, Image as ImageIcon, ZoomIn
} from 'lucide-react';
import type { Lesson } from '../../_mock/mockCourses';

interface Props {
    lesson: Lesson;
    courseTitle: string;
    onClose: () => void;
    onComplete: () => void;
}

type ToolType = 'brush' | 'pencil' | 'eraser';

interface Point { x: number; y: number; }
interface Stroke { points: Point[]; color: string; size: number; tool: ToolType; }

const COLORS = ['#1C0D0C', '#C94A3D', '#4AC2B1', '#7a5c8a', '#4a6a8a', '#E09F3E', '#2E8B57', '#555'];

function useCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const strokeHistory = useRef<Stroke[]>([]);
    const currentStroke = useRef<Point[]>([]);

    const initCanvas = useCallback(() => {
        const c = canvasRef.current;
        const ct = containerRef.current;
        if (!c || !ct) return;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        c.width = ct.offsetWidth;
        c.height = ct.offsetHeight;
        ctx.fillStyle = '#FFFDF7';
        ctx.fillRect(0, 0, c.width, c.height);
    }, []);

    const paintStroke = useCallback((ctx: CanvasRenderingContext2D, s: Stroke) => {
        if (s.points.length < 2) return;
        ctx.save();
        if (s.tool === 'eraser') {
            ctx.strokeStyle = '#FFFDF7';
            ctx.lineWidth = s.size * 4;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.globalAlpha = 1;
            ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
            s.points.forEach(p => ctx.lineTo(p.x, p.y));
            ctx.stroke();
        } else if (s.tool === 'pencil') {
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = Math.max(1, s.size * 0.65);
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
            for (let i = 1; i < s.points.length; i++) {
                const mx = (s.points[i - 1].x + s.points[i].x) / 2;
                const my = (s.points[i - 1].y + s.points[i].y) / 2;
                ctx.quadraticCurveTo(s.points[i - 1].x, s.points[i - 1].y, mx, my);
            }
            ctx.stroke();
            ctx.globalAlpha = 0.1;
            ctx.fillStyle = s.color;
            for (let i = 0; i < s.points.length; i += 3) {
                const jx = (Math.random() - 0.5) * s.size * 1.5;
                const jy = (Math.random() - 0.5) * s.size * 1.5;
                ctx.beginPath();
                ctx.arc(s.points[i].x + jx, s.points[i].y + jy, Math.random() * s.size * 0.4, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            ctx.globalAlpha = 1;
            ctx.strokeStyle = s.color;
            ctx.lineWidth = s.size;
            ctx.lineCap = 'round'; ctx.lineJoin = 'round';
            ctx.beginPath(); ctx.moveTo(s.points[0].x, s.points[0].y);
            for (let i = 1; i < s.points.length; i++) {
                const mx = (s.points[i - 1].x + s.points[i].x) / 2;
                const my = (s.points[i - 1].y + s.points[i].y) / 2;
                ctx.quadraticCurveTo(s.points[i - 1].x, s.points[i - 1].y, mx, my);
            }
            ctx.stroke();
        }
        ctx.restore();
    }, []);

    const redraw = useCallback((strokes: Stroke[]) => {
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#FFFDF7';
        ctx.fillRect(0, 0, c.width, c.height);
        strokes.forEach(s => paintStroke(ctx, s));
    }, [paintStroke]);

    const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement>): Point => {
        const c = canvasRef.current!;
        const r = c.getBoundingClientRect();
        return { x: (e.clientX - r.left) * (c.width / r.width), y: (e.clientY - r.top) * (c.height / r.height) };
    }, []);

    const getDataURL = () => canvasRef.current?.toDataURL('image/png') ?? '';

    const clearCanvas = useCallback(() => {
        strokeHistory.current = [];
        const c = canvasRef.current;
        const ctx = c?.getContext('2d');
        if (ctx && c) { ctx.fillStyle = '#FFFDF7'; ctx.fillRect(0, 0, c.width, c.height); }
    }, []);

    const undo = useCallback(() => {
        strokeHistory.current = strokeHistory.current.slice(0, -1);
        redraw(strokeHistory.current);
    }, [redraw]);

    return { canvasRef, containerRef, strokeHistory, currentStroke, initCanvas, paintStroke, redraw, getPos, getDataURL, clearCanvas, undo };
}

function ReferencePostPreview({ drawing, reference, onClose }: { drawing: string; reference: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-card rounded-2xl shadow-2xl overflow-hidden max-w-md w-full border border-border"
                onClick={e => e.stopPropagation()}
            >
                {/* Post header */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-text">You</p>
                        <p className="text-xs text-muted">Just now</p>
                    </div>
                    <button onClick={onClose} className="ml-auto text-muted hover:text-text transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Drawing with reference overlay */}
                <div className="relative bg-black">
                    <img src={drawing} alt="Your drawing" className="w-full block" />
                    {/* Reference as small box bottom-right */}
                    <div className="absolute bottom-3 right-3 w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-lg">
                        <img src={reference} alt="Reference" className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[9px] text-center py-0.5 font-medium tracking-wide">
                            REFERENCE
                        </div>
                    </div>
                </div>

                {/* Caption */}
                <div className="px-4 py-3">
                    <span className="text-xs font-semibold text-primary cursor-pointer hover:underline">made with reference</span>
                    <span className="text-sm text-text ml-1">— click to see side by side</span>
                </div>
            </motion.div>
        </motion.div>
    );
}

function SideBySideView({ drawing, reference, onClose }: { drawing: string; reference: string; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 p-6"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="bg-card rounded-2xl shadow-2xl overflow-hidden max-w-3xl w-full border border-border"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <h3 className="font-semibold text-text text-sm">Drawing vs Reference</h3>
                    <button onClick={onClose} className="text-muted hover:text-text transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="grid grid-cols-2 gap-0">
                    <div className="relative">
                        <img src={drawing} alt="Your drawing" className="w-full block" />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">Your Drawing</div>
                    </div>
                    <div className="relative border-l border-border">
                        <img src={reference} alt="Reference" className="w-full h-full object-cover block" />
                        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">Reference</div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function CompleteScreen({
    drawings, references, lessonTitle,
    onClose, onComplete
}: {
    drawings: string[];
    references: string[];
    lessonTitle: string;
    onClose: () => void;
    onComplete: () => void;
}) {
    const [showPost, setShowPost] = useState(false);
    const [showSideBySide, setShowSideBySide] = useState(false);
    const [sendModalOpen, setSendModalOpen] = useState(false);
    const [savedToProfile, setSavedToProfile] = useState(false);
    const [sendMessage, setSendMessage] = useState('');
    const [sendTo, setSendTo] = useState('');
    const [sent, setSent] = useState(false);
    const [activeRef, setActiveRef] = useState(0);

    const handleSaveToProfile = () => {
        setSavedToProfile(true);
        setTimeout(() => setShowPost(true), 400);
    };

    const handleSend = () => {
        setSent(true);
        setTimeout(() => { setSendModalOpen(false); setSent(false); }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-background z-[100] overflow-auto">
            <div className="max-w-2xl mx-auto px-6 py-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.15 }}
                            className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <Check className="w-8 h-8 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-text mb-1">Practice Complete!</h2>
                        <p className="text-muted text-sm">{lessonTitle}</p>
                    </div>

                    {/* Reference selector if multiple */}
                    {references.length > 1 && (
                        <div className="flex gap-2 mb-4 justify-center">
                            {references.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveRef(i)}
                                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all ${i === activeRef ? 'border-primary' : 'border-border'}`}
                                >
                                    <img src={drawings[i]} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Drawing preview */}
                    <div className="relative rounded-xl overflow-hidden border border-border shadow-lg mb-6 bg-black">
                        <img src={drawings[activeRef]} alt="Your drawing" className="w-full block" />
                        {/* Small reference overlay */}
                        <div className="absolute bottom-3 right-3 w-20 h-20 rounded-lg overflow-hidden border-2 border-white shadow-md">
                            <img src={references[activeRef]} alt="Reference" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[8px] text-center py-0.5 font-medium">REF</div>
                        </div>
                        {/* Side by side button */}
                        <button
                            onClick={() => setShowSideBySide(true)}
                            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1.5 rounded-lg transition-colors"
                        >
                            <ZoomIn className="w-3.5 h-3.5" /> Compare
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        {!savedToProfile ? (
                            <button
                                onClick={handleSaveToProfile}
                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors"
                            >
                                <Save className="w-4 h-4" /> Save to Profile
                            </button>
                        ) : (
                            <div className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/15 text-green-600 font-semibold text-sm border border-green-300">
                                <Check className="w-4 h-4" /> Saved to Profile
                            </div>
                        )}
                        <button
                            onClick={() => setSendModalOpen(true)}
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-text font-semibold text-sm hover:border-primary hover:text-primary transition-colors"
                        >
                            <Send className="w-4 h-4" /> Send to a Friend
                        </button>
                    </div>

                    <button
                        onClick={() => { onComplete(); onClose(); }}
                        className="w-full mt-3 py-2.5 rounded-xl text-sm text-muted hover:text-text border border-transparent hover:border-border transition-colors"
                    >
                        Close without saving
                    </button>
                </motion.div>
            </div>

            {/* Saved-to-profile post preview */}
            <AnimatePresence>
                {showPost && (
                    <ReferencePostPreview
                        drawing={drawings[activeRef]}
                        reference={references[activeRef]}
                        onClose={() => setShowPost(false)}
                    />
                )}
            </AnimatePresence>

            {/* Side by side comparison */}
            <AnimatePresence>
                {showSideBySide && (
                    <SideBySideView
                        drawing={drawings[activeRef]}
                        reference={references[activeRef]}
                        onClose={() => setShowSideBySide(false)}
                    />
                )}
            </AnimatePresence>

            {/* Send to friend modal */}
            <AnimatePresence>
                {sendModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-6"
                        onClick={() => setSendModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 16 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 16 }}
                            className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border p-6"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-text">Send to a Friend</h3>
                                <button onClick={() => setSendModalOpen(false)} className="text-muted hover:text-text"><X className="w-4 h-4" /></button>
                            </div>

                            {/* Drawing preview with attached reference */}
                            <div className="relative rounded-xl overflow-hidden border border-border mb-4 bg-black">
                                <img src={drawings[activeRef]} alt="" className="w-full block" />
                                <div className="absolute bottom-2 right-2 w-14 h-14 rounded-md overflow-hidden border-2 border-white shadow">
                                    <img src={references[activeRef]} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[7px] text-center py-0.5">REF</div>
                                </div>
                                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full">
                                    <ImageIcon className="w-2.5 h-2.5" /> Reference attached
                                </div>
                            </div>

                            <input
                                type="text"
                                placeholder="To: username or email"
                                value={sendTo}
                                onChange={e => setSendTo(e.target.value)}
                                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-text placeholder:text-muted mb-3 focus:outline-none focus:border-primary transition-colors"
                            />
                            <textarea
                                placeholder="Add a message... (optional)"
                                value={sendMessage}
                                onChange={e => setSendMessage(e.target.value)}
                                rows={2}
                                className="w-full border border-border rounded-xl px-3 py-2 text-sm bg-background text-text placeholder:text-muted mb-4 focus:outline-none focus:border-primary transition-colors resize-none"
                            />

                            <button
                                onClick={handleSend}
                                disabled={!sendTo.trim() || sent}
                                className="w-full py-2.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {sent ? <><Check className="w-4 h-4" /> Sent!</> : <><Send className="w-4 h-4" /> Send</>}
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Made by Claude — Main Practice Modal
// ─────────────────────────────────────────────────────────────────────────────

export default function LessonPracticeModal({ lesson, courseTitle, onClose, onComplete }: Props) {
    const refs = lesson.practiceRefs ?? [];
    const [currentRef, setCurrentRef] = useState(0);
    const [tool, setTool] = useState<ToolType>('brush');
    const [brushSize, setBrushSize] = useState(4);
    const [color, setColor] = useState('#1C0D0C');
    const [isDrawing, setIsDrawing] = useState(false);
    const [savedDrawings, setSavedDrawings] = useState<string[]>([]);
    const [isDone, setIsDone] = useState(false);

    const { canvasRef, containerRef, strokeHistory, currentStroke, initCanvas, paintStroke, redraw, getPos, getDataURL, clearCanvas, undo } = useCanvas();

    useEffect(() => {
        initCanvas();
        strokeHistory.current = [];
    }, [currentRef, initCanvas]);

    useEffect(() => {
        const ct = containerRef.current;
        if (!ct) return;
        const obs = new ResizeObserver(() => {
            const snap = canvasRef.current?.toDataURL('image/png');
            initCanvas();
            if (snap && canvasRef.current) {
                const ctx = canvasRef.current.getContext('2d');
                const img = new Image();
                img.onload = () => ctx?.drawImage(img, 0, 0);
                img.src = snap;
            }
        });
        obs.observe(ct);
        return () => obs.disconnect();
    }, [initCanvas]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo(); } };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [undo]);

    const onDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        currentStroke.current = [getPos(e)];
        setIsDrawing(true);
    };

    const onMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        currentStroke.current.push(getPos(e));
        redraw(strokeHistory.current);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) paintStroke(ctx, { points: currentStroke.current, color, size: brushSize, tool });
    };

    const onUp = () => {
        if (!isDrawing) return;
        if (currentStroke.current.length > 1)
            strokeHistory.current = [...strokeHistory.current, { points: [...currentStroke.current], color, size: brushSize, tool }];
        currentStroke.current = [];
        setIsDrawing(false);
    };

    const handleNext = () => {
        const data = getDataURL();
        const next = [...savedDrawings];
        next[currentRef] = data;
        setSavedDrawings(next);

        if (currentRef < refs.length - 1) {
            setCurrentRef(currentRef + 1);
        } else {
            // Ensure last drawing saved
            setSavedDrawings(next);
            setIsDone(true);
        }
    };

    if (isDone) {
        return (
            <CompleteScreen
                drawings={savedDrawings}
                references={refs}
                lessonTitle={lesson.title}
                onClose={onClose}
                onComplete={onComplete}
            />
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background flex flex-col"
        >
            {/* ── Header ── */}
            <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between shrink-0">
                <div>
                    <p className="text-xs text-muted font-medium uppercase tracking-wider">{courseTitle}</p>
                    <h3 className="font-semibold text-text text-sm">{lesson.title}</h3>
                </div>
                <div className="flex items-center gap-3">
                    {refs.length > 1 && (
                        <span className="text-xs text-muted">
                            Reference {currentRef + 1} / {refs.length}
                        </span>
                    )}
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-border transition-colors text-muted hover:text-text">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left — Reference */}
                <div className="w-[44%] border-r border-border flex flex-col bg-card overflow-auto">
                    {/* Thumbnail strip */}
                    {refs.length > 1 && (
                        <div className="flex gap-2 p-4 border-b border-border flex-wrap">
                            {refs.map((r, i) => (
                                <button
                                    key={i}
                                    onClick={() => i <= currentRef && setCurrentRef(i)}
                                    disabled={i > currentRef}
                                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === currentRef ? 'border-primary ring-2 ring-primary/20' : i < currentRef ? 'border-green-500' : 'border-border opacity-40'}`}
                                >
                                    <img src={r} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="p-5 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted bg-border px-2 py-0.5 rounded">Reference</span>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-border shadow-md">
                            <img src={refs[currentRef]} alt="Reference" className="w-full block" />
                        </div>
                        <p className="mt-4 text-sm text-muted leading-relaxed">{lesson.description}</p>
                    </div>
                </div>

                {/* Right — Canvas */}
                <div className="flex-1 flex flex-col">
                    {/* Toolbar */}
                    <div className="border-b border-border bg-card px-5 py-2.5 flex items-center gap-4 flex-wrap shrink-0">
                        {/* Tools */}
                        <div className="flex gap-1.5">
                            {([['brush', <Paintbrush className="w-4 h-4" />, 'Brush'],
                            ['pencil', <Pencil className="w-4 h-4" />, 'Pencil'],
                            ['eraser', <Eraser className="w-4 h-4" />, 'Eraser']] as [ToolType, React.ReactNode, string][]).map(([t, icon, label]) => (
                                <button
                                    key={t}
                                    onClick={() => setTool(t)}
                                    title={label}
                                    className={`p-2 rounded-lg border transition-all text-sm ${tool === t ? 'bg-primary border-primary text-white' : 'border-border text-text hover:border-primary/50'}`}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>

                        <div className="w-px h-5 bg-border" />

                        {/* Size */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted uppercase tracking-wide font-medium">Size</span>
                            <input type="range" min="1" max="20" value={brushSize} onChange={e => setBrushSize(+e.target.value)}
                                className="w-20 accent-[var(--primary)]" />
                            <span className="text-xs text-muted w-5 tabular-nums">{brushSize}</span>
                        </div>

                        <div className="w-px h-5 bg-border" />

                        {/* Colors */}
                        <div className="flex gap-1.5">
                            {COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setColor(c)}
                                    className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${color === c ? 'border-text scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>

                        {/* Undo + Clear */}
                        <div className="flex gap-1.5 ml-auto">
                            <button onClick={undo} title="Undo (Ctrl+Z)" className="p-2 rounded-lg border border-border text-muted hover:text-text hover:border-primary/50 transition-all">
                                <Undo className="w-4 h-4" />
                            </button>
                            <button onClick={clearCanvas} title="Clear" className="p-2 rounded-lg border border-border text-muted hover:text-text hover:border-primary/50 transition-all">
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Canvas area */}
                    <div ref={containerRef} className="flex-1 p-5 bg-muted/20 flex items-stretch">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={onDown}
                            onMouseMove={onMove}
                            onMouseUp={onUp}
                            onMouseLeave={onUp}
                            style={{
                                width: '100%', height: '100%',
                                cursor: tool === 'eraser' ? 'cell' : 'crosshair',
                                borderRadius: 12,
                                border: '1px solid var(--border)',
                                boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                                display: 'block',
                            }}
                        />
                    </div>

                    {/* Footer / Next */}
                    <div className="border-t border-border bg-card px-5 py-3 shrink-0">
                        <button
                            onClick={handleNext}
                            className="w-full py-3 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            {currentRef < refs.length - 1 ? (
                                <><span>Next Reference</span><ChevronRight className="w-4 h-4" /></>
                            ) : (
                                <><Check className="w-4 h-4" /><span>Finish Practice</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}