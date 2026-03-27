import { createContext, useState, useCallback } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type Post } from "../types/PostTypes";
import { type PostContextType } from "../types/PostContextTypes";

export const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const axios = useAxios()!;

    const request = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
        try {
            setLoading(true);
            setError(null);
            return await fn();
        } catch {
            setError("Failed to load posts");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const getAllPosts = useCallback(() =>
        request(async () => {
            const { data } = await axios.get<Post[]>("/posts");
            return data;
        }), []);

    const getUserPosts = useCallback((userId: string | undefined) =>
        request(async () => {
            const { data } = await axios.get<Post[]>(`/posts/user/${userId}`);
            return data;
        }), []);

    return (
        <PostContext.Provider value={{ loading, error, getAllPosts, getUserPosts }}>
            {children}
        </PostContext.Provider>
    );
}