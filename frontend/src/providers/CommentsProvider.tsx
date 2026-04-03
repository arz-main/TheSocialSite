import { createContext, useCallback, useRef, useState } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import type { Comment, CommentActionResponse, CommentsContextType } from "../types/CommentTypes";

export const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, Comment[]>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Fetch comments for a post ────────────────────────────────
    const getComments = useCallback(async (postId: string): Promise<Comment[]> => {
        if (cache.current.has(postId)) return cache.current.get(postId)!;
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<Comment[]>(`/comments/post/${postId}`);
            cache.current.set(postId, data);
            return data;
        } catch (err) {
            setError("Failed to load comments");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    // ─── Add a comment to a post ──────────────────────────────────
    const postComment = useCallback(async (postId: string, content: string): Promise<Comment> => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.post<CommentActionResponse>(`/comments/create`, { content, postId });
            console.log("CommentActionResponse:", data);
            const comment = data.commentDto as Comment;
            const existing = cache.current.get(postId) ?? [];
            cache.current.set(postId, [...existing, comment]);
            return comment;
        } catch (err) {
            setError("Failed to add comment");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    return (
        <CommentsContext.Provider
            value={{
                loading,
                error,
                getComments,
                postComment,
            }}
        >
            {children}
        </CommentsContext.Provider>
    );
}