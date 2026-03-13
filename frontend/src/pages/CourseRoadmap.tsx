import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, BookOpen, PenLine, CheckCircle2, Clock,
    Play, Lock, Trophy, Star, Layers,
} from 'lucide-react';
import { MOCK_COURSES } from '../_mock/mockCourses';
import type { Lesson, Chapter } from '../_mock/mockCourses';
import LessonPracticeModal from '../components/ui/LessonPracticeModal';


const DIFF_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    Beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    Intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    Advanced: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};

function TypeBadge({ type }: { type: Lesson['type'] }) {
    const base = 'inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border';
    if (type === 'practice') return <span className={`${base} bg-primary/10 text-primary border-primary/20`}><PenLine className="w-2.5 h-2.5" /> Practice</span>;
    if (type === 'video') return <span className={`${base} bg-blue-500/10 text-blue-500 border-blue-400/20`}><Play className="w-2.5 h-2.5" /> Video</span>;
    return <span className={`${base} bg-muted/30 text-muted border-border`}><BookOpen className="w-2.5 h-2.5" /> Reading</span>;
}

function ChapterSpine({
    chapters, completedLessons, selectedId, onSelect,
}: {
    chapters: Chapter[];
    completedLessons: number[];
    selectedId: number | null;
    onSelect: (id: number) => void;
}) {
    return (
        <div className="py-6 px-4 flex flex-col">
            {chapters.map((ch, i) => {
                const done = ch.lessons.filter(l => completedLessons.includes(l.id)).length;
                const total = ch.lessons.length;
                const allDone = done === total && total > 0;
                const sel = selectedId === ch.id;
                const prevDone = i === 0 || chapters[i - 1].lessons.every(l => completedLessons.includes(l.id));
                const locked = !prevDone;
                const pct = total > 0 ? Math.round((done / total) * 100) : 0;

                return (
                    <div key={ch.id} className="flex flex-col items-center">
                        {/* Connector line above (skip first) */}
                        {i > 0 && (
                            <div className="flex justify-center w-full" style={{ height: 28 }}>
                                <div className={`w-0.5 h-full rounded-full transition-colors duration-500 ${allDone ? 'bg-primary' : 'bg-border'}`} />
                            </div>
                        )}

                        {/* Chapter card */}
                        <button
                            onClick={() => !locked && onSelect(ch.id)}
                            disabled={locked}
                            className={`w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 disabled:cursor-not-allowed group relative overflow-hidden
                                ${sel
                                    ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                    : allDone
                                        ? 'border-primary/30 bg-primary/[0.03] hover:border-primary/50'
                                        : locked
                                            ? 'border-border opacity-40'
                                            : 'border-border bg-card hover:border-primary/40 hover:shadow-md'}`}
                        >
                            {/* Selected indicator */}
                            {sel && (
                                <motion.div
                                    layoutId="sel-bar"
                                    className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl"
                                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                />
                            )}

                            {/* Chapter number + status */}
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-all
                                    ${allDone ? 'bg-primary text-white'
                                        : sel ? 'bg-primary text-white'
                                            : locked ? 'bg-border text-muted'
                                                : 'bg-primary/10 text-primary'}`}>
                                    {locked ? <Lock className="w-3 h-3" /> : allDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${sel ? 'text-primary' : 'text-muted'}`}>
                                    Ch. {i + 1}
                                </span>
                            </div>

                            {/* Title */}
                            <p className={`text-sm font-black leading-snug mb-3 ${sel ? 'text-text' : 'text-text/80'}`}>
                                {ch.title}
                            </p>

                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-muted font-medium">{done}/{total} done</span>
                                    <span className={`text-[10px] font-black tabular-nums ${allDone ? 'text-primary' : 'text-muted'}`}>{pct}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full bg-primary"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }}
                                    />
                                </div>
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

function LessonsPanel({
    chapter, completedLessons, onMarkDone, onPractice, courseId,
}: {
    chapter: Chapter;
    completedLessons: number[];
    onMarkDone: (id: number) => void;
    onPractice: (l: Lesson) => void;
    courseId: number | string;
}) {
    const navigate = useNavigate();
    const done = chapter.lessons.filter(l => completedLessons.includes(l.id)).length;

    return (
        <motion.div
            key={chapter.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex flex-col h-full"
        >
            {/* Panel header */}
            <div className="px-8 py-6 border-b border-border shrink-0 bg-card">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">Lessons</p>
                <h2 className="text-2xl font-black text-text leading-tight mb-1">{chapter.title}</h2>
                <p className="text-sm text-muted">{done} of {chapter.lessons.length} completed</p>
            </div>

            {/* Lessons */}
            <div className="flex-1 overflow-y-auto px-8 py-4 space-y-3">
                {chapter.lessons.map((lesson, li) => {
                    const isDone = completedLessons.includes(lesson.id);
                    return (
                        <motion.div
                            key={lesson.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: li * 0.06, duration: 0.22 }}
                            onClick={() => {
                                if (lesson.type !== 'practice') {
                                    navigate(`/roadmap/course/${courseId}/lesson/${lesson.id}`);
                                }
                            }}
                            className={`group relative rounded-2xl border-2 p-5 transition-all duration-200
                                ${lesson.type !== 'practice' ? 'cursor-pointer' : ''}
                                ${isDone
                                    ? 'border-primary/20 bg-primary/[0.03]'
                                    : lesson.type !== 'practice'
                                        ? 'border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:bg-primary/[0.01]'
                                        : 'border-border bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5'}`}
                        >
                            {/* Done stripe on left */}
                            {isDone && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl opacity-60" />
                            )}

                            <div className="flex items-start gap-5">
                                {/* Step circle */}
                                <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 font-black text-base border-2 transition-all duration-300
                                    ${isDone
                                        ? 'bg-primary border-primary text-white shadow-md shadow-primary/25'
                                        : 'border-border text-muted group-hover:border-primary group-hover:text-primary'}`}>
                                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : li + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                        <p className={`text-base font-black leading-snug ${isDone ? 'text-muted line-through' : 'text-text'}`}>
                                            {lesson.title}
                                        </p>
                                        <TypeBadge type={lesson.type} />
                                    </div>
                                    {lesson.description && (
                                        <p className="text-sm text-muted leading-relaxed mb-3">{lesson.description}</p>
                                    )}
                                    <div className="flex items-center gap-1.5 text-muted/60">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-sm font-medium">{lesson.duration}</span>
                                    </div>
                                </div>

                                {/* Actions — bigger, more prominent */}
                                <div className="flex flex-col gap-2 shrink-0 items-end">
                                    {lesson.type === 'practice' && lesson.practiceRefs?.length ? (
                                        <button
                                            onClick={() => onPractice(lesson)}
                                            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-black hover:bg-primary/90 active:scale-[0.97] transition-all shadow-md shadow-primary/25 flex items-center gap-2"
                                        >
                                            <PenLine className="w-4 h-4" /> Practice
                                        </button>
                                    ) : null}

                                    {!isDone ? (
                                        <button
                                            onClick={() => onMarkDone(lesson.id)}
                                            className="px-5 py-2.5 rounded-xl border-2 border-border text-sm font-bold text-muted hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-[0.97] transition-all"
                                        >
                                            Mark done
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-primary text-sm font-black px-2">
                                            <CheckCircle2 className="w-4 h-4" /> Done
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default function CourseRoadmap() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const course = MOCK_COURSES.find(c => c.id === Number(courseId));

    const [selectedId, setSelectedId] = useState<number | null>(
        () => course?.chapterData?.[0]?.id ?? null
    );
    const [practiceLesson, setPracticeLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>(
        course?.chapterData?.flatMap(ch => ch.lessons.filter(l => l.completed).map(l => l.id)) ?? []
    );

    if (!course) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-text">
            <p className="text-xl mb-4">Course not found.</p>
            <button onClick={() => navigate('/roadmap')} className="text-primary underline">Back</button>
        </div>
    );

    const chapters = course.chapterData ?? [];
    const allLessons = chapters.flatMap(ch => ch.lessons);
    const totalLessons = allLessons.length;
    const doneCount = completedLessons.length;
    const progressPct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;
    const isFullyDone = progressPct === 100;
    const selChapter = chapters.find(ch => ch.id === selectedId) ?? null;
    const markDone = (id: number) => setCompletedLessons(p => p.includes(id) ? p : [...p, id]);
    const diff = course.difficulty ? DIFF_STYLES[course.difficulty] : null;

    const CIRCUMFERENCE = 2 * Math.PI * 22;

    return (
        <div className="flex flex-col flex-1 w-full bg-background text-text overflow-hidden">

            {/* ── Top banner ── */}
            <div className="relative shrink-0 border-b border-border bg-card overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/6 via-transparent to-transparent pointer-events-none" />
                <div className="absolute top-0 right-0 w-64 h-full opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle at 100% 50%, var(--primary) 0%, transparent 70%)' }} />

                <div className="relative flex items-stretch">
                    {/* Left section */}
                    <div className="flex-1 px-8 py-6">
                        <button
                            onClick={() => navigate('/roadmap')}
                            className="flex items-center gap-2 text-muted hover:text-primary text-xs font-black uppercase tracking-widest mb-4 group w-fit transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                            Learning Paths
                        </button>

                        <div className="flex items-start gap-4">
                            <div className="w-1 self-stretch rounded-full bg-primary mt-0.5 shrink-0" />
                            <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    {diff && (
                                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${diff.bg} ${diff.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />
                                            {course.difficulty}
                                        </span>
                                    )}
                                    {course.badgeText && (
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                            <Star className="w-2.5 h-2.5" /> {course.badgeText}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-3xl font-black text-text leading-tight mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                                    {course.title}
                                </h1>
                                <p className="text-sm text-muted leading-relaxed max-w-lg">{course.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right stats */}
                    <div className="shrink-0 flex items-center border-l border-border px-8 gap-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted font-semibold mb-1">
                                <Layers className="w-3.5 h-3.5 text-primary/60" /> Chapters
                            </div>
                            <p className="text-3xl font-black text-text">{chapters.length}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs text-muted font-semibold mb-1">
                                <BookOpen className="w-3.5 h-3.5 text-primary/60" /> Lessons
                            </div>
                            <p className="text-3xl font-black text-text">{totalLessons}</p>
                        </div>

                        {/* Progress circle */}
                        <div className="flex flex-col items-center gap-1 relative">
                            <div className="relative flex items-center justify-center">
                                <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="32" cy="32" r="22" fill="none" stroke="var(--border)" strokeWidth="5" />
                                    <motion.circle
                                        cx="32" cy="32" r="22" fill="none"
                                        stroke={isFullyDone ? '#22c55e' : 'var(--primary)'}
                                        strokeWidth="5" strokeLinecap="round"
                                        strokeDasharray={CIRCUMFERENCE}
                                        initial={{ strokeDashoffset: CIRCUMFERENCE }}
                                        animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progressPct / 100) }}
                                        transition={{ duration: 1.1, ease: 'easeOut' }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center" style={{ transform: 'rotate(0deg)' }}>
                                    <span className={`text-base font-black tabular-nums leading-none ${isFullyDone ? 'text-green-500' : 'text-primary'}`}>
                                        {progressPct}%
                                    </span>
                                </div>
                            </div>
                            <span className="text-[10px] text-muted font-semibold uppercase tracking-wider">Progress</span>
                        </div>

                        {isFullyDone && (
                            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center gap-1">
                                <Trophy className="w-8 h-8 text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-amber-500">Complete!</span>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Main: chapter spine (left) + lessons (right) ── */}
            <div className="flex flex-1 overflow-hidden min-h-0">

                {/* Chapter spine — wide enough to be real cards */}
                <div className="w-72 shrink-0 border-r border-border bg-background overflow-y-auto">
                    <ChapterSpine
                        chapters={chapters}
                        completedLessons={completedLessons}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                </div>

                {/* Lesson panel */}
                <div className="flex-1 overflow-hidden relative bg-background">
                    <AnimatePresence mode="wait">
                        {selChapter ? (
                            <LessonsPanel
                                key={selChapter.id}
                                chapter={selChapter}
                                completedLessons={completedLessons}
                                onMarkDone={markDone}
                                onPractice={setPracticeLesson}
                                courseId={courseId!}
                            />
                        ) : (
                            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center h-full text-center px-10">
                                <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mb-5">
                                    <BookOpen className="w-9 h-9 text-primary/40" />
                                </div>
                                <p className="text-lg font-black text-text mb-1">Select a chapter</p>
                                <p className="text-sm text-muted">Pick a chapter on the left to view its lessons</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Practice modal */}
            <AnimatePresence>
                {practiceLesson && (
                    <LessonPracticeModal
                        lesson={practiceLesson}
                        courseTitle={course.title}
                        onClose={() => setPracticeLesson(null)}
                        onComplete={() => { markDone(practiceLesson.id); setPracticeLesson(null); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}