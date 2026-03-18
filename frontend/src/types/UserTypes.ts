export type Role = "user" | "admin";
export interface User {
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
}