// ─────────────────────────────────────────────────────────────────────────────
// Made by Claude — Redesigned Roadmap page
// Fixed: removed motion layout (was blocking card navigation), new design
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/ui/RoadmapPageComponents';
import {
    Heart, ChevronDown, BookOpen, GraduationCap,
    CheckCircle2, Flame, Trophy, Search, PenLine,
} from 'lucide-react';
import { MOCK_COURSES, type Course } from '../_mock/mockCourses';

type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
type ProgressFilter = 'All' | 'Not Started' | 'In Progress' | 'Completed';
type SortOption = 'Default' | 'Progress ↑' | 'Progress ↓';
function HeroSlicedStrip({ courses }: { courses: Course[] }) {
    const navigate = useNavigate();
    const picks = courses.filter(c => c.image).slice(0, 5);
    return (
        <div className="flex gap-1 h-full">
            {picks.map((c, i) => (
                <button
                    key={c.id}
                    onClick={() => navigate(`/roadmap/course/${c.id}`)}
                    className="flex-1 relative overflow-hidden rounded-xl group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    style={{ transform: `skewX(${i % 2 === 0 ? -4 : 4}deg)` }}
                >
                    <img
                        src={c.image}
                        alt={c.title}
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

function StatPill({ icon, label, value, total, accent }: {
    icon: React.ReactNode; label: string; value: number; total: number; accent: string;
}) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl bg-card border border-border min-w-[100px]">
            <div className="flex items-center gap-1.5">
                <span className={accent}>{icon}</span>
                <span className="text-xs text-muted font-medium">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${accent}`}>{value}</span>
                <span className="text-xs text-muted">/ {total}</span>
            </div>
            <div className="w-full bg-border rounded-full h-1 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: 'var(--primary)' }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: 0.3 }} />
            </div>
        </div>
    );
}

function FilterSelect<T extends string>({ value, onChange, options, label }: {
    value: T; onChange: (v: T) => void; options: T[]; label: string;
}) {
    const [open, setOpen] = useState(false);
    const isActive = value !== options[0];
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                    ${isActive
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                        : 'bg-card text-muted border-border hover:border-primary/40 hover:text-text'
                    }`}
            >
                {isActive ? value : label}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.1 }}
                            className="absolute left-0 top-full mt-1.5 z-20 min-w-[150px] bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                        >
                            {options.map((o, i) => (
                                <button
                                    key={o}
                                    onClick={() => { onChange(o); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-xs transition-colors
                                        ${value === o ? 'bg-primary/10 text-primary font-semibold' : 'text-text hover:bg-primary/5'}
                                        ${i !== 0 ? 'border-t border-border/50' : ''}`}
                                >
                                    {i === 0 ? `All ${label}s` : o}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Roadmap() {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [showFavourites, setShowFavourites] = useState(false);
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
    const [progressFilter, setProgressFilter] = useState<ProgressFilter>('All');
    const [sortOption, setSortOption] = useState<SortOption>('Default');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFavourite = (index: number) =>
        setCourses(prev => prev.map((c, i) => i === index ? { ...c, isFavourite: !c.isFavourite } : c));

    const stats = useMemo(() => {
        const completed = courses.filter(c => c.progress === 100).length;
        const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
        const totalLessons = courses.reduce((s, c) => s + c.lessons, 0);
        const doneLessons = courses.filter(c => c.progress === 100).reduce((s, c) => s + c.lessons, 0);
        return { completed, inProgress, total: courses.length, totalLessons, doneLessons };
    }, [courses]);

    const filteredCourses = useMemo(() => {
        let r = [...courses];
        if (searchQuery.trim()) r = r.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase()));
        if (showFavourites) r = r.filter(c => c.isFavourite);
        if (difficultyFilter !== 'All') r = r.filter(c => c.difficulty === difficultyFilter);
        if (progressFilter === 'Not Started') r = r.filter(c => c.progress === 0);
        else if (progressFilter === 'In Progress') r = r.filter(c => c.progress > 0 && c.progress < 100);
        else if (progressFilter === 'Completed') r = r.filter(c => c.progress === 100);
        if (sortOption === 'Progress ↑') r.sort((a, b) => a.progress - b.progress);
        else if (sortOption === 'Progress ↓') r.sort((a, b) => b.progress - a.progress);
        return r;
    }, [courses, showFavourites, difficultyFilter, progressFilter, sortOption, searchQuery]);

    const hasActiveFilters = showFavourites || difficultyFilter !== 'All' || progressFilter !== 'All' || sortOption !== 'Default' || searchQuery.trim() !== '';
    const clearFilters = () => { setShowFavourites(false); setDifficultyFilter('All'); setProgressFilter('All'); setSortOption('Default'); setSearchQuery(''); };

    return (
        <div className="flex flex-col flex-1 w-full bg-background text-text">

            {/* ── Hero ── */}
            <div className="relative overflow-hidden bg-card border-b border-border">
                <div className="absolute inset-0 opacity-[0.04]"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, var(--primary) 0%, transparent 50%), radial-gradient(circle at 80% 20%, var(--secondary) 0%, transparent 40%)' }} />

                <div className="relative max-w-7xl mx-auto px-10 py-10 flex items-center gap-12">
                    {/* text */}
                    <div className="flex-1 min-w-0">
                        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
                            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary mb-2.5">Your Learning Journey</p>
                            <h1 className="text-4xl font-black text-text mb-2.5 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
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
                    {/* sliced strip */}
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                        className="hidden lg:block w-[360px] h-[160px] shrink-0 rounded-xl overflow-hidden">
                        <HeroSlicedStrip courses={courses} />
                    </motion.div>
                </div>
            </div>

            {/* ── Filter bar ── */}
            <div className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-16 z-10">
                <div className="max-w-7xl mx-auto px-10 py-3 flex items-center gap-3 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted" />
                        <input
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search courses…"
                            className="pl-9 pr-3 py-1.5 rounded-full text-xs bg-background border border-border text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors w-44"
                        />
                    </div>
                    <div className="w-px h-5 bg-border" />
                    <button
                        onClick={() => setShowFavourites(v => !v)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                            ${showFavourites ? 'bg-red-500 text-white border-red-500' : 'bg-card text-muted border-border hover:border-red-300 hover:text-red-500'}`}
                    >
                        <Heart className={`w-3 h-3 ${showFavourites ? 'fill-white' : ''}`} /> Favourites
                    </button>
                    <FilterSelect<DifficultyFilter> value={difficultyFilter} onChange={setDifficultyFilter} options={['All', 'Beginner', 'Intermediate', 'Advanced']} label="Difficulty" />
                    <FilterSelect<ProgressFilter> value={progressFilter} onChange={setProgressFilter} options={['All', 'Not Started', 'In Progress', 'Completed']} label="Progress" />
                    <FilterSelect<SortOption> value={sortOption} onChange={setSortOption} options={['Default', 'Progress ↑', 'Progress ↓']} label="Sort" />
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="px-2.5 py-1 rounded-full text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all border border-transparent hover:border-red-200 font-medium">
                            Clear all
                        </button>
                    )}
                    <span className="ml-auto text-xs text-muted">{filteredCourses.length} of {courses.length} courses</span>
                </div>
            </div>

            {/* ── Grid ── */}
            {/* NOTE: No motion layout on wrappers — this was blocking card click navigation */}
            <div className="flex-1 py-8 px-10">
                <div className="max-w-7xl mx-auto">
                    {filteredCourses.length > 0 ? (
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
                            {filteredCourses.map((course, i) => {
                                const originalIndex = courses.indexOf(course);
                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.22, delay: i * 0.04 }}
                                    >
                                        <CourseCard
                                            id={course.id}
                                            id={course.id}
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
                            })}
                        </div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-24 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-border flex items-center justify-center mb-4">
                                <GraduationCap className="w-8 h-8 text-muted" />
                            </div>
                            <p className="text-lg font-semibold text-text mb-1">No courses found</p>
                            <p className="text-sm text-muted mb-4">Try adjusting your filters.</p>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                                    Clear filters
                                </button>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}