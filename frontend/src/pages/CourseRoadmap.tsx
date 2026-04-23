import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import type { Course, Chapter, Lesson, LessonSection } from '../_mock/mockCourses';
import { CourseBanner, ChapterSpine, LessonsPanel, EmptyChapterState } from '../components/RoadmapPageComponents';
import { computeCourseProgress } from '../utils/RoadmapPageUtils';
import LessonPracticeModal from '../components/LessonPracticeModal';
import { useCourses } from '../hooks/useCourses';
import type { CourseDto, ChapterDto, LessonDto, BlockDto } from '../types/CourseTypes';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

function blockToSection(b: BlockDto): LessonSection | null {
    if (b.type === 'Text') return { type: 'text', body: b.textContent ?? '' };
    if (b.type === 'Image') return { type: 'image', src: b.imageUrl ?? '', caption: b.caption };
    return null;
}

function mapApiLesson(l: LessonDto): Lesson {
    const firstBlock = l.blocks?.[0];
    let type: 'reading' | 'video' | 'practice' = 'reading';
    if (firstBlock?.type === 'Video') type = 'video';
    else if (firstBlock?.type === 'PracticeSession') type = 'practice';

    let duration = '';
    if (firstBlock?.type === 'Video' && firstBlock.durationSeconds) {
        duration = `${Math.floor(firstBlock.durationSeconds / 60)} min`;
    }

    let practiceRefs: string[] | undefined;
    if (firstBlock?.type === 'PracticeSession' && firstBlock.practiceConfig) {
        try { practiceRefs = JSON.parse(firstBlock.practiceConfig); } catch { /* invalid JSON */ }
    }

    return {
        id: l.id,
        title: l.name,
        duration,
        type,
        completed: false,
        description: l.description ?? '',
        content: (l.blocks ?? []).map(blockToSection).filter((s): s is LessonSection => s !== null),
        videoUrl: firstBlock?.type === 'Video' ? firstBlock.videoUrl : undefined,
        practiceRefs,
    };
}

function mapApiChapter(ch: ChapterDto): Chapter {
    return { id: ch.id, title: ch.name, lessons: (ch.lessons ?? []).map(mapApiLesson) };
}

function mapApiCourse(c: CourseDto): Course {
    return {
        id: c.id,
        image: c.thumbnailUrl ?? '',
        title: c.name,
        description: c.description,
        progress: 0,
        chapters: c.chapters?.length ?? 0,
        lessons: c.chapters?.reduce((sum, ch) => sum + (ch.lessons?.length ?? 0), 0) ?? 0,
        isFavourite: false,
        difficulty: undefined,
        badgeText: undefined,
        chapterData: undefined,
        authorId: c.authorId,
        authorUsername: c.authorUsername,
        authorAvatarUrl: c.authorAvatarUrl,
    };
}

const completedKey = (id: string) => `completed-lessons-${id}`;

export default function CourseRoadmap() {
    const { courseId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();
    const { getCourseById } = useCourses();

    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [practiceLesson, setPracticeLesson] = useState<Lesson | null>(null);
    const [completedLessons, setCompletedLessons] = useState<number[]>([]);

    useEffect(() => {
        if (!courseId) return;
        try {
            const stored = localStorage.getItem(completedKey(courseId));
            if (stored) setCompletedLessons(JSON.parse(stored));
        } catch { /* ignore */ }

        getCourseById(Number(courseId))
            .then(dto => {
                const mappedChapters = (dto.chapters ?? []).map(mapApiChapter);
                setCourse(mapApiCourse(dto));
                setChapters(mappedChapters);
                setSelectedId(mappedChapters[0]?.id ?? null);
            })
            .catch(() => setError('Failed to load course'))
            .finally(() => setLoading(false));
    }, [courseId]);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;
    if (!course) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-text">
            <p className="text-xl mb-4">Course not found.</p>
            <button onClick={() => navigate('/roadmap')} className="text-primary underline">Back</button>
        </div>
    );

    const allLessons = chapters.flatMap(ch => ch.lessons);
    const progressPct = computeCourseProgress(allLessons.length, completedLessons);
    const isFullyDone = progressPct === 100;
    const selChapter = chapters.find(ch => ch.id === selectedId) ?? null;
    const markDone = (id: number) => setCompletedLessons(p => {
        if (p.includes(id)) return p;
        const next = [...p, id];
        try { localStorage.setItem(completedKey(courseId!), JSON.stringify(next)); } catch { /* ignore */ }
        return next;
    });

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
