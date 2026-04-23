import { createContext, useCallback, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import type {
    CourseDto, ChapterDto, LessonDto, BlockDto,
    CreateCourseDto, CreateChapterDto, CreateLessonDto, CreateBlockDto,
    CourseContextType
} from "../types/CourseTypes";

export const CourseContext = createContext<CourseContextType | undefined>(undefined);

export function CoursesProvider({ children }: { children: ReactNode }) {
    const axios = useAxios();

    const getAllCourses = useCallback(async (): Promise<CourseDto[]> => {
        const { data } = await axios.get<CourseDto[]>("/courses");
        return data;
    }, [axios]);

    const getCourseById = useCallback(async (id: number): Promise<CourseDto> => {
        const { data } = await axios.get<CourseDto>(`/courses/${id}`);
        return data;
    }, [axios]);

    const createCourse = useCallback(async (dto: CreateCourseDto): Promise<CourseDto> => {
        const { data } = await axios.post<CourseDto>("/courses", dto);
        return data;
    }, [axios]);

    const updateCourse = useCallback(async (id: number, dto: CreateCourseDto): Promise<string> => {
        const { data } = await axios.put<string>(`/courses/${id}`, dto);
        return data;
    }, [axios]);

    const deleteCourse = useCallback(async (id: number): Promise<string> => {
        const { data } = await axios.delete<string>(`/courses/${id}`);
        return data;
    }, [axios]);

    const publishCourse = useCallback(async (id: number): Promise<string> => {
        const { data } = await axios.patch<string>(`/courses/${id}/publish`);
        return data;
    }, [axios]);

    const createChapter = useCallback(async (dto: CreateChapterDto): Promise<ChapterDto> => {
        const { data } = await axios.post<ChapterDto>("/courses/chapters", dto);
        return data;
    }, [axios]);

    const updateChapter = useCallback(async (id: number, dto: CreateChapterDto): Promise<string> => {
        const { data } = await axios.put<string>(`/courses/chapters/${id}`, dto);
        return data;
    }, [axios]);

    const deleteChapter = useCallback(async (id: number): Promise<string> => {
        const { data } = await axios.delete<string>(`/courses/chapters/${id}`);
        return data;
    }, [axios]);

    const createLesson = useCallback(async (dto: CreateLessonDto): Promise<LessonDto> => {
        const { data } = await axios.post<LessonDto>("/courses/lessons", dto);
        return data;
    }, [axios]);

    const updateLesson = useCallback(async (id: number, dto: CreateLessonDto): Promise<string> => {
        const { data } = await axios.put<string>(`/courses/lessons/${id}`, dto);
        return data;
    }, [axios]);

    const deleteLesson = useCallback(async (id: number): Promise<string> => {
        const { data } = await axios.delete<string>(`/courses/lessons/${id}`);
        return data;
    }, [axios]);

    const createBlock = useCallback(async (dto: CreateBlockDto): Promise<BlockDto> => {
        const { data } = await axios.post<BlockDto>("/courses/blocks", dto);
        return data;
    }, [axios]);

    const updateBlock = useCallback(async (id: number, dto: CreateBlockDto): Promise<string> => {
        const { data } = await axios.put<string>(`/courses/blocks/${id}`, dto);
        return data;
    }, [axios]);

    const deleteBlock = useCallback(async (id: number): Promise<string> => {
        const { data } = await axios.delete<string>(`/courses/blocks/${id}`);
        return data;
    }, [axios]);

    return (
        <CourseContext.Provider value={{
            getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse, publishCourse,
            createChapter, updateChapter, deleteChapter,
            createLesson, updateLesson, deleteLesson,
            createBlock, updateBlock, deleteBlock,
        }}>
            {children}
        </CourseContext.Provider>
    );
}
