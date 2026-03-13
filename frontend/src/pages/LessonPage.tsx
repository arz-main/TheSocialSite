import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, ArrowRight, BookOpen, CheckCircle2,
    Clock, Lightbulb, AlertCircle, ListChecks, Layers,
    ChevronRight, PenLine,
} from 'lucide-react';
import { MOCK_COURSES } from '../_mock/mockCourses';
import type { LessonSection as LS, Lesson, Chapter } from '../_mock/mockCourses';
import LessonPracticeModal from '../components/ui/LessonPracticeModal';

function SecText({ s, i }: { s: LS; i: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            {s.heading && <h2 className="text-xl font-black text-text mb-3 mt-1" style={{ fontFamily: 'Georgia, serif' }}>{s.heading}</h2>}
            <p className="text-base text-text/80 leading-relaxed">{s.body}</p>
        </motion.div>
    );
}

function SecImage({ s, i }: { s: LS; i: number }) {
    return (
        <motion.figure initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
            <div className="rounded-2xl overflow-hidden border border-border shadow-md">
                <img src={s.src} alt={s.caption ?? ''} className="w-full block object-cover max-h-96" />
            </div>
            {s.caption && <figcaption className="mt-2 text-sm text-muted text-center italic">{s.caption}</figcaption>}
        </motion.figure>
    );
}

function SecTip({ s, i }: { s: LS; i: number }) {
    return (
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="flex gap-4 p-5 rounded-2xl bg-primary/6 border border-primary/20">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div>
                <p className="text-xs font-black uppercase tracking-widest text-primary mb-1">Pro Tip</p>
                <p className="text-sm text-text/80 leading-relaxed">{s.body}</p>
            </div>
        </motion.div>
    );
}

function SecCallout({ s, i }: { s: LS; i: number }) {
    return (
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="flex gap-4 p-5 rounded-2xl bg-amber-500/8 border border-amber-500/25">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
                {s.heading && <p className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">{s.heading}</p>}
                <p className="text-sm text-text/80 leading-relaxed">{s.body}</p>
            </div>
        </motion.div>
    );
}

function SecSteps({ s, i }: { s: LS; i: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl border border-border bg-card p-5">
            {s.heading && (
                <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="w-4 h-4 text-primary" />
                    <p className="text-sm font-black uppercase tracking-widest text-primary">{s.heading}</p>
                </div>
            )}
            <ol className="space-y-3">
                {s.steps?.map((step, li) => (
                    <li key={li} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 text-xs font-black mt-0.5">
                            {li + 1}
                        </div>
                        <p className="text-sm text-text/80 leading-relaxed pt-0.5">{step}</p>
                    </li>
                ))}
            </ol>
        </motion.div>
    );
}

function SecExample({ s, i }: { s: LS; i: number }) {
    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            className="rounded-2xl border-2 border-dashed border-border p-5 bg-muted/20">
            {s.heading && <p className="text-xs font-black uppercase tracking-widest text-muted mb-2">{s.heading}</p>}
            <p className="text-sm text-text/80 leading-relaxed">{s.body}</p>
        </motion.div>
    );
}

function RenderSection({ section, idx }: { section: LS; idx: number }) {
    if (section.type === 'text') return <SecText s={section} i={idx} />;
    if (section.type === 'image') return <SecImage s={section} i={idx} />;
    if (section.type === 'tip') return <SecTip s={section} i={idx} />;
    if (section.type === 'callout') return <SecCallout s={section} i={idx} />;
    if (section.type === 'steps') return <SecSteps s={section} i={idx} />;
    if (section.type === 'example') return <SecExample s={section} i={idx} />;
    return null;
}


function Sidebar({
    chapters,
    currentLessonId,
    completedIds,
    onNavigate,
}: {
    chapters: Chapter[];
    currentLessonId: number;
    completedIds: number[];
    onNavigate: (id: number) => void;
}) {
    const [open, setOpen] = useState<number[]>(
        chapters.filter(ch => ch.lessons.some(l => l.id === currentLessonId)).map(ch => ch.id)
    );
    const toggle = (id: number) => setOpen(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="px-4 pt-5 pb-3 border-b border-border shrink-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Contents</p>
            </div>
            <div className="flex-1 overflow-y-auto py-3">
                {chapters.map((ch, ci) => {
                    const isOpen = open.includes(ch.id);
                    return (
                        <div key={ch.id} className="mb-1">
                            <button onClick={() => toggle(ch.id)}
                                className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-muted/30 transition-colors text-left">
                                <div className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black shrink-0">
                                    {ci + 1}
                                </div>
                                <p className="flex-1 text-xs font-bold text-text leading-snug">{ch.title}</p>
                                <ChevronRight className={`w-3 h-3 text-muted shrink-0 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }}
                                        style={{ overflow: 'hidden' }}>
                                        {ch.lessons.map((l, li) => {
                                            const isCurrent = l.id === currentLessonId;
                                            const isDone = completedIds.includes(l.id);
                                            return (
                                                <button key={l.id} onClick={() => onNavigate(l.id)}
                                                    className={`w-full flex items-center gap-2.5 pl-8 pr-4 py-2 text-left transition-all
                                                        ${isCurrent ? 'bg-primary/8 border-r-2 border-primary' : 'hover:bg-muted/20'}`}>
                                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-black border transition-colors
                                                        ${isCurrent ? 'bg-primary border-primary text-white'
                                                            : isDone ? 'bg-primary/20 border-primary/40 text-primary'
                                                                : 'border-border text-muted'}`}>
                                                        {isDone ? <CheckCircle2 className="w-2.5 h-2.5" /> : li + 1}
                                                    </div>
                                                    <p className={`flex-1 text-xs leading-snug truncate ${isCurrent ? 'font-bold text-primary' : 'text-muted'}`}>
                                                        {l.title}
                                                    </p>
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function LessonPage() {
    const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
    const navigate = useNavigate();

    const course = MOCK_COURSES.find(c => c.id === Number(courseId));
    const chapters: Chapter[] = course?.chapterData ?? [];
    const allLessons: Lesson[] = chapters.flatMap(ch => ch.lessons);
    const lesson = allLessons.find(l => l.id === Number(lessonId));

    const [completedIds, setCompletedIds] = useState<number[]>(
        allLessons.filter(l => l.completed).map(l => l.id)
    );
    const [practiceOpen, setPracticeOpen] = useState(false);

    if (!course || !lesson) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-text gap-4">
                <p className="text-xl font-bold">Lesson not found.</p>
                <button onClick={() => navigate(-1)} className="text-primary underline text-sm">Go back</button>
            </div>
        );
    }

    const isDone = completedIds.includes(lesson.id);
    const markDone = () => setCompletedIds(p => p.includes(lesson.id) ? p : [...p, lesson.id]);

    const currentIdx = allLessons.findIndex(l => l.id === lesson.id);
    const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null;
    const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null;

    const goTo = (l: Lesson) => navigate(`/roadmap/course/${courseId}/lesson/${l.id}`);

    const chapter = chapters.find(ch => ch.lessons.some(l => l.id === lesson.id));

    return (
        <div className="flex flex-1 w-full bg-background text-text" style={{ minHeight: 0, overflow: 'hidden' }}>

            {/* Sidebar */}
            <aside className="w-64 shrink-0 border-r border-border bg-card flex flex-col overflow-hidden">
                <div className="px-4 py-4 border-b border-border shrink-0">
                    <button onClick={() => navigate(`/roadmap/course/${courseId}`)}
                        className="flex items-center gap-1.5 text-muted hover:text-primary text-xs font-bold uppercase tracking-wider group transition-colors w-full">
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                        {course.title}
                    </button>
                </div>
                <Sidebar
                    chapters={chapters}
                    currentLessonId={lesson.id}
                    completedIds={completedIds}
                    onNavigate={id => {
                        const l = allLessons.find(x => x.id === id);
                        if (l) goTo(l);
                    }}
                />
            </aside>

            {/* Content */}
            <div className="flex-1 overflow-y-auto min-w-0">
                <div className="max-w-3xl mx-auto px-8 py-10">

                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-muted mb-6 flex-wrap">
                        <button onClick={() => navigate('/roadmap')} className="hover:text-primary transition-colors">Roadmap</button>
                        <ChevronRight className="w-3 h-3" />
                        <button onClick={() => navigate(`/roadmap/course/${courseId}`)} className="hover:text-primary transition-colors">{course.title}</button>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-muted/60">{chapter?.title}</span>
                        <ChevronRight className="w-3 h-3" />
                        <span className="text-text font-medium">{lesson.title}</span>
                    </div>

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {chapter && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted bg-muted/30 px-2.5 py-1 rounded-full">
                                    <Layers className="w-3 h-3" />{chapter.title}
                                </span>
                            )}
                            <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full
                                ${lesson.type === 'reading' ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                    : lesson.type === 'video' ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                        : 'bg-primary/10 text-primary'}`}>
                                <BookOpen className="w-3 h-3" />{lesson.type}
                            </span>
                            {isDone && (
                                <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400">
                                    <CheckCircle2 className="w-3 h-3" />Completed
                                </span>
                            )}
                        </div>
                        <h1 className="text-3xl font-black text-text leading-tight mb-3" style={{ fontFamily: 'Georgia, serif' }}>
                            {lesson.title}
                        </h1>
                        <div className="flex items-center gap-3 text-sm text-muted">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{lesson.duration}</span>
                            <span className="text-muted/40">·</span>
                            <span>{lesson.description}</span>
                        </div>
                    </div>

                    <div className="w-12 h-1 bg-primary rounded-full mb-8" />

                    {/* Content sections */}
                    {lesson.content && lesson.content.length > 0 ? (
                        <div className="space-y-7">
                            {lesson.content.map((sec, i) => (
                                <RenderSection key={i} section={sec} idx={i} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-muted">
                            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="font-semibold">No content yet.</p>
                            <p className="text-sm mt-1">The admin hasn't added content for this lesson.</p>
                        </div>
                    )}

                    {/* Practice CTA when next lesson is practice */}
                    {lesson.type !== 'practice' && nextLesson?.type === 'practice' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                            className="mt-10 rounded-2xl bg-primary/6 border border-primary/20 p-6 flex items-center gap-5">
                            <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center shrink-0">
                                <PenLine className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-black text-text">Ready to practice?</p>
                                <p className="text-sm text-muted mt-0.5">The next lesson is a hands-on exercise.</p>
                            </div>
                            <button onClick={() => goTo(nextLesson)}
                                className="px-5 py-2.5 rounded-xl bg-primary text-white font-black text-sm hover:bg-primary/90 transition-colors shrink-0">
                                Go to Practice
                            </button>
                        </motion.div>
                    )}

                    {/* Footer nav */}
                    <div className="mt-12 pt-8 border-t border-border flex items-center justify-between gap-4 flex-wrap">
                        <button onClick={() => prevLesson && goTo(prevLesson)} disabled={!prevLesson}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            <ArrowLeft className="w-4 h-4" />
                            {prevLesson ? prevLesson.title : 'Previous'}
                        </button>

                        {!isDone ? (
                            <button onClick={markDone}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white font-black text-sm hover:bg-primary/90 active:scale-[0.97] transition-all shadow-md shadow-primary/20">
                                <CheckCircle2 className="w-4 h-4" /> Mark as Complete
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500/10 text-green-600 dark:text-green-400 font-black text-sm border border-green-500/20">
                                <CheckCircle2 className="w-4 h-4" /> Completed
                            </div>
                        )}

                        <button onClick={() => nextLesson && goTo(nextLesson)} disabled={!nextLesson}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                            {nextLesson ? nextLesson.title : 'Next'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Practice modal */}
            <AnimatePresence>
                {practiceOpen && (
                    <LessonPracticeModal
                        lesson={lesson}
                        courseTitle={course.title}
                        onClose={() => setPracticeOpen(false)}
                        onComplete={() => { markDone(); setPracticeOpen(false); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}