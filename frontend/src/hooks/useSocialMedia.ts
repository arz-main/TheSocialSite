import { useContext } from "react";
import { SocialMediaContext } from "../providers/SocialMediaProvider";

export const useSocialMedia = () => {
    const ctx = useContext(SocialMediaContext);
    if (!ctx) throw new Error("useSocialMedia must be used within a SocialMediaProvider");
    return ctx;
};