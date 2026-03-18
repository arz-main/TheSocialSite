import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { MOCK_COURSES } from '../_mock/mockCourses';
import type { Lesson } from '../_mock/mockCourses';
import { CourseBanner, ChapterSpine, LessonsPanel, EmptyChapterState } from '../components/ui/RoadmapPageComponents';
import { computeCourseProgress } from '../utils/RoadmapPageUtils';
import LessonPracticeModal from '../components/ui/LessonPracticeModal';

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
    const progressPct = computeCourseProgress(allLessons.length, completedLessons);
    const isFullyDone = progressPct === 100;
    const selChapter = chapters.find(ch => ch.id === selectedId) ?? null;
    const markDone = (id: number) => setCompletedLessons(p => p.includes(id) ? p : [...p, id]);

    return (
        <div className="flex flex-col flex-1 w-full bg-background text-text overflow-hidden">
            <CourseBanner
                course={course}
                chapters={chapters}
                totalLessons={allLessons.length}
                progressPct={progressPct}
                isFullyDone={isFullyDone}
            />

            <div className="flex flex-1 overflow-hidden min-h-0">
                <div className="w-72 shrink-0 border-r border-border bg-background overflow-y-auto">
                    <ChapterSpine
                        chapters={chapters}
                        completedLessons={completedLessons}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                </div>

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
                            <EmptyChapterState />
                        )}
                    </AnimatePresence>
                </div>
            </div>

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
