import type { Role } from "../types/RolesTypes";

export type User = {
    id: string;
    email: string;
    username: string;
    role: Role;
    avatar: string;
    bio: string;
    location: string;
    website: string;

    socialLinks: {
        pinterest?: string;
        x?: string;
        deviantart?: string;
        youtube?: string;
        discord?: string;
    };

    followers?: string[];
    following?: string[];
    postsCount: number;
    joinedDate: string;
};


export type SocialLinks = {
    pinterest?: string;
    twitter?: string;
    deviantArt?: string;
    youTube?: string;
    discord?: string;
};

export type ProfileData = {
    id: string;
    username: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    location: string | null;
    website: string | null;
    postsCount: number;
    joinedDate: string;
    socialLinks: SocialLinks | null;
};

export type UpdateUserPayload = {
    username?: string;
    email?: string;
    location?: string;
    website?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: SocialLinks;
};

