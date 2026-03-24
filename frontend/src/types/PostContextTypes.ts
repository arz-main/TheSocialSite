import { type Post } from "./PostTypes";

export type PostContextType = {
    loading: boolean;
    error: string | null;
    fetchAllPosts: () => Promise<Post[] | null >;
    fetchUserPosts: (userId: string | undefined ) => Promise<Post[] | null>;
};