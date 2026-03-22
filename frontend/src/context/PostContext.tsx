import { createContext, useState, useRef, useCallback } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type Post } from "../types/PostTypes";
import { type PostContextType } from "../types/PostContextTypes";

export const PostContext = createContext<PostContextType | undefined>(undefined);

export function PostProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const axiosInstance = useAxios()!;
    const axiosRef = useRef(axiosInstance);

    const fetchAllPosts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosRef.current.get<Post[]>("/posts");
            if (typeof response.data === "string") {
                throw new Error("Got HTML instead of JSON — backend may be down");
            }
            setPosts(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserPosts = useCallback(async (userId: string | undefined) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosRef.current.get<Post[]>(`/posts/user/${userId}`);
            if (typeof response.data === "string") {
                throw new Error("Got HTML instead of JSON — backend may be down");
            }
            setUserPosts(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load user posts");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <PostContext.Provider value={{ posts, userPosts, loading, error, fetchAllPosts, fetchUserPosts }}>
            {children}
        </PostContext.Provider>
    );
}