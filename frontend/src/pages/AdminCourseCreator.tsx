import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    Plus, Trash2, GripVertical, ChevronDown, ChevronUp,
    BookOpen, PenLine, Play, Image as ImageIcon, Check,
    Save, Eye, X, Layers, Sparkles, Copy, AlignLeft, ArrowLeft,
} from 'lucide-react';
import { useCourses } from '../hooks/useCourses';
import type { BlockType, CourseDto } from '../types/CourseTypes';
import paths from '../routes/paths';
import LoadingScreen from '../components/LoadingScreen';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface DraftBlock {
    id: string;
    type: BlockType;
    textContent: string;
    videoUrl: string;
    imageUrl: string;
    caption: string;
    practiceRefs: string[];
    countdownSeconds: string;
}

interface DraftLesson {
    id: string;
    title: string;
    description: string;
    blocks: DraftBlock[];
    expanded: boolean;
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

const uid = () => Math.random().toString(36).slice(2, 9);

const blankBlock = (): DraftBlock => ({
    id: uid(), type: 'Text', textContent: '', videoUrl: '', imageUrl: '', caption: '', practiceRefs: [], countdownSeconds: '',
});

const blankLesson = (): DraftLesson => ({
    id: uid(), title: '', description: '', blocks: [blankBlock()], expanded: true,
});

const blankChapter = (): DraftChapter => ({
    id: uid(), title: '', lessons: [blankLesson()], expanded: true,
});

const blankCourse = (): DraftCourse => ({
    title: '', description: '', image: '', difficulty: 'Beginner', badgeText: '', chapters: [],
});

const BLOCK_ICONS: Record<BlockType, React.ReactNode> = {
    Text: <AlignLeft className="w-3.5 h-3.5" />,
    Image: <ImageIcon className="w-3.5 h-3.5" />,
    Video: <Play className="w-3.5 h-3.5" />,
    PracticeSession: <PenLine className="w-3.5 h-3.5" />,
};
const BLOCK_LABELS: Record<BlockType, string> = {
    Text: 'Text', Image: 'Image', Video: 'Video', PracticeSession: 'Practice',
};

const mkLesson = (title: string, type: BlockType): DraftLesson => ({
    id: '', title, description: '', expanded: true,
    blocks: [{ id: '', type, textContent: '', videoUrl: '', imageUrl: '', caption: '', practiceRefs: [], countdownSeconds: '' }],
});
const mkChapter = (title: string, lessons: DraftLesson[]): Omit<DraftChapter, 'id'> => ({ title, lessons, expanded: true });

const TEMPLATES: { label: string; icon: React.ReactNode; chapters: Omit<DraftChapter, 'id'>[] }[] = [
    {
        label: 'Basic 3-Chapter Course',
        icon: <BookOpen className="w-4 h-4" />,
        chapters: [
            mkChapter('Introduction', [mkLesson('Overview', 'Text')]),
            mkChapter('Core Concepts', [mkLesson('Theory', 'Text'), mkLesson('Practice', 'PracticeSession')]),
            mkChapter('Final Project', [mkLesson('Capstone Practice', 'PracticeSession')]),
        ],
    },
    {
        label: 'Quick Single Lesson',
        icon: <PenLine className="w-4 h-4" />,
        chapters: [
            mkChapter('Lesson', [mkLesson('Reading', 'Text'), mkLesson('Practice', 'PracticeSession')]),
        ],
    },
    {
        label: 'Video Course (3 Chapters)',
        icon: <Play className="w-4 h-4" />,
        chapters: Array.from({ length: 3 }, (_, i) => mkChapter(`Chapter ${i + 1}`, [
            mkLesson(`Video ${i + 1}`, 'Video'),
            mkLesson(`Practice ${i + 1}`, 'PracticeSession'),
        ])),
    },
];

// ── Shared inputs ────────────────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
    return <label className="block text-xs font-semibold text-text/60 uppercase tracking-wider mb-1">{children}</label>;
}
function TInput({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
    return (
        <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className={`w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors ${className}`} />
    );
}
function TArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
    return (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors resize-none" />
    );
}

// ── Block editor ──────────────────────────────────────────────────────────────

function BlockEditor({ block, onUpdate, onDelete }: { block: DraftBlock; onUpdate: (b: DraftBlock) => void; onDelete: () => void }) {
    const [showRefs, setShowRefs] = useState(false);
    const [refInput, setRefInput] = useState('');

    const addRef = () => {
        if (!refInput.trim()) return;
        onUpdate({ ...block, practiceRefs: [...block.practiceRefs, refInput.trim()] });
        setRefInput('');
    };

    return (
        <div className="border border-border rounded-xl p-3 bg-background space-y-2.5">
            {/* Type bar */}
            <div className="flex items-center gap-1.5 min-w-0">
                <div className="flex gap-1 shrink-0">
                    {(['Text', 'Image', 'Video', 'PracticeSession'] as BlockType[]).map(t => (
                        <button key={t} onClick={() => onUpdate({ ...block, type: t })} title={BLOCK_LABELS[t]}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all ${block.type === t ? 'bg-primary border-primary text-white' : 'border-border text-muted hover:border-primary/50 hover:text-text'}`}>
                            {BLOCK_ICONS[t]} <span>{BLOCK_LABELS[t]}</span>
                        </button>
                    ))}
                </div>
                <div className="flex-1" />
                <button onClick={onDelete} className="text-muted hover:text-danger transition-colors p-1 shrink-0">
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Text */}
            {block.type === 'Text' && (
                <TArea value={block.textContent} onChange={v => onUpdate({ ...block, textContent: v })} placeholder="Write content..." rows={4} />
            )}

            {/* Image */}
            {block.type === 'Image' && (
                <div className="space-y-2">
                    <TInput value={block.imageUrl} onChange={v => onUpdate({ ...block, imageUrl: v })} placeholder="Image URL..." />
                    {block.imageUrl && (
                        <img src={block.imageUrl} alt="" className="w-full max-h-48 object-cover rounded-lg border border-border"
                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    )}
                    <TInput value={block.caption} onChange={v => onUpdate({ ...block, caption: v })} placeholder="Caption (optional)..." />
                </div>
            )}

            {/* Video */}
            {block.type === 'Video' && (
                <div className="flex items-center gap-2 min-w-0">
                    <Play className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <TInput value={block.videoUrl} onChange={v => onUpdate({ ...block, videoUrl: v })} placeholder="Video URL (YouTube, Vimeo, direct link)..." />
                    </div>
                </div>
            )}

            {/* Practice */}
            {block.type === 'PracticeSession' && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted shrink-0">Countdown (sec, optional):</span>
                        <input type="number" min={0} value={block.countdownSeconds}
                            onChange={e => onUpdate({ ...block, countdownSeconds: e.target.value })}
                            placeholder="e.g. 300"
                            className="w-24 border border-border rounded-lg px-2 py-1.5 text-xs bg-background text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <button onClick={() => setShowRefs(v => !v)} className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <ImageIcon className="w-3.5 h-3.5" />
                        {block.practiceRefs.length > 0 ? `${block.practiceRefs.length} reference image(s)` : 'Add reference images'}
                        {showRefs ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                    <AnimatePresence>
                        {showRefs && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden space-y-2">
                                {block.practiceRefs.map((ref, i) => (
                                    <div key={i} className="flex items-center gap-2 min-w-0">
                                        <img src={ref} alt="" className="w-10 h-10 rounded-lg object-cover border border-border shrink-0"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        <span className="text-xs text-muted truncate flex-1 min-w-0">{ref}</span>
                                        <button onClick={() => onUpdate({ ...block, practiceRefs: block.practiceRefs.filter((_, j) => j !== i) })} className="text-muted hover:text-danger shrink-0">
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <div className="flex gap-2 min-w-0">
                                    <div className="flex-1 min-w-0">
                                        <TInput value={refInput} onChange={setRefInput} placeholder="Paste image URL..." />
                                    </div>
                                    <button onClick={addRef} className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0">Add</button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

// ── Lesson editor ─────────────────────────────────────────────────────────────

function LessonEditor({ lesson, onUpdate, onDelete }: { lesson: DraftLesson; onUpdate: (l: DraftLesson) => void; onDelete: () => void }) {
    const updBlock = (id: string, b: DraftBlock) => onUpdate({ ...lesson, blocks: lesson.blocks.map(x => x.id === id ? b : x) });
    const delBlock = (id: string) => onUpdate({ ...lesson, blocks: lesson.blocks.filter(x => x.id !== id) });
    const addBlock = () => onUpdate({ ...lesson, blocks: [...lesson.blocks, blankBlock()] });

    return (
        <div className="ml-4 border-l-2 border-primary/20 pl-3">
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border">
                    <GripVertical className="w-3.5 h-3.5 text-muted cursor-grab shrink-0" />
                    <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                    <div className="flex-1 min-w-0">
                        <input value={lesson.title} onChange={e => onUpdate({ ...lesson, title: e.target.value })}
                            placeholder="Lesson title..."
                            className="w-full bg-transparent border-none outline-none text-sm font-semibold text-text placeholder:text-muted" />
                    </div>
                    <span className="text-[10px] text-muted shrink-0">{lesson.blocks.length} block{lesson.blocks.length !== 1 ? 's' : ''}</span>
                    <button onClick={() => onUpdate({ ...lesson, expanded: !lesson.expanded })} className="text-muted hover:text-text transition-colors shrink-0">
                        {lesson.expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={onDelete} className="text-muted hover:text-danger transition-colors shrink-0">
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>

                <AnimatePresence initial={false}>
                    {lesson.expanded && (
                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                            <div className="p-3 space-y-2.5">
                                <TArea value={lesson.description} onChange={v => onUpdate({ ...lesson, description: v })}
                                    placeholder="Description shown as subtitle on lesson page..." rows={2} />

                                <p className="text-[10px] font-black uppercase tracking-widest text-muted/60 mt-1">Content Blocks</p>

                                {lesson.blocks.map(block => (
                                    <BlockEditor key={block.id} block={block}
                                        onUpdate={b => updBlock(block.id, b)}
                                        onDelete={() => delBlock(block.id)} />
                                ))}

                                <button onClick={addBlock}
                                    className="w-full py-1.5 rounded-lg border border-dashed border-border text-muted text-xs hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-1.5">
                                    <Plus className="w-3 h-3" /> Add Block
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

// ── Chapter editor ────────────────────────────────────────────────────────────

function ChapterEditor({ chapter, chapterIndex, onUpdate, onDelete }: {
    chapter: DraftChapter; chapterIndex: number;
    onUpdate: (c: DraftChapter) => void; onDelete: () => void;
}) {
    const updLesson = (id: string, l: DraftLesson) => onUpdate({ ...chapter, lessons: chapter.lessons.map(x => x.id === id ? l : x) });
    const delLesson = (id: string) => onUpdate({ ...chapter, lessons: chapter.lessons.filter(x => x.id !== id) });
    const addLesson = () => onUpdate({ ...chapter, lessons: [...chapter.lessons, blankLesson()] });

    return (
        <div className="rounded-xl border-2 border-border bg-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/10 border-b border-border">
                <GripVertical className="w-4 h-4 text-muted cursor-grab shrink-0" />
                <div className="w-6 h-6 rounded-md bg-primary text-white flex items-center justify-center text-[10px] font-black shrink-0">
                    {chapterIndex + 1}
                </div>
                <div className="flex-1 min-w-0">
                    <input value={chapter.title} onChange={e => onUpdate({ ...chapter, title: e.target.value })}
                        placeholder="Chapter title..."
                        className="w-full bg-transparent border-none outline-none text-sm font-bold text-text placeholder:text-muted" />
                </div>
                <span className="text-xs text-muted shrink-0">{chapter.lessons.length} lessons</span>
                <button onClick={() => onUpdate({ ...chapter, expanded: !chapter.expanded })} className="text-muted hover:text-text transition-colors shrink-0">
                    {chapter.expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                <button onClick={onDelete} className="text-muted hover:text-danger transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <AnimatePresence initial={false}>
                {chapter.expanded && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} style={{ overflow: 'hidden' }}>
                        <div className="p-4 space-y-3">
                            {chapter.lessons.map(lesson => (
                                <LessonEditor key={lesson.id} lesson={lesson}
                                    onUpdate={l => updLesson(lesson.id, l)}
                                    onDelete={() => delLesson(lesson.id)} />
                            ))}
                            <button onClick={addLesson}
                                className="w-full py-2 rounded-xl border border-dashed border-border text-muted text-xs hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                <Plus className="w-3.5 h-3.5" /> Add Lesson
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── API → Draft mappers ───────────────────────────────────────────────────────

function apiToDraft(dto: CourseDto): DraftCourse {
    return {
        title: dto.name,
        description: dto.description ?? '',
        image: dto.thumbnailUrl ?? '',
        difficulty: 'Beginner',
        badgeText: '',
        chapters: (dto.chapters ?? []).map(ch => ({
            id: uid(),
            title: ch.name,
            expanded: true,
            lessons: (ch.lessons ?? []).map(l => ({
                id: uid(),
                title: l.name,
                description: l.description ?? '',
                expanded: false,
                blocks: (l.blocks ?? []).map(b => ({
                    id: uid(),
                    type: b.type,
                    textContent: b.textContent ?? '',
                    videoUrl: b.videoUrl ?? '',
                    imageUrl: b.imageUrl ?? '',
                    caption: b.caption ?? '',
                    countdownSeconds: b.durationSeconds?.toString() ?? '',
                    practiceRefs: (() => {
                        try { const p = JSON.parse(b.practiceConfig ?? '[]'); return Array.isArray(p) ? p : []; } catch { return []; }
                    })(),
                })),
            })),
        })),
    };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function AdminCourseCreator() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const isEditMode = Boolean(courseId);

    const { getCourseById, createCourse, updateCourse, deleteChapter, createChapter, createLesson, createBlock } = useCourses();
    const [course, setCourse] = useState<DraftCourse>(blankCourse);
    const [loadingEdit, setLoadingEdit] = useState(isEditMode);
    const [editCourseId, setEditCourseId] = useState<number | null>(null);
    const [existingChapterIds, setExistingChapterIds] = useState<number[]>([]);
    const [saved, setSaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);
    const [showTemplates, setShowTemplates] = useState(false);

    useEffect(() => {
        if (!courseId) return;
        getCourseById(Number(courseId))
            .then(dto => {
                setEditCourseId(dto.id);
                setExistingChapterIds((dto.chapters ?? []).map(ch => ch.id));
                setCourse(apiToDraft(dto));
            })
            .catch(() => setSaveError('Failed to load course for editing'))
            .finally(() => setLoadingEdit(false));
    }, [courseId]);

    if (loadingEdit) return <LoadingScreen />;

    const applyTemplate = (t: typeof TEMPLATES[0]) => {
        setCourse(prev => ({
            ...prev,
            chapters: t.chapters.map(ch => ({
                ...ch,
                id: uid(),
                lessons: ch.lessons.map(l => ({ ...l, id: uid(), blocks: l.blocks.map(b => ({ ...b, id: uid() })) })),
            })),
        }));
        setShowTemplates(false);
    };

    const updChapter = (id: string, c: DraftChapter) => setCourse(prev => ({ ...prev, chapters: prev.chapters.map(x => x.id === id ? c : x) }));
    const delChapter = (id: string) => setCourse(prev => ({ ...prev, chapters: prev.chapters.filter(x => x.id !== id) }));
    const addChapter = () => setCourse(prev => ({ ...prev, chapters: [...prev.chapters, blankChapter()] }));

    const saveChapters = async (targetCourseId: number) => {
        for (let ci = 0; ci < course.chapters.length; ci++) {
            const ch = course.chapters[ci];
            const savedChapter = await createChapter({ name: ch.title, courseId: targetCourseId, order: ci + 1 });

            for (let li = 0; li < ch.lessons.length; li++) {
                const l = ch.lessons[li];
                const savedLesson = await createLesson({ name: l.title, description: l.description, chapterId: savedChapter.id, order: li + 1 });

                for (let bi = 0; bi < l.blocks.length; bi++) {
                    const b = l.blocks[bi];
                    await createBlock({
                        type: b.type,
                        lessonId: savedLesson.id,
                        order: bi + 1,
                        textContent: b.type === 'Text' ? (b.textContent || undefined) : undefined,
                        videoUrl: b.type === 'Video' ? (b.videoUrl || undefined) : undefined,
                        imageUrl: b.type === 'Image' ? (b.imageUrl || undefined) : undefined,
                        caption: b.type === 'Image' ? (b.caption || undefined) : undefined,
                        durationSeconds: b.countdownSeconds ? (parseInt(b.countdownSeconds) || undefined) : undefined,
                        practiceConfig: b.type === 'PracticeSession' ? JSON.stringify(b.practiceRefs) : undefined,
                    });
                }
            }
        }
    };

    const handleSave = async () => {
        if (!course.title.trim()) { setSaveError('Course title is required'); return; }
        setSaving(true);
        setSaveError(null);
        try {
            const meta = { name: course.title, description: course.description, thumbnailUrl: course.image || undefined };

            if (isEditMode && editCourseId !== null) {
                await updateCourse(editCourseId, meta);
                for (const chId of existingChapterIds) await deleteChapter(chId);
                await saveChapters(editCourseId);
            } else {
                const savedCourse = await createCourse(meta);
                await saveChapters(savedCourse.id);
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch {
            setSaveError('Failed to save. Check console for details.');
        } finally {
            setSaving(false);
        }
    };

    const totalLessons = course.chapters.reduce((a, ch) => a + ch.lessons.length, 0);

    return (
        <div className="flex flex-col flex-1 bg-background text-text min-h-screen">
            {/* Top bar */}
            <div className="border-b border-border bg-card px-6 py-3 flex items-center justify-between sticky top-16 z-10">
                <div className="flex items-center gap-3">
                    {isEditMode && (
                        <button onClick={() => navigate(paths.admin.course_drafts)}
                            className="p-1.5 rounded-lg text-muted hover:text-text hover:bg-muted/10 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                    )}
                    <Layers className="w-5 h-5 text-primary" />
                    <span className="font-bold text-text">{isEditMode ? 'Edit Course' : 'Course Creator'}</span>
                    <span className="text-xs text-muted bg-border px-2 py-0.5 rounded-full">Admin only</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted">{course.chapters.length} ch · {totalLessons} lessons</span>
                    <button onClick={() => setPreview(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-text hover:border-primary hover:text-primary transition-colors">
                        <Eye className="w-4 h-4" /> Preview
                    </button>
                    {saveError && <span className="text-xs text-danger max-w-xs truncate">{saveError}</span>}
                    <button onClick={handleSave} disabled={saving}
                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed ${saved ? 'bg-green-500 text-white' : 'bg-primary text-white hover:bg-primary/90'}`}>
                        {saved ? <><Check className="w-4 h-4" /> Saved!</> : saving ? <><Save className="w-4 h-4" /> Saving…</> : <><Save className="w-4 h-4" /> Save</>}
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-0 min-h-0">
                {/* Left: course meta */}
                <div className="w-80 shrink-0 border-r border-border bg-card p-6 space-y-5 overflow-y-auto">
                    <h2 className="font-bold text-text text-sm uppercase tracking-wider">Course Details</h2>

                    {/* Templates */}
                    <div>
                        <button onClick={() => setShowTemplates(v => !v)}
                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-dashed border-primary/40 text-primary text-sm hover:bg-primary/5 transition-colors">
                            <span className="flex items-center gap-2"><Sparkles className="w-4 h-4" /> Use a Template</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {showTemplates && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-2 space-y-1.5">
                                    {TEMPLATES.map((t, i) => (
                                        <button key={i} onClick={() => applyTemplate(t)}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-background border border-border text-sm text-text hover:border-primary hover:text-primary transition-colors text-left">
                                            {t.icon} {t.label} <Copy className="w-3 h-3 ml-auto text-muted" />
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4">
                        <div><FieldLabel>Title</FieldLabel><TInput value={course.title} onChange={v => setCourse(p => ({ ...p, title: v }))} placeholder="e.g. Mastering Hands" /></div>
                        <div><FieldLabel>Description</FieldLabel><TArea value={course.description} onChange={v => setCourse(p => ({ ...p, description: v }))} placeholder="What will students learn?" /></div>
                        <div>
                            <FieldLabel>Cover Image URL</FieldLabel>
                            <TInput value={course.image} onChange={v => setCourse(p => ({ ...p, image: v }))} placeholder="https://..." />
                            {course.image && <img src={course.image} alt="" className="mt-2 w-full h-28 object-cover rounded-lg border border-border" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                        </div>
                        <div>
                            <FieldLabel>Difficulty</FieldLabel>
                            <div className="flex gap-2">
                                {(['Beginner', 'Intermediate', 'Advanced'] as Difficulty[]).map(d => (
                                    <button key={d} onClick={() => setCourse(p => ({ ...p, difficulty: d }))}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all ${course.difficulty === d ? 'bg-primary border-primary text-white' : 'border-border text-muted hover:border-primary/50 hover:text-text'}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div><FieldLabel>Badge Text</FieldLabel><TInput value={course.badgeText} onChange={v => setCourse(p => ({ ...p, badgeText: v }))} placeholder="e.g. Shadow Master" /></div>
                    </div>
                </div>

                {/* Right: chapters */}
                <div className="flex-1 p-8 overflow-y-auto min-w-0">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-text text-sm uppercase tracking-wider">Chapters</h2>
                            <button onClick={addChapter}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                                <Plus className="w-4 h-4" /> Add Chapter
                            </button>
                        </div>

                        {course.chapters.length === 0 ? (
                            <div className="text-center py-20 text-muted">
                                <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="text-sm font-medium mb-2">No chapters yet</p>
                                <p className="text-xs">Use a template or add a chapter manually.</p>
                                <p className="text-xs mt-3 text-muted/60">Chapter → Lessons → Blocks (Text / Image / Video / Practice)</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {course.chapters.map((ch, i) => (
                                    <motion.div key={ch.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <ChapterEditor chapter={ch} chapterIndex={i}
                                            onUpdate={c => updChapter(ch.id, c)}
                                            onDelete={() => delChapter(ch.id)} />
                                    </motion.div>
                                ))}
                                <button onClick={addChapter}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-border text-muted text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                                    <Plus className="w-4 h-4" /> Add Chapter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Preview modal */}
            <AnimatePresence>
                {preview && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6"
                        onClick={() => setPreview(false)}>
                        <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
                            className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden"
                            onClick={e => e.stopPropagation()}>
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
                                <button onClick={() => setPreview(false)} className="text-sm text-muted hover:text-text transition-colors">Close</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
