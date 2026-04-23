import { useContext } from "react";
import { CourseContext } from "../providers/CoursesProvider";
import type { CourseContextType } from "../types/CourseTypes";

export function useCourses(): CourseContextType {
    const context = useContext(CourseContext);
    if (!context) throw new Error("useCourses must be used within a CoursesProvider");
    return context;
}
