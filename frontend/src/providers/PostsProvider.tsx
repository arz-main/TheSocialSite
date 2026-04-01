import { createContext, useCallback, useRef, useState } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type Post } from "../types/PostTypes";
import type { PostsContextType, UpdatePostPayload } from "../types/PostTypes";

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, Post>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ─── Post Updates ─────────────────────────────────────────────────────
    async function updatePost(postId: string, data: UpdatePostPayload): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.put(`/posts/${postId}`, data);
            cache.current.delete(postId); // force fresh fetch next time
        } catch (err) {
            setError("Failed to update post");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function deletePost(postId: string): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`/posts/${postId}`);
            cache.current.delete(postId); // remove from cache
        } catch (err) {
            setError("Failed to delete post");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    // ─── Post Fetching ───────────────────────────────────────────────────
    const getPost = useCallback(async (postId: string): Promise<Post> => {
        if (cache.current.has(postId)) return cache.current.get(postId)!;
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<Post>(`/posts/${postId}`);
            cache.current.set(postId, data);
            return data;
        } catch (err) {
            setError("Failed to load post");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const getAllPosts = useCallback(async (): Promise<Post[]> => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<Post[]>("/posts");
            data.forEach(post => cache.current.set(post.id, post));
            return data;
        } catch (err) {
            setError("Failed to load posts");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const getUserPosts = useCallback(async (userId: string): Promise<Post[]> => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<Post[]>(`/posts/user/${userId}`);
            data.forEach(post => cache.current.set(post.id, post));
            return data;
        } catch (err) {
            setError("Failed to load user's posts");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    return (
        <PostsContext.Provider
            value={{
                loading,
                error,
                getPost,
                getAllPosts,
                getUserPosts,
                updatePost,
                deletePost,
            }}
        >
            {children}
        </PostsContext.Provider>
    );
}