import type { User } from "./UserTypes";

// ─── Types ─────────────────────────────────────────────────────────────────

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

export type UpdateProfilePayload = {
    username?: string;
    email?: string;
    location?: string;
    website?: string;
    bio?: string;
    avatar?: string;
    socialLinks?: SocialLinks;
};


// UsersContextTypes.ts
export type UsersContextType = {
    loading: boolean;
    error: string | null;
    getUser: (userId: string) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
    updateProfile(userId: string, data: UpdateProfilePayload): Promise<void>;
};