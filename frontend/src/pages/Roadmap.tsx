import { useState } from 'react';
import { MOCK_COURSES, type Course } from '../_mock/mockCourses';
import { RoadmapHero, FilterBar, CourseGrid } from '../components/ui/RoadmapPageComponents';
import { useRoadmapStats, useFilteredCourses } from '../utils/RoadmapPageUtils';
import type { DifficultyFilter, ProgressFilter, SortOption } from '../types/RoadmapPageTypes';

export default function Roadmap() {
    const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
    const [showFavourites, setShowFavourites] = useState(false);
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
    const [progressFilter, setProgressFilter] = useState<ProgressFilter>('All');
    const [sortOption, setSortOption] = useState<SortOption>('Default');
    const [searchQuery, setSearchQuery] = useState('');

    const toggleFavourite = (index: number) =>
        setCourses(prev => prev.map((c, i) => i === index ? { ...c, isFavourite: !c.isFavourite } : c));

    const stats = useRoadmapStats(courses);
    const filteredCourses = useFilteredCourses(courses, searchQuery, showFavourites, difficultyFilter, progressFilter, sortOption);

    const hasActiveFilters = showFavourites || difficultyFilter !== 'All' || progressFilter !== 'All' || sortOption !== 'Default' || searchQuery.trim() !== '';
    const clearFilters = () => { setShowFavourites(false); setDifficultyFilter('All'); setProgressFilter('All'); setSortOption('Default'); setSearchQuery(''); };

    return (
        <div className="flex flex-col flex-1 w-full bg-background text-text">
            <RoadmapHero courses={courses} stats={stats} />

            <FilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                showFavourites={showFavourites} setShowFavourites={setShowFavourites}
                difficultyFilter={difficultyFilter} setDifficultyFilter={setDifficultyFilter}
                progressFilter={progressFilter} setProgressFilter={setProgressFilter}
                sortOption={sortOption} setSortOption={setSortOption}
                hasActiveFilters={hasActiveFilters} onClearFilters={clearFilters}
                filteredCount={filteredCourses.length} totalCount={courses.length}
            />

            <div className="flex-1 py-8 px-10">
                <div className="max-w-7xl mx-auto">
                    <CourseGrid
                        filteredCourses={filteredCourses}
                        courses={courses}
                        onToggleFavourite={toggleFavourite}
                        hasActiveFilters={hasActiveFilters}
                        onClearFilters={clearFilters}
                    />
                </div>
            </div>
        </div>
    );
}
