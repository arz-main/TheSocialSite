import type { Role } from "./RoleTypes";

export interface SocialLinks {
    pinterest?: string;
    x?: string;
    deviantart?: string;
    youtube?: string;
    discord?: string;
}

export interface User {
    id: string;
    email: string;
    password: string;
    name: string;
    role: Role;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: SocialLinks;
    followers: string[]; // Array of user IDs
    following: string[]; // Array of user IDs
    postsCount: number;
    joinedDate: string;
}