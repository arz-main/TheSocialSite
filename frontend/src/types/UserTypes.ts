// UserTypes.ts
import type { Role } from "../types/RolesTypes";

export type UsersContextType = {
    loading: boolean;
    error: string | null;
    getUser: (userId: string) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
    updateUser: (userId: string, data: UpdateUserDto) => Promise<UpdateUserDto>;
    deleteUser: (userId: string) => Promise<void>;
    createUser: (userData: CreateUserDto) => Promise<void>;
};

export type UpdateUserDto = {
    email?: string;
    username?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: SocialLinks;
    role?: Role;
};

export interface CreateUserDto {
    username: string,
    email: string,
    password: string
    confirmPassword: string;
};

export type User = {
    id: string;
    email: string;
    username: string;
    role: Role;
    avatarUrl: string;
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