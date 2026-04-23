import { useContext } from "react";
import { PostsContext } from "../providers/PostsProvider";

export const usePosts = () => {
    const ctx = useContext(PostsContext);
    if (!ctx) throw new Error("usePost must be used within a PostProvider");
    return ctx;
};