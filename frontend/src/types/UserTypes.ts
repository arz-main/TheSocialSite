// UserTypes.ts
import type { Role } from "../types/RolesTypes";

export type UsersContextType = {
    loading: boolean;
    error: string | null;
    getUser: (userId: string) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
    updateUser: (userId: string, data: UpdateUserPayload) => Promise<UpdateUserPayload>;
    deleteUser: (userId: string) => Promise<void>;
};

export type UpdateUserPayload = {
    email?: string;
    username?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: SocialLinks;
};

export type User = {
    id: string;
    email: string;
    username: string;
    role: Role;
    avatar: string;
    bio: string;
    location: string;
    website: string;
    socialLinks: SocialLinks;
    followers?: string[];
    following?: string[];
    postsCount: number;
    joinedDate: string;
};

export type SocialLinks = {
    twitter?: string;
    pinterest?: string;
    deviantArt?: string;  // was deviantart
    youTube?: string;  // was youtube
    discord?: string;
};

export type EditProfileForm = {
    username: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    avatar: string;
    socialMedia: SocialLinks;
};

export const defaultEditProfileForm: EditProfileForm = {
    email: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    avatar: "",
    socialMedia: {
        twitter: "",
        pinterest: "",
        deviantArt: "",
        youTube: "",
        discord: "",
    },
};