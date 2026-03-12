import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
    ArrowLeft, BookOpen, PenLine, CheckCircle2,
    ChevronDown, Clock, Layers, Play, Lock
} from 'lucide-react';
import { MOCK_COURSES } from '../../_mock/mockCourses';
import type { Lesson } from '../../_mock/mockCourses';
import LessonPracticeModal from '../ui/LessonPracticeModal';

export default function CourseRoadmap() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const course = MOCK_COURSES.find(c => c.id === Number(courseId));

    const [openChapters, setOpenChapters] = useState<number[]>([1]);
    const [practiceLesson, setPracticeLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>(
        course?.chapterData?.flatMap(ch => ch.lessons.filter(l => l.completed).map(l => l.id)) ?? []
    );

    if (!course) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-text">
                <p className="text-xl mb-4">Course not found.</p>
                <button onClick={() => navigate('/roadmap')} className="text-primary underline">Back to Roadmap</button>
            </div>
        );
    }

    const allLessons = course.chapterData?.flatMap(ch => ch.lessons) ?? [];
    const totalLessons = allLessons.length;
    const doneCount = completedLessons.length;
    const progressPct = totalLessons > 0 ? Math.round((doneCount / totalLessons) * 100) : 0;

    const toggleChapter = (chId: number) =>
        setOpenChapters(prev => prev.includes(chId) ? prev.filter(x => x !== chId) : [...prev, chId]);

    const markComplete = (lessonId: number) =>
        setCompletedLessons(prev => prev.includes(lessonId) ? prev : [...prev, lessonId]);

    const lessonTypeIcon = (type: Lesson['type']) => {
        if (type === 'practice') return <PenLine className="w-4 h-4" />;
        if (type === 'video') return <Play className="w-4 h-4" />;
        return <BookOpen className="w-4 h-4" />;
    };

    const lessonTypeLabel = (type: Lesson['type']) => {
        if (type === 'practice') return 'Practice';
        if (type === 'video') return 'Video';
        return 'Reading';
    };

    return (
        <div className="flex flex-col flex-1 w-full bg-background text-text">

            {/* ── Hero Banner ── */}
            <div className="relative h-52 overflow-hidden">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end px-10 pb-7">
                    <button
                        onClick={() => navigate('/roadmap')}
                        className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm mb-3 w-fit transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Learning Paths
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                        {course.difficulty && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                                {course.difficulty}
                            </span>
                        )}
                    </div>
                    <p className="text-white/70 text-sm mt-1">{course.description}</p>
                </div>
            </div>

            {/* ── Progress Bar ── */}
            <div className="border-b border-border bg-card px-10 py-4">
                <div className="max-w-3xl mx-auto flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <Layers className="w-4 h-4" />
                        <span>{course.chapterData?.length ?? 0} chapters</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted">
                        <BookOpen className="w-4 h-4" />
                        <span>{totalLessons} lessons</span>
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between text-xs text-muted mb-1">
                            <span>{doneCount}/{totalLessons} completed</span>
                            <span className="font-semibold text-primary">{progressPct}%</span>
                        </div>
                        <div className="w-full bg-border rounded-full h-2">
                            <motion.div
                                className="h-2 rounded-full bg-primary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Chapter List ── */}
            <div className="flex-1 px-10 py-8">
                <div className="max-w-3xl mx-auto space-y-4">
                    {course.chapterData?.map((chapter, chIdx) => {
                        const chapterDone = chapter.lessons.every(l => completedLessons.includes(l.id));
                        const isOpen = openChapters.includes(chapter.id);
                        // Unlock: first chapter always open; others unlock when previous chapter all done
                        const prevChapter = chIdx > 0 ? course.chapterData![chIdx - 1] : null;
                        const isLocked = prevChapter
                            ? !prevChapter.lessons.every(l => completedLessons.includes(l.id))
                            : false;

                        return (
                            <motion.div
                                key={chapter.id}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: chIdx * 0.07 }}
                                className={`rounded-xl border border-border bg-card overflow-hidden shadow-sm ${isLocked ? 'opacity-60' : ''}`}
                            >
                                {/* Chapter Header */}
                                <button
                                    onClick={() => !isLocked && toggleChapter(chapter.id)}
                                    disabled={isLocked}
                                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-primary/5 transition-colors disabled:cursor-not-allowed"
                                >
                                    <div className="flex items-center gap-3">
                                        {chapterDone ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                        ) : isLocked ? (
                                            <Lock className="w-5 h-5 text-muted shrink-0" />
                                        ) : (
                                            <div className="w-5 h-5 rounded-full border-2 border-primary shrink-0" />
                                        )}
                                        <div className="text-left">
                                            <p className="text-xs text-muted font-medium uppercase tracking-wider">Chapter {chapter.id}</p>
                                            <p className="font-semibold text-text">{chapter.title}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-muted">{chapter.lessons.length} lessons</span>
                                        {!isLocked && (
                                            <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                        )}
                                    </div>
                                </button>

                                {/* Lessons */}
                                <AnimatePresence initial={false}>
                                    {isOpen && !isLocked && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: 'auto' }}
                                            exit={{ height: 0 }}
                                            transition={{ duration: 0.22, ease: 'easeInOut' }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div className="border-t border-border divide-y divide-border">
                                                {chapter.lessons.map((lesson) => {
                                                    const isDone = completedLessons.includes(lesson.id);
                                                    return (
                                                        <div
                                                            key={lesson.id}
                                                            className="flex items-center gap-4 px-5 py-3.5 hover:bg-primary/5 transition-colors group"
                                                        >
                                                            {/* Done indicator */}
                                                            <div className="shrink-0">
                                                                {isDone
                                                                    ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                                    : <div className="w-4 h-4 rounded-full border-2 border-border group-hover:border-primary transition-colors" />
                                                                }
                                                            </div>

                                                            {/* Icon */}
                                                            <div className={`shrink-0 p-1.5 rounded-md ${lesson.type === 'practice' ? 'bg-primary/10 text-primary' : 'bg-muted/40 text-muted'}`}>
                                                                {lessonTypeIcon(lesson.type)}
                                                            </div>

                                                            {/* Title + meta */}
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-medium truncate ${isDone ? 'line-through text-muted' : 'text-text'}`}>
                                                                    {lesson.title}
                                                                </p>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="text-xs text-muted">{lessonTypeLabel(lesson.type)}</span>
                                                                    <span className="text-xs text-muted/50">·</span>
                                                                    <span className="flex items-center gap-1 text-xs text-muted"><Clock className="w-3 h-3" />{lesson.duration}</span>
                                                                </div>
                                                            </div>

                                                            {/* Action button */}
                                                            <div className="shrink-0 flex items-center gap-2">
                                                                {lesson.type === 'practice' && lesson.practiceRefs && lesson.practiceRefs.length > 0 && (
                                                                    <button
                                                                        onClick={() => setPracticeLesson(lesson)}
                                                                        className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
                                                                    >
                                                                        <PenLine className="w-3.5 h-3.5" /> Practice
                                                                    </button>
                                                                )}
                                                                {!isDone && (
                                                                    <button
                                                                        onClick={() => markComplete(lesson.id)}
                                                                        className="px-3 py-1.5 rounded-lg border border-border text-xs text-muted hover:border-green-500 hover:text-green-600 transition-colors"
                                                                    >
                                                                        Mark done
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* ── Practice Modal ── */}
            <AnimatePresence>
                {practiceLesson && (
                    <LessonPracticeModal
                        lesson={practiceLesson}
                        courseTitle={course.title}
                        onClose={() => setPracticeLesson(null)}
                        onComplete={() => {
                            markComplete(practiceLesson.id);
                            setPracticeLesson(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}