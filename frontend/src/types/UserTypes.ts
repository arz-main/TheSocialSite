// UserTypes.ts
import type { Role } from "../types/RolesTypes";

export type UsersContextType = {
    loading: boolean;
    error: string | null;
    getUser: (userId: string) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
    updateUser: (userId: string, data: UpdateUserPayload) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
};

export type UpdateUserPayload = Omit<EditProfileForm, "socialMedia">;

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
// UserTypes.ts
export type SocialLinks = {
    twitter?: string;
    pinterest?: string;
    deviantArt?: string;  // was deviantart
    youTube?: string;  // was youtube
    discord?: string;
};

export interface EditProfileForm {
    username: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    avatar: string | null;
    socialMedia: SocialLinks;
}

export const defaultEditProfileForm: EditProfileForm = {
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    avatar: null,
    socialMedia: {
        twitter: "",
        pinterest: "",
        deviantArt: "",
        youTube: "",
        discord: "",
    },
};