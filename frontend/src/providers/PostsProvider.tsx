import { createContext, useCallback, useRef, useState } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type PostDto } from "../types/PostTypes";
import type { PostActionResponse, PostsContextType, UpdatePostPayload } from "../types/PostTypes";

export const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, PostDto>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [likeLoading, setLikeLoading] = useState(false); // <-- add this

    const updatePost = useCallback(async (postId: string, data: UpdatePostPayload): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await axios.put(`/posts/${postId}`, data);
            cache.current.delete(postId);
        } catch (err) {
            setError("Failed to update post");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const deletePost = useCallback(async (postId: string): Promise<void> => {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`/posts/${postId}`);
            cache.current.delete(postId);
        } catch (err) {
            setError("Failed to delete post");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const toggleLikePost = useCallback(async (postId: string): Promise<PostActionResponse> => {
        try {
            const { data } = await axios.post<PostActionResponse>(`/posts/toggle-like/${postId}`);
            cache.current.delete(postId);
            return data;
        } catch (err) {
            throw err;
        }
    }, [axios]);

    const getPost = useCallback(async (postId: string): Promise<PostDto> => {
        if (cache.current.has(postId)) return cache.current.get(postId)!;
        try {
            setLoading(true);
            setError(null);
            // controller returns Ok(response.PostDto) — a single PostDto
            const { data } = await axios.get<PostDto>(`/posts/${postId}`);
            cache.current.set(postId, data);
            return data;
        } catch (err) {
            setError("Failed to load post");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const getAllPosts = useCallback(async (): Promise<PostDto[]> => {
        try {
            setLoading(true);
            setError(null);
            // controller returns Ok(response.PostDtos) — a raw array
            const { data } = await axios.get<PostDto[]>("/posts");
            data.forEach(post => cache.current.set(post.id, post));
            return data;
        } catch (err) {
            setError("Failed to load posts");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [axios]);

    const getUserPosts = useCallback(async (userId: string): Promise<PostDto[]> => {
        try {
            setLoading(true);
            setError(null);
            // controller returns Ok(response.PostDtos) — a raw array
            const { data } = await axios.get<PostDto[]>(`/posts/user/${userId}`);
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
                loading, error, getPost, getAllPosts, getUserPosts,
                updatePost, deletePost, toggleLikePost
            }}>
            {children}
        </PostsContext.Provider>
    );
}