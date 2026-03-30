import { type Post } from "./PostTypes";

export type PostContextType = {
    loading: boolean;
    error: string | null;
    getAllPosts: () => Promise<Post[] | null >;
    getUserPosts: (userId: string | undefined ) => Promise<Post[] | null>;
};