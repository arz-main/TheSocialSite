export type DifficultyFilter = 'All' | 'Beginner' | 'Intermediate' | 'Advanced';
export type ProgressFilter = 'All' | 'Not Started' | 'In Progress' | 'Completed';
export type SortOption = 'Default' | 'Progress ↑' | 'Progress ↓';

export interface RoadmapStats {
    completed: number;
    inProgress: number;
    total: number;
    totalLessons: number;
    doneLessons: number;
}
