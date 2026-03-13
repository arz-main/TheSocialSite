import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
    BookOpen, PenLine, Play, Image as ImageIcon, Check,
    Save, Eye, X, Layers, Sparkles, Copy
} from 'lucide-react';

type LessonType = 'reading' | 'practice' | 'video';
type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface DraftLesson {
    id: string;
    title: string;
    duration: string;
    type: LessonType;
    description: string;
    practiceRefs: string[];
}

interface DraftChapter {
    id: string;
    title: string;
    lessons: DraftLesson[];
    expanded: boolean;
}

interface DraftCourse {
    title: string;
    description: string;
    image: string;
    difficulty: Difficulty;
    badgeText: string;
    chapters: DraftChapter[];
}

const TEMPLATES: { label: string; icon: React.ReactNode; chapters: Omit<DraftChapter, 'id'>[] }[] = [
    {
        label: 'Basic 3-Chapter Course',
        icon: <BookOpen className="w-4 h-4" />,
        chapters: [
            { title: 'Introduction', expanded: true, lessons: [{ id: '', title: 'Overview', duration: '5 min', type: 'reading', description: '', practiceRefs: [] }] },
            { title: 'Core Concepts', expanded: false, lessons: [{ id: '', title: 'Theory lesson', duration: '10 min', type: 'reading', description: '', practiceRefs: [] }, { id: '', title: 'Practice exercise', duration: '20 min', type: 'practice', description: '', practiceRefs: [] }] },
            { title: 'Final Project', expanded: false, lessons: [{ id: '', title: 'Capstone practice', duration: '30 min', type: 'practice', description: '', practiceRefs: [] }] },
        ]
    },
    {
        label: 'Quick Single Lesson',
        icon: <PenLine className="w-4 h-4" />,
        chapters: [
            { title: 'Lesson', expanded: true, lessons: [{ id: '', title: 'Reading', duration: '10 min', type: 'reading', description: '', practiceRefs: [] }, { id: '', title: 'Practice', duration: '25 min', type: 'practice', description: '', practiceRefs: [] }] },
        ]
    },
    {
        label: 'Video Course (5 Chapters)',
        icon: <Play className="w-4 h-4" />,
        chapters: Array.from({ length: 5 }, (_, i) => ({
            title: `Chapter ${i + 1}`,
            expanded: i === 0,
            lessons: [
                { id: '', title: `Video ${i + 1}`, duration: '12 min', type: 'video' as LessonType, description: '', practiceRefs: [] },
                { id: '', title: `Practice ${i + 1}`, duration: '20 min', type: 'practice' as LessonType, description: '', practiceRefs: [] },
            ]
        }))
    }
];

const uid = () => Math.random().toString(36).slice(2, 9);

const blankCourse = (): DraftCourse => ({
    title: '',
    description: '',
    image: '',
    difficulty: 'Beginner',
    badgeText: '',
    chapters: []
});

const blankLesson = (): DraftLesson => ({
    id: uid(), title: '', duration: '10 min', type: 'reading', description: '', practiceRefs: []
});

const blankChapter = (): DraftChapter => ({
    id: uid(), title: '', lessons: [blankLesson()], expanded: true
});

const lessonTypeIcon = (t: LessonType) => {
    if (t === 'practice') return <PenLine className="w-3.5 h-3.5" />;
    if (t === 'video') return <Play className="w-3.5 h-3.5" />;
    return <BookOpen className="w-3.5 h-3.5" />;
};

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">{children}</label>;
}

function Input({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
    return (
        <input
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors ${className}`}
        />
    );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
    return (
        <textarea
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none"
        />
    );
}

function LessonEditor({ lesson, onUpdate, onDelete }: {
    lesson: DraftLesson;
    onUpdate: (updated: DraftLesson) => void;
    onDelete: () => void;
}) {
    const [showRefs, setShowRefs] = useState(false);
    const [refInput, setRefInput] = useState('');

    const addRef = () => {
        if (!refInput.trim()) return;
        onUpdate({ ...lesson, practiceRefs: [...lesson.practiceRefs, refInput.trim()] });
        setRefInput('');
    };

    return (
        <div className="bg-background rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-start gap-3">
                <GripVertical className="w-4 h-4 text-muted mt-2 shrink-0 cursor-grab" />
                <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                        {/* Type selector */}
                        <div className="flex gap-1 shrink-0">
                            {(['reading', 'video', 'practice'] as LessonType[]).map(t => (
                                <button
                                    key={t}
                                    onClick={() => onUpdate({ ...lesson, type: t })}
                                    title={t.charAt(0).toUpperCase() + t.slice(1)}
                                    className={`p-1.5 rounded-lg border text-xs transition-all ${lesson.type === t ? 'bg-primary border-primary text-white' : 'border-border text-muted hover:border-primary/50 hover:text-text'}`}
                                >
                                    {lessonTypeIcon(t)}
                                </button>
                            ))}
                        </div>
                        <Input value={lesson.title} onChange={v => onUpdate({ ...lesson, title: v })} placeholder="Lesson title..." />
                        <Input value={lesson.duration} onChange={v => onUpdate({ ...lesson, duration: v })} placeholder="10 min" className="w-20 shrink-0" />
                        <button onClick={onDelete} className="text-muted hover:text-danger transition-colors p-1 shrink-0">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>

                    <TextArea value={lesson.description} onChange={v => onUpdate({ ...lesson, description: v })} placeholder="Short description for the student..." rows={2} />

                    {/* Practice refs */}
                    {lesson.type === 'practice' && (
                        <div>
                            <button
                                onClick={() => setShowRefs(v => !v)}
                                className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                                <ImageIcon className="w-3.5 h-3.5" />
                                {lesson.practiceRefs.length > 0 ? `${lesson.practiceRefs.length} reference image(s)` : 'Add reference images'}
                                {showRefs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                            <AnimatePresence>
                                {showRefs && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-2 space-y-2"
                                    >
                                        {lesson.practiceRefs.map((ref, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <img src={ref} alt="" className="w-12 h-12 rounded-lg object-cover border border-border shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                                <span className="text-xs text-muted truncate flex-1">{ref}</span>
                                                <button onClick={() => onUpdate({ ...lesson, practiceRefs: lesson.practiceRefs.filter((_, j) => j !== i) })} className="text-muted hover:text-danger shrink-0">
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        ))}
                                        <div className="flex gap-2">
                                            <Input value={refInput} onChange={setRefInput} placeholder="Paste image URL..." />
                                            <button onClick={addRef} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0">
                                                Add
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ChapterEditor({ chapter, chapterIndex, onUpdate, onDelete }: {
    chapter: DraftChapter;
    chapterIndex: number;
    onUpdate: (updated: DraftChapter) => void;
    onDelete: () => void;
}) {
    const updateLesson = (lessonId: string, updated: DraftLesson) =>
        onUpdate({ ...chapter, lessons: chapter.lessons.map(l => l.id === lessonId ? updated : l) });

    const deleteLesson = (lessonId: string) =>
        onUpdate({ ...chapter, lessons: chapter.lessons.filter(l => l.id !== lessonId) });

    const addLesson = () =>
        onUpdate({ ...chapter, lessons: [...chapter.lessons, blankLesson()] });

    return (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Chapter header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
                <GripVertical className="w-4 h-4 text-muted cursor-grab shrink-0" />
                <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted/60">Ch.{chapterIndex + 1}</span>
                </div>
                <input
                    value={chapter.title}
                    onChange={e => onUpdate({ ...chapter, title: e.target.value })}
                    placeholder="Chapter title..."
                    className="flex-1 bg-transparent border-none outline-none text-sm font-semibold text-text placeholder:text-muted"
                />
                <span className="text-xs text-muted shrink-0">{chapter.lessons.length} lessons</span>
                <button onClick={() => onUpdate({ ...chapter, expanded: !chapter.expanded })} className="text-muted hover:text-text transition-colors">
                    {chapter.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={onDelete} className="text-muted hover:text-danger transition-colors">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            {/* Lessons */}
            <AnimatePresence initial={false}>
                {chapter.expanded && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <div className="p-4 space-y-3">
                            {chapter.lessons.map(lesson => (
                                <LessonEditor
                                    key={lesson.id}
                                    lesson={lesson}
                                    onUpdate={updated => updateLesson(lesson.id, updated)}
                                    onDelete={() => deleteLesson(lesson.id)}
                                />
                            ))}
                            <button
                                onClick={addLesson}
                                className="w-full py-2 rounded-xl border border-dashed border-border text-muted text-xs hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add Lesson
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function AdminCourseCreator() {
    const [course, setCourse] = useState<DraftCourse>(blankCourse);
    const [saved, setSaved] = useState(false);
    const [preview, setPreview] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    const applyTemplate = (template: typeof TEMPLATES[0]) => {
        setCourse(prev => ({
            ...prev,
            chapters: template.chapters.map(ch => ({
                ...ch,
                id: uid(),
                lessons: ch.lessons.map(l => ({ ...l, id: uid() }))
            }))
        }));
        setShowTemplates(false);
    };

    const updateChapter = (id: string, updated: DraftChapter) =>
        setCourse(prev => ({ ...prev, chapters: prev.chapters.map(ch => ch.id === id ? updated : ch) }));

    const deleteChapter = (id: string) =>
        setCourse(prev => ({ ...prev, chapters: prev.chapters.filter(ch => ch.id !== id) }));

    const addChapter = () =>
        setCourse(prev => ({ ...prev, chapters: [...prev.chapters, blankChapter()] }));

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
    };

    const totalLessons = course.chapters.reduce((a, ch) => a + ch.lessons.length, 0);

    return (
        <div className="flex flex-col flex-1 bg-background text-text min-h-screen">
            {/* ── Top bar ── */}
            <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-16 z-10">
                <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="font-bold text-text">Course Creator</span>
                    <span className="text-xs text-muted bg-border px-2 py-0.5 rounded-full">Admin only</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">{course.chapters.length} chapters · {totalLessons} lessons</span>
                    <button
                        onClick={() => setPreview(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-text hover:border-primary hover:text-primary transition-colors"
                    >
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    <button
                        onClick={handleSave}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}
                    >
                        {saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Course</>}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-0">
                {/* ── Left: Course meta ── */}
                <div className="w-80 shrink-0 border-r border-border bg-card p-6 space-y-5 overflow-y-auto">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-text text-sm uppercase tracking-wider">Course Details</h2>
                        </div>

                        {/* Templates */}
                        <div className="mb-5">
                            <button
                                onClick={() => setShowTemplates(v => !v)}
                                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-dashed border-primary/40 text-primary text-sm hover:bg-primary/5 transition-colors"
                            >
                                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Use a Template</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                            </button>
                            <AnimatePresence>
                                {showTemplates && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden mt-2 space-y-1.5"
                                    >
                                        {TEMPLATES.map((t, i) => (
                                            <button
                                                key={i}
                                                onClick={() => applyTemplate(t)}
                                                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border text-sm text-text hover:border-primary hover:text-primary transition-colors text-left"
                                            >
                                                {t.icon} {t.label}
                                                <Copy className="w-3 h-3 ml-auto text-muted" />
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <FieldLabel>Title</FieldLabel>
                                <Input value={course.title} onChange={v => setCourse(p => ({ ...p, title: v }))} placeholder="e.g. Mastering Hands" />
                            </div>
                            <div>
                                <FieldLabel>Description</FieldLabel>
                                <TextArea value={course.description} onChange={v => setCourse(p => ({ ...p, description: v }))} placeholder="What will students learn?" />
                            </div>
                            <div>
                                <FieldLabel>Cover Image URL</FieldLabel>
                                <Input value={course.image} onChange={v => setCourse(p => ({ ...p, image: v }))} placeholder="https://..." />
                                {course.image && (
                                    <img src={course.image} alt="" className="mt-2 w-full h-28 object-cover rounded-lg border border-border" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                )}
                            </div>
                            <div>
                                <FieldLabel>Difficulty</FieldLabel>
                                <div className="flex gap-2">
                                    {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(d => (
                                        <button
                                            key={d}
                                            onClick={() => setCourse(p => ({ ...p, difficulty: d }))}
                                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${course.difficulty === d ? 'bg-primary border-primary text-white' : 'border-border text-muted hover:border-primary/50 hover:text-text'}`}
                                        >
                                            {d}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <FieldLabel>Badge Text</FieldLabel>
                                <Input value={course.badgeText} onChange={v => setCourse(p => ({ ...p, badgeText: v }))} placeholder="e.g. Shadow Master" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Right: Chapters ── */}
                <div className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-text text-sm uppercase tracking-wider">Chapters & Lessons</h2>
                            <button
                                onClick={addChapter}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
                            >
                                <Plus className="w-4 h-4" /> Add Chapter
                            </button>
                        </div>

                        {course.chapters.length === 0 ? (
                            <div className="text-center py-20 text-muted">
                                <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium mb-2">No chapters yet</p>
                                <p className="text-xs">Use a template to get started, or add a chapter manually.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {course.chapters.map((ch, i) => (
                                    <motion.div
                                        key={ch.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <ChapterEditor
                                            chapter={ch}
                                            chapterIndex={i}
                                            onUpdate={updated => updateChapter(ch.id, updated)}
                                            onDelete={() => deleteChapter(ch.id)}
                                        />
                                    </motion.div>
                                ))}
                                <button
                                    onClick={addChapter}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-border text-muted text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Another Chapter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Preview Modal ── */}
            <AnimatePresence>
                {preview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
                        onClick={() => setPreview(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 16 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 16 }}
                            className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Card Preview */}
                            <div className="relative">
                                {course.image
                                    ? <img src={course.image} alt="" className="w-full h-40 object-cover" />
                                    : <div className="w-full h-40 bg-muted/30 flex items-center justify-center text-muted text-sm">No cover image</div>
                                }
                                {course.difficulty && (
                                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/90 text-white">
                                        {course.difficulty}
                                    </span>
                                )}
                            </div>
                            <div className="p-5">
                                <h3 className="font-bold text-text text-lg mb-1">{course.title || 'Untitled Course'}</h3>
                                <p className="text-sm text-muted mb-4">{course.description || 'No description yet.'}</p>
                                <div className="flex items-center gap-2 text-xs text-muted mb-4">
                                    <BookOpen className="w-4 h-4" />
                                    {course.chapters.length} chapters · {totalLessons} lessons
                                </div>
                                {course.badgeText && (
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                                        {course.badgeText}
                                    </span>
                                )}
                            </div>
                            <div className="border-t border-border px-5 py-3 flex justify-end">
                                <button onClick={() => setPreview(false)} className="text-sm text-muted hover:text-text transition-colors">Close preview</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}