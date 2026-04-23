import { createContext, useCallback, useRef } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import type { Comment, CommentActionResponse, CommentsContextType } from "../types/CommentTypes";

export const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, Comment[]>>(new Map());

    // ─── Fetch comments for a post ────────────────────────────────
    const getComments = useCallback(async (postId: string): Promise<Comment[]> => {
        if (cache.current.has(postId)) return cache.current.get(postId)!;
        const { data } = await axios.get<Comment[]>(`/comments/post/${postId}`);
        cache.current.set(postId, data);
        return data;
    }, [axios]);

    // ─── Add a comment to a post ──────────────────────────────────
    const postComment = useCallback(async (postId: string, content: string): Promise<Comment> => {
        const { data } = await axios.post<CommentActionResponse>(`/comments/create`, { content, postId });
        const comment = data.commentDto as Comment;
        const existing = cache.current.get(postId) ?? [];
        cache.current.set(postId, [...existing, comment]);
        return comment;
    }, [axios]);

    return (
        <CommentsContext.Provider
            value={{ getComments, postComment }}
        >
            {children}
        </CommentsContext.Provider>
    );
}