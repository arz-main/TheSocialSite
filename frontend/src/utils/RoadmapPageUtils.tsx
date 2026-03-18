import { useMemo } from 'react';
import type { Course } from '../_mock/mockCourses';
import type { DifficultyFilter, ProgressFilter, SortOption, RoadmapStats } from '../types/RoadmapPageTypes';

// ── Roadmap page hooks ────────────────────────────────────────────────────────

export function useRoadmapStats(courses: Course[]): RoadmapStats {
    return useMemo(() => {
        const completed = courses.filter(c => c.progress === 100).length;
        const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100).length;
        const totalLessons = courses.reduce((s, c) => s + c.lessons, 0);
        const doneLessons = courses
            .filter(c => c.progress === 100)
            .reduce((s, c) => s + c.lessons, 0);
        return { completed, inProgress, total: courses.length, totalLessons, doneLessons };
    }, [courses]);
}

export function useFilteredCourses(
    courses: Course[],
    searchQuery: string,
    showFavourites: boolean,
    difficultyFilter: DifficultyFilter,
    progressFilter: ProgressFilter,
    sortOption: SortOption,
): Course[] {
    return useMemo(() => {
        let r = [...courses];
        if (searchQuery.trim())
            r = r.filter(c =>
                c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                c.description.toLowerCase().includes(searchQuery.toLowerCase())
            );
        if (showFavourites) r = r.filter(c => c.isFavourite);
        if (difficultyFilter !== 'All') r = r.filter(c => c.difficulty === difficultyFilter);
        if (progressFilter === 'Not Started') r = r.filter(c => c.progress === 0);
        else if (progressFilter === 'In Progress') r = r.filter(c => c.progress > 0 && c.progress < 100);
        else if (progressFilter === 'Completed') r = r.filter(c => c.progress === 100);
        if (sortOption === 'Progress ↑') r.sort((a, b) => a.progress - b.progress);
        else if (sortOption === 'Progress ↓') r.sort((a, b) => b.progress - a.progress);
        return r;
    }, [courses, searchQuery, showFavourites, difficultyFilter, progressFilter, sortOption]);
}

// ── CourseRoadmap page utils ──────────────────────────────────────────────────

export const CIRCUMFERENCE = 2 * Math.PI * 22;

export const DIFF_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
    Beginner: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    Intermediate: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
    Advanced: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
};

export const DIFFICULTY_COLORS: Record<string, string> = {
    Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
    Advanced: 'bg-red-100 text-red-700 border-red-200',
};

export function computeCourseProgress(totalLessons: number, completedLessons: number[]): number {
    return totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;
}
