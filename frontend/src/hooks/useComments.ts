import { useContext } from "react";
import type { CommentsContextType } from "../types/CommentTypes";
import { CommentsContext } from "../providers/CommentsProvider";

export function useComments(): CommentsContextType {
    const context = useContext(CommentsContext);
    if (!context) throw new Error("useComments must be used within an CommentsProvider");
    return context;
}