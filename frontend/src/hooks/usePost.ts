import { useContext } from "react";
import { PostContext } from "../context/PostContext";

export const usePost = () => {
    const ctx = useContext(PostContext);
    if (!ctx) throw new Error("usePost must be used within a PostProvider");
    return ctx;
};