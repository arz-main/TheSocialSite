import { type Post } from "./PostTypes";

export type PostContextType = {
    posts: Post[];
    userPosts: Post[];
    loading: boolean;
    error: string | null;
    fetchAllPosts: () => Promise<void>;
    fetchUserPosts: (userId: string | undefined) => Promise<void>;
};