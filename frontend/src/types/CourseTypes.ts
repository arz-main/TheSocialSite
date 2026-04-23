export type BlockType = "Text" | "Video" | "Image" | "PracticeSession";

export type BlockDto = {
    id: number;
    type: BlockType;
    lessonId: number;
    order: number;
    textContent?: string;
    videoUrl?: string;
    durationSeconds?: number;
    imageUrl?: string;
    caption?: string;
    practiceConfig?: string;
};

export type LessonDto = {
    id: number;
    name: string;
    description?: string;
    chapterId: number;
    order: number;
    blocks?: BlockDto[];
};

export type ChapterDto = {
    id: number;
    name: string;
    description?: string;
    courseId: number;
    order: number;
    lessons?: LessonDto[];
};

export type CourseDto = {
    id: number;
    name: string;
    description: string;
    thumbnailUrl?: string;
    authorId: string;
    authorUsername: string;
    authorAvatarUrl?: string;
    isPublished: boolean;
    createdAt: string;
    chapters?: ChapterDto[];
};

export type CreateCourseDto = {
    name: string;
    description: string;
    thumbnailUrl?: string;
};

export type CreateChapterDto = {
    name: string;
    description?: string;
    courseId: number;
    order: number;
};

export type CreateLessonDto = {
    name: string;
    description?: string;
    chapterId: number;
    order: number;
};

export type CreateBlockDto = {
    type: BlockType;
    lessonId: number;
    order: number;
    textContent?: string;
    videoUrl?: string;
    durationSeconds?: number;
    imageUrl?: string;
    caption?: string;
    practiceConfig?: string;
};

export interface CourseContextType {
    getAllCourses: () => Promise<CourseDto[]>;
    getCourseById: (id: number) => Promise<CourseDto>;
    createCourse: (dto: CreateCourseDto) => Promise<CourseDto>;
    updateCourse: (id: number, dto: CreateCourseDto) => Promise<string>;
    deleteCourse: (id: number) => Promise<string>;
    publishCourse: (id: number) => Promise<string>;
    createChapter: (dto: CreateChapterDto) => Promise<ChapterDto>;
    updateChapter: (id: number, dto: CreateChapterDto) => Promise<string>;
    deleteChapter: (id: number) => Promise<string>;
    createLesson: (dto: CreateLessonDto) => Promise<LessonDto>;
    updateLesson: (id: number, dto: CreateLessonDto) => Promise<string>;
    deleteLesson: (id: number) => Promise<string>;
    createBlock: (dto: CreateBlockDto) => Promise<BlockDto>;
    updateBlock: (id: number, dto: CreateBlockDto) => Promise<string>;
    deleteBlock: (id: number) => Promise<string>;
}
