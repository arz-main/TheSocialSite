import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import CourseCard from '../components/ui/RoadmapPageComponents';
import { Heart, ChevronDown, BookOpen, Layers, GraduationCap, CheckCircle2 } from 'lucide-react';
import { MOCK_COURSES, Course } from '../_mock/mockCourses';

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
type ProgressFilter = 'All' | 'Not Started' | 'In Progress' | 'Completed';
type SortOption = 'Default' | 'Progress ↑' | 'Progress ↓';

export default function Roadmap() {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [showFavourites, setShowFavourites] = useState(false);
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
    const [progressFilter, setProgressFilter] = useState<ProgressFilter>('All');
    const [sortOption, setSortOption] = useState<SortOption>('Default');

    const toggleFavourite = (index: number) => {
        setCourses(prev =>
            prev.map((c, i) => i === index ? { ...c, isFavourite: !c.isFavourite } : c)
        );
    };

    const stats = useMemo(() => {
        const completed = courses.filter(c => c.progress === 100).length;
        const totalChapters = courses.reduce((sum, c) => sum + c.chapters, 0);
        const completedChapters = courses
            .filter(c => c.progress === 100)
            .reduce((sum, c) => sum + c.chapters, 0);
        const totalLessons = courses.reduce((sum, c) => sum + c.lessons, 0);
        const completedLessons = courses
            .filter(c => c.progress === 100)
            .reduce((sum, c) => sum + c.lessons, 0);
        return { completed, total: courses.length, totalChapters, completedChapters, totalLessons, completedLessons };
    }, [courses]);

    const filteredCourses = useMemo(() => {
        let result = [...courses];

        if (showFavourites) result = result.filter(c => c.isFavourite);

        if (difficultyFilter !== 'All')
            result = result.filter(c => c.difficulty === difficultyFilter);

        if (progressFilter === 'Not Started') result = result.filter(c => c.progress === 0);
        else if (progressFilter === 'In Progress') result = result.filter(c => c.progress > 0 && c.progress < 100);
        else if (progressFilter === 'Completed') result = result.filter(c => c.progress === 100);

        if (sortOption === 'Progress ↑') result.sort((a, b) => a.progress - b.progress);
        else if (sortOption === 'Progress ↓') result.sort((a, b) => b.progress - a.progress);

        return result;
    }, [courses, showFavourites, difficultyFilter, progressFilter, sortOption]);

    return (
        <div className="flex flex-col flex-1 w-full p-4 bg-background text-text">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-10 py-5">
                    <h1 className="text-4xl text-center font-bold text-primary mb-6">Learning Paths</h1>
                    <p className="text-lg text-center mb-8">
                        Choose a learning path to follow a structured curriculum designed to help you master specific
                        art skills. Each path includes courses, projects, and milestones to track your progress.
                    </p>

                    {/* ── Stats + Filter Bar ── */}
                    <div className="mb-8 rounded-xl border border-primary/10 bg-card shadow-sm">
                        {/* Single compact row: stats + filters */}
                        <div className="flex flex-wrap items-center gap-x-1 gap-y-1 px-3 py-2 divide-x divide-primary/10">
                            {/* Stats */}
                            <div className="flex items-center gap-3 pr-3">
                                <StatPill icon={<CheckCircle2 className="w-3.5 h-3.5" />} label="Courses" value={stats.completed} total={stats.total} color="text-green-500" />
                                <StatPill icon={<Layers className="w-3.5 h-3.5" />} label="Chapters" value={stats.completedChapters} total={stats.totalChapters} color="text-primary" />
                                <StatPill icon={<BookOpen className="w-3.5 h-3.5" />} label="Lessons" value={stats.completedLessons} total={stats.totalLessons} color="text-primary" />
                            </div>

                            {/* Filters */}
                            <div className="flex flex-wrap items-center gap-1.5 pl-3">
                                {/* Favourites toggle */}
                                <button
                                    onClick={() => setShowFavourites(v => !v)}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-all
                                        ${showFavourites ? 'bg-red-500 text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                                >
                                    <Heart className={`w-3 h-3 ${showFavourites ? 'fill-white' : ''}`} />
                                    Favourites
                                </button>

                                <FilterSelect<DifficultyFilter>
                                    value={difficultyFilter}
                                    onChange={setDifficultyFilter}
                                    options={['All', 'Beginner', 'Intermediate', 'Advanced']}
                                    label="Difficulty"
                                />
                                <FilterSelect<ProgressFilter>
                                    value={progressFilter}
                                    onChange={setProgressFilter}
                                    options={['All', 'Not Started', 'In Progress', 'Completed']}
                                    label="Progress"
                                />
                                <FilterSelect<SortOption>
                                    value={sortOption}
                                    onChange={setSortOption}
                                    options={['Default', 'Progress ↑', 'Progress ↓']}
                                    label="Sort"
                                />

                                {(showFavourites || difficultyFilter !== 'All' || progressFilter !== 'All' || sortOption !== 'Default') && (
                                    <button
                                        onClick={() => { setShowFavourites(false); setDifficultyFilter('All'); setProgressFilter('All'); setSortOption('Default'); }}
                                        className="px-2 py-1 rounded-md text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <span className="ml-auto pl-3 text-xs text-gray-400">
                                {filteredCourses.length}/{courses.length}
                            </span>
                        </div>
                    </div>

                    {/* ── Cards ── */}
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
                        <AnimatePresence mode="popLayout">
                            {filteredCourses.length > 0 ? filteredCourses.map((course, i) => {
                                const originalIndex = courses.indexOf(course);
                                return (
                                    <motion.div
                                        key={`${course.id}-${course.title}-${i}`}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <CourseCard
                                            image={course.image}
                                            title={course.title}
                                            description={course.description}
                                            progress={course.progress}
                                            chapters={course.chapters}
                                            lessons={course.lessons}
                                            difficulty={course.difficulty}
                                            badgeText={course.badgeText}
                                            isFavourite={course.isFavourite}
                                            onToggleFavourite={() => toggleFavourite(originalIndex)}
                                        />
                                    </motion.div>
                                );
                            }) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-16 text-gray-400"
                                >
                                    <GraduationCap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                                    <p className="text-lg font-medium">No courses match your filters</p>
                                    <p className="text-sm mt-1">Try adjusting or clearing your filters</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ── Subcomponents ──────────────────────────────────────────────

function StatPill({ icon, label, value, total, color }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    total: number;
    color: string;
}) {
    return (
        <div className="flex items-center gap-1">
            <span className={`${color} opacity-60`}>{icon}</span>
            <span className="text-xs text-gray-500">
                <span className={`font-bold ${color}`}>{value}</span>
                <span className="text-gray-400">/{total}</span>
                <span className="ml-1 text-gray-400">{label}</span>
            </span>
        </div>
    );
}

function FilterSelect<T extends string>({ value, onChange, options, label }: {
    value: T;
    onChange: (v: T) => void;
    options: T[];
    label: string;
}) {
    const [open, setOpen] = useState(false);
    const isActive = value !== options[0];
    const displayLabel = isActive ? value : label;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`inline-flex items-center gap-1 pl-2.5 pr-2 py-1 rounded-md text-xs font-medium transition-all whitespace-nowrap
                    ${isActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
            >
                {displayLabel}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -4, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.97 }}
                            transition={{ duration: 0.12 }}
                            className="absolute left-0 top-full mt-1 z-20 min-w-[120px] bg-card border border-primary/15 rounded-lg shadow-lg overflow-hidden"
                        >
                            {options.map((o, i) => (
                                <button
                                    key={o}
                                    onClick={() => { onChange(o); setOpen(false); }}
                                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors
                                        ${value === o
                                            ? 'bg-primary/10 text-primary font-semibold'
                                            : 'text-text hover:bg-primary/5'
                                        }
                                        ${i !== 0 ? 'border-t border-primary/5' : ''}`}
                                >
                                    {i === 0 ? `${label}: All` : o}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}