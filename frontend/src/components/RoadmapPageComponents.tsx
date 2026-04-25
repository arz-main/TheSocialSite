import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    BookOpen, CheckCircle, CheckCircle2, Heart, Clock,
    Play, Lock, Trophy, Star, PenLine, GraduationCap,
    Search, Flame, ArrowLeft,
} from 'lucide-react';
import { StatPill, FilterSelect } from './RoadmapPageUIComponents';
import { DIFF_STYLES, DIFFICULTY_COLORS } from '../utils/RoadmapPageUtils';
import type { Course, Lesson, Chapter } from '../_mock/mockCourses';
import type { DifficultyFilter, ProgressFilter, SortOption, RoadmapStats } from '../types/RoadmapPageTypes';
import paths from '../routes/paths';

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap page components
// ─────────────────────────────────────────────────────────────────────────────

export function HeroSlicedStrip({ courses }: { courses: Course[] }) {
    const navigate = useNavigate();
    const picks = courses.filter(c => c.image).slice(0, 5);
    return (
        <div className="flex gap-1 h-full">
            {picks.map((c, i) => (
                <button
                    key={c.id}
                    onClick={() => navigate(paths.roadmap.toCourse(c.id))}
                    className="flex-1 relative overflow-hidden rounded-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    style={{ transform: `skewX(${i % 2 === 0 ? -4 : 4}deg)` }}
                >
                    <img
                        src={c.image} alt={c.title}
                        className="absolute inset-0 w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-500"
                        style={{ transform: `skewX(${i % 2 === 0 ? 4 : -4}deg) scale(1.1)` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-[9px] font-black truncate leading-tight uppercase tracking-wide">{c.title}</p>
                        <div className="w-full bg-white/20 rounded-full h-0.5 mt-1.5">
                            <div className="h-0.5 rounded-full bg-white/80" style={{ width: `${c.progress}%` }} />
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

export function RoadmapHero({ courses, stats }: { courses: Course[]; stats: RoadmapStats }) {
    return (
        <div className="relative overflow-hidden bg-card border-b border-border">
            <div className="absolute inset-0 opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--secondary) 0%, transparent 40%)' }} />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-10 py-6 sm:py-10 flex items-center gap-8 sm:gap-12">
                <div className="flex-1 min-w-0">
                    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2.5">Your Learning Journey</p>
                        <h1 className="text-4xl font-black text-text mb-2.5 leading-tight">
                            Learning Paths
                        </h1>
                        <p className="text-muted text-sm leading-relaxed max-w-md mb-6">
                            Structured courses with chapters, lessons, and practice sessions — build real drawing skills step by step.
                        </p>
                        <div className="flex gap-3 flex-wrap">
                            <StatPill icon={<Trophy className="w-3.5 h-3.5" />} label="Completed" value={stats.completed} total={stats.total} accent="text-green-500" />
                            <StatPill icon={<Flame className="w-3.5 h-3.5" />} label="In Progress" value={stats.inProgress} total={stats.total} accent="text-amber-500" />
                            <StatPill icon={<BookOpen className="w-3.5 h-3.5" />} label="Lessons done" value={stats.doneLessons} total={stats.totalLessons} accent="text-primary" />
                        </div>
                    </motion.div>
                </div>
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                    className="hidden lg:block w-[360px] h-[160px] shrink-0 rounded-xl overflow-hidden"
                >
                    <HeroSlicedStrip courses={courses} />
                </motion.div>
            </div>
        </div>
    );
}

interface FilterBarProps {
    searchQuery: string; setSearchQuery: (v: string) => void;
    showFavourites: boolean; setShowFavourites: (v: boolean) => void;
    difficultyFilter: DifficultyFilter; setDifficultyFilter: (v: DifficultyFilter) => void;
    progressFilter: ProgressFilter; setProgressFilter: (v: ProgressFilter) => void;
    sortOption: SortOption; setSortOption: (v: SortOption) => void;
    hasActiveFilters: boolean; onClearFilters: () => void;
    filteredCount: number; totalCount: number;
}

export function FilterBar({ searchQuery, setSearchQuery, showFavourites, setShowFavourites, difficultyFilter, setDifficultyFilter, progressFilter, setProgressFilter, sortOption, setSortOption, hasActiveFilters, onClearFilters, filteredCount, totalCount }: FilterBarProps) {
    return (
        <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-16 z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-10 py-3 flex items-center gap-3 overflow-x-auto flex-nowrap sm:flex-wrap">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search courses…"
                        className="pl-9 pr-3 py-1.5 rounded-full text-xs bg-background border border-border text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors w-44" />
                </div>
                <div className="w-px h-5 bg-border" />
                <button onClick={() => setShowFavourites(!showFavourites)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${showFavourites ? 'bg-red-500 text-white border-red-500' : 'bg-card text-muted border-border hover:border-red-300 hover:text-red-500'}`}>
                    <Heart className={`w-3 h-3 ${showFavourites ? 'fill-white' : ''}`} /> Favourites
                </button>
                <FilterSelect<DifficultyFilter> value={difficultyFilter} onChange={setDifficultyFilter} options={['All', 'Beginner', 'Intermediate', 'Advanced']} label="Difficulty" />
                <FilterSelect<ProgressFilter> value={progressFilter} onChange={setProgressFilter} options={['All', 'Not Started', 'In Progress', 'Completed']} label="Progress" />
                <FilterSelect<SortOption> value={sortOption} onChange={setSortOption} options={['Default', 'Progress ↑', 'Progress ↓']} label="Sort" />
                {hasActiveFilters && (
                    <button onClick={onClearFilters} className="px-2.5 py-1 rounded-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-200 font-medium">
                        Clear all
                    </button>
                )}
                <span className="ml-auto text-xs text-muted">{filteredCount} of {totalCount} courses</span>
            </div>
        </div>
    );
}

interface CardProps {
    id: number; image: string; title: string; description: string; progress: number;
    badgeText?: string; difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
    chapters: number; lessons: number; badgeIcon?: React.ReactNode;
    isFavourite: boolean; onToggleFavourite?: () => void;
}

export function CourseCard({ id, image, title, description, progress, badgeText, chapters, lessons, badgeIcon, difficulty, isFavourite, onToggleFavourite }: CardProps) {
    const isCompleted = progress === 100;
    return (
        <Link to={`/roadmap/course/${id}`}
            className={`block w-full rounded-2xl shadow-md overflow-hidden bg-card transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:shadow-xl ${isCompleted ? 'ring-2 ring-green-500/60' : 'hover:ring-2 hover:ring-primary/40'}`}
            style={{ textDecoration: 'none' }}>
            <div className="relative">
                <img src={image} alt={title} className="w-full h-44 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <button onClick={e => { e.preventDefault(); e.stopPropagation(); onToggleFavourite?.(); }}
                    className="absolute top-3 left-3 p-1.5 rounded-full bg-white/85 hover:bg-white transition-all duration-200 shadow-sm hover:scale-110 active:scale-95 z-10"
                    aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
                    <Heart className={`w-3.5 h-3.5 transition-all duration-200 ${isFavourite ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400'}`} />
                </button>
                {isCompleted && <div className="absolute top-3 right-3 bg-green-500 text-white p-1 rounded-full shadow z-10"><CheckCircle className="w-4 h-4" /></div>}
                {difficulty && <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${DIFFICULTY_COLORS[difficulty]}`}>{difficulty}</span>}
            </div>
            <div className="p-4">
                <h3 className="font-bold text-text text-base mb-1 truncate">{title}</h3>
                <p className="text-sm text-muted line-clamp-2 mb-3 leading-relaxed">{description}</p>
                <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted">
                        <BookOpen className="w-3.5 h-3.5 text-primary/60" />
                        <span>{chapters} ch · {lessons} lessons</span>
                    </div>
                    {(badgeText || badgeIcon) && (
                        <span className={`ml-auto inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full font-semibold ${isCompleted ? 'bg-green-500 text-white' : 'bg-primary/15 text-primary'}`}>
                            {badgeIcon}{badgeText}
                        </span>
                    )}
                </div>
                <div>
                    <div className="w-full bg-border rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${isCompleted ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${progress}%` }} />
                    </div>
                    <p className={`text-xs mt-1 font-medium ${isCompleted ? 'text-green-600' : 'text-muted'}`}>
                        {isCompleted ? '✓ Completed' : `${progress}% complete`}
                    </p>
                </div>
            </div>
        </Link>
    );
}

interface CourseGridProps {
    filteredCourses: Course[]; courses: Course[];
    onToggleFavourite: (originalIndex: number) => void;
    hasActiveFilters: boolean; onClearFilters: () => void;
}

export function CourseGrid({ filteredCourses, courses, onToggleFavourite, hasActiveFilters, onClearFilters }: CourseGridProps) {
    if (filteredCourses.length === 0) {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-2xl bg-border flex items-center justify-center mb-4">
                    <GraduationCap className="w-8 h-8 text-muted" />
                </div>
                <p className="text-lg font-semibold text-text mb-1">No courses found</p>
                <p className="text-sm text-muted mb-4">Try adjusting your filters.</p>
                {hasActiveFilters && (
                    <button onClick={onClearFilters} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                        Clear filters
                    </button>
                )}
            </motion.div>
        );
    }
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredCourses.map((course, i) => {
                const originalIndex = courses.indexOf(course);
                return (
                    <motion.div key={course.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.22, delay: i * 0.04 }}>
                        <CourseCard
                            id={course.id} image={course.image} title={course.title}
                            description={course.description} progress={course.progress}
                            chapters={course.chapters} lessons={course.lessons}
                            difficulty={course.difficulty} badgeText={course.badgeText}
                            isFavourite={course.isFavourite}
                            onToggleFavourite={() => onToggleFavourite(originalIndex)}
                        />
                    </motion.div>
                );
            })}
        </div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// CourseRoadmap page components
// ─────────────────────────────────────────────────────────────────────────────

export function TypeBadge({ type }: { type: Lesson['type'] }) {
    const base = 'inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border';
    if (type === 'practice') return <span className={`${base} bg-primary/10 text-primary border-primary/20`}><PenLine className="w-2.5 h-2.5" /> Practice</span>;
    if (type === 'video') return <span className={`${base} bg-blue-500/10 text-blue-500 border-blue-400/20`}><Play className="w-2.5 h-2.5" /> Video</span>;
    return <span className={`${base} bg-muted/30 text-muted border-border`}><BookOpen className="w-2.5 h-2.5" /> Reading</span>;
}

interface CourseBannerProps {
    course: Course; chapters: Chapter[];
    totalLessons: number; progressPct: number; isFullyDone: boolean;
    completedLessons: number[];
}

const CIRC_R = 30;
const CIRC = 2 * Math.PI * CIRC_R;

export function CourseBanner({ course, chapters, totalLessons, progressPct, isFullyDone, completedLessons }: CourseBannerProps) {
    const navigate = useNavigate();
    const diff = course.difficulty ? DIFF_STYLES[course.difficulty] : null;

    return (
        <div className="relative shrink-0 border-b border-border overflow-hidden">
            {/* Blurred thumbnail background */}
            {course.image ? (
                <>
                    <img src={course.image} alt="" aria-hidden
                        className="absolute inset-0 w-full h-full object-cover scale-110 pointer-events-none"
                        style={{ filter: 'blur(3px)', opacity: 0.45 }} />
                    <div className="absolute inset-0 bg-card/60 pointer-events-none" />
                </>
            ) : (
                <div className="absolute inset-0 bg-card" />
            )}

            <div className="relative px-4 sm:px-8 pt-4 pb-0">
                {/* Back */}
                <button onClick={() => navigate(paths.roadmap.page)}
                    className="flex items-center gap-1.5 text-muted hover:text-primary text-[10px] font-black uppercase tracking-widest mb-4 group w-fit transition-colors">
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> Learning Paths
                </button>

                <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
                    {/* ── Left: title + author ── */}
                    <div className="flex-1 min-w-0 pb-4 sm:pb-5">
                        {/* Badges */}
                        {(diff || course.badgeText) && (
                            <div className="flex gap-2 flex-wrap mb-3">
                                {diff && (
                                    <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${diff.bg} ${diff.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${diff.dot}`} />{course.difficulty}
                                    </span>
                                )}
                                {course.badgeText && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                        <Star className="w-2.5 h-2.5" />{course.badgeText}
                                    </span>
                                )}
                            </div>
                        )}

                        <h1 className="text-xl sm:text-2xl font-black text-text leading-tight mb-1.5">{course.title}</h1>
                        <p className="text-sm text-muted leading-relaxed mb-4 max-w-xl">{course.description}</p>

                        {/* Author card */}
                        {course.authorUsername && (
                            <button
                                onClick={() => navigate(paths.explore.toUser(course.authorId ?? ''))}
                                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-border bg-background/70 hover:border-primary/50 hover:bg-primary/5 transition-all w-fit group"
                            >
                                {course.authorAvatarUrl
                                    ? <img src={course.authorAvatarUrl} alt={course.authorUsername}
                                        className="w-11 h-11 rounded-full object-cover border-2 border-border group-hover:border-primary/40 transition-colors shrink-0" />
                                    : <div className="w-11 h-11 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-base shrink-0">
                                        {course.authorUsername[0].toUpperCase()}
                                    </div>
                                }
                                <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-0.5">Course by</p>
                                    <p className="text-sm font-bold text-text group-hover:text-primary transition-colors">{course.authorUsername}</p>
                                </div>
                                <GraduationCap className="w-4 h-4 text-muted group-hover:text-primary transition-colors ml-1" />
                            </button>
                        )}
                    </div>

                    {/* ── Right: progress + chapter breakdown ── */}
                    <div className="shrink-0 lg:w-72 pb-4 sm:pb-5 flex flex-col gap-2.5">
                        {/* Overall progress card */}
                        <div className="flex items-center gap-3 p-3 rounded-2xl border border-border bg-background/60">
                            {/* Circle */}
                            <div className="relative shrink-0">
                                <svg width="76" height="76" style={{ transform: 'rotate(-90deg)' }}>
                                    <circle cx="38" cy="38" r={CIRC_R} fill="none" stroke="var(--border)" strokeWidth="6" />
                                    <motion.circle cx="38" cy="38" r={CIRC_R} fill="none"
                                        stroke={isFullyDone ? '#22c55e' : 'var(--primary)'}
                                        strokeWidth="6" strokeLinecap="round"
                                        strokeDasharray={CIRC}
                                        initial={{ strokeDashoffset: CIRC }}
                                        animate={{ strokeDashoffset: CIRC * (1 - progressPct / 100) }}
                                        transition={{ duration: 1.1, ease: 'easeOut' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    {isFullyDone
                                        ? <Trophy className="w-5 h-5 text-amber-500" />
                                        : <span className={`text-base font-black tabular-nums leading-none ${isFullyDone ? 'text-green-500' : 'text-primary'}`}>{progressPct}%</span>
                                    }
                                </div>
                            </div>
                            {/* Stats */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted mb-2">
                                    {isFullyDone ? '🏆 Course Complete!' : 'Overall Progress'}
                                </p>
                                <div className="flex gap-4">
                                    <div>
                                        <p className="text-2xl font-black text-text leading-none">{chapters.length}</p>
                                        <p className="text-[10px] text-muted font-semibold mt-0.5">chapters</p>
                                    </div>
                                    <div className="w-px bg-border self-stretch" />
                                    <div>
                                        <p className="text-2xl font-black text-text leading-none">{totalLessons}</p>
                                        <p className="text-[10px] text-muted font-semibold mt-0.5">lessons</p>
                                    </div>
                                    <div className="w-px bg-border self-stretch" />
                                    <div>
                                        <p className="text-2xl font-black text-text leading-none">{completedLessons.length}</p>
                                        <p className="text-[10px] text-muted font-semibold mt-0.5">done</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

interface ChapterSpineProps {
    chapters: Chapter[]; completedLessons: number[];
    selectedId: number | null; onSelect: (id: number) => void;
}

export function ChapterSpine({ chapters, completedLessons, selectedId, onSelect }: ChapterSpineProps) {
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
                        {i > 0 && (
                            <div className="flex justify-center w-full" style={{ height: 28 }}>
                                <div className={`w-0.5 h-full rounded-full transition-colors duration-500 ${allDone ? 'bg-primary' : 'bg-border'}`} />
                            </div>
                        )}
                        <button onClick={() => !locked && onSelect(ch.id)} disabled={locked}
                            className={`w-full rounded-2xl border-2 p-4 text-left transition-all duration-200 disabled:cursor-not-allowed group relative overflow-hidden
                                ${sel ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                                    : allDone ? 'border-primary/30 bg-primary/[0.03] hover:border-primary/50'
                                        : locked ? 'border-border opacity-40'
                                            : 'border-border bg-card hover:border-primary/40 hover:shadow-md'}`}>
                            {sel && <motion.div layoutId="sel-bar" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />}
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-black transition-all
                                    ${allDone ? 'bg-primary text-white' : sel ? 'bg-primary text-white' : locked ? 'bg-border text-muted' : 'bg-primary/10 text-primary'}`}>
                                    {locked ? <Lock className="w-3 h-3" /> : allDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-[0.15em] ${sel ? 'text-primary' : 'text-muted'}`}>Ch. {i + 1}</span>
                            </div>
                            <p className={`text-sm font-black leading-snug mb-3 ${sel ? 'text-text' : 'text-text/80'}`}>{ch.title}</p>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-muted font-medium">{done}/{total} done</span>
                                    <span className={`text-[10px] font-black tabular-nums ${allDone ? 'text-primary' : 'text-muted'}`}>{pct}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                                    <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.05 }} />
                                </div>
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

interface LessonRowProps {
    lesson: Lesson; index: number; isDone: boolean;
    courseId: number | string; onMarkDone: (id: number) => void; onPractice: (l: Lesson) => void;
}

export function LessonRow({ lesson, index, isDone, courseId, onMarkDone, onPractice }: LessonRowProps) {
    const navigate = useNavigate();
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06, duration: 0.22 }}
            onClick={() => { if (lesson.type !== 'practice') navigate(paths.roadmap.toLesson(courseId, lesson.id)); }}
            className={`group relative rounded-2xl border-2 p-5 transition-all duration-200
                ${lesson.type !== 'practice' ? 'cursor-pointer' : ''}
                ${isDone ? 'border-primary/20 bg-primary/[0.03]'
                    : lesson.type !== 'practice' ? 'border-border bg-card hover:border-primary/50 hover:shadow-md hover:shadow-primary/5 hover:bg-primary/[0.01]'
                        : 'border-border bg-card hover:border-primary/30 hover:shadow-md hover:shadow-primary/5'}`}
        >
            {isDone && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-xl opacity-60" />}
            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-5">
                <div className="flex items-start gap-3 sm:gap-5 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 font-black text-base border-2 transition-all duration-300
                        ${isDone ? 'bg-primary border-primary text-white shadow-md shadow-primary/25' : 'border-border text-muted group-hover:border-primary group-hover:text-primary'}`}>
                        {isDone ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                            <p className={`text-sm sm:text-base font-black leading-snug ${isDone ? 'text-muted line-through' : 'text-text'}`}>{lesson.title}</p>
                            <TypeBadge type={lesson.type} />
                        </div>
                        {lesson.description && <p className="text-xs sm:text-sm text-muted leading-relaxed mb-2 sm:mb-3">{lesson.description}</p>}
                        <div className="flex items-center gap-1.5 text-muted/60">
                            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span className="text-xs sm:text-sm font-medium">{lesson.duration}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row sm:flex-col gap-2 shrink-0 items-end w-full sm:w-auto justify-end">
                    {lesson.type === 'practice' ? (
                        <button onClick={e => { e.stopPropagation(); onPractice(lesson); }}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-black hover:bg-primary/90 active:scale-[0.97] transition-all shadow-md shadow-primary/25 flex items-center gap-1.5 sm:gap-2">
                            <PenLine className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Practice
                        </button>
                    ) : null}
                    {!isDone ? (
                        <button onClick={e => { e.stopPropagation(); onMarkDone(lesson.id); }}
                            className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl border-2 border-border text-xs sm:text-sm font-bold text-muted hover:border-primary hover:text-primary hover:bg-primary/5 active:scale-[0.97] transition-all">
                            Mark done
                        </button>
                    ) : (
                        <div className="flex items-center gap-1.5 text-primary text-xs sm:text-sm font-black px-2">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Done
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

interface LessonsPanelProps {
    chapter: Chapter; completedLessons: number[];
    onMarkDone: (id: number) => void; onPractice: (l: Lesson) => void;
    courseId: number | string;
}

export function LessonsPanel({ chapter, completedLessons, onMarkDone, onPractice, courseId }: LessonsPanelProps) {
    const done = chapter.lessons.filter(l => completedLessons.includes(l.id)).length;
    return (
        <motion.div key={chapter.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }} className="flex flex-col h-full">
            <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-border shrink-0 bg-card">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-1">Lessons</p>
                <h2 className="text-2xl font-black text-text leading-tight mb-1">{chapter.title}</h2>
                <p className="text-sm text-muted">{done} of {chapter.lessons.length} completed</p>
            </div>
            <div className="flex-1 overflow-y-auto px-3 sm:px-8 py-4 space-y-3">
                {chapter.lessons.map((lesson, li) => (
                    <LessonRow key={lesson.id} lesson={lesson} index={li}
                        isDone={completedLessons.includes(lesson.id)} courseId={courseId}
                        onMarkDone={onMarkDone} onPractice={onPractice} />
                ))}
            </div>
        </motion.div>
    );
}

export function EmptyChapterState() {
    return (
        <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-10">
            <div className="w-20 h-20 rounded-3xl bg-primary/8 flex items-center justify-center mb-5">
                <BookOpen className="w-9 h-9 text-primary/40" />
            </div>
            <p className="text-lg font-black text-text mb-1">Select a chapter</p>
            <p className="text-sm text-muted">Pick a chapter on the left to view its lessons</p>
        </motion.div>
    );
} 