import { useState, useEffect } from 'react';
import type { Course } from '../_mock/mockCourses';
import { RoadmapHero, FilterBar, CourseGrid } from '../components/RoadmapPageComponents';
import { useRoadmapStats, useFilteredCourses } from '../utils/RoadmapPageUtils';
import type { DifficultyFilter, ProgressFilter, SortOption } from '../types/RoadmapPageTypes';
import { useCourses } from '../hooks/useCourses';
import type { CourseDto } from '../types/CourseTypes';
import LoadingScreen from '../components/LoadingScreen';
import ErrorScreen from '../components/ErrorScreen';

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
    };
}

export default function Roadmap() {
    const { getAllCourses } = useCourses();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFavourites, setShowFavourites] = useState(false);
    const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All');
    const [progressFilter, setProgressFilter] = useState<ProgressFilter>('All');
    const [sortOption, setSortOption] = useState<SortOption>('Default');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        getAllCourses()
            .then(data => setCourses(data.map(mapApiCourse)))
            .catch(() => setError('Failed to load courses'))
            .finally(() => setLoading(false));
    }, []);

    const toggleFavourite = (index: number) =>
        setCourses(prev => prev.map((c, i) => i === index ? { ...c, isFavourite: !c.isFavourite } : c));

    const stats = useRoadmapStats(courses);
    const filteredCourses = useFilteredCourses(courses, searchQuery, showFavourites, difficultyFilter, progressFilter, sortOption);

    const hasActiveFilters = showFavourites || difficultyFilter !== 'All' || progressFilter !== 'All' || sortOption !== 'Default' || searchQuery.trim() !== '';
    const clearFilters = () => { setShowFavourites(false); setDifficultyFilter('All'); setProgressFilter('All'); setSortOption('Default'); setSearchQuery(''); };

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen message={error} />;

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
