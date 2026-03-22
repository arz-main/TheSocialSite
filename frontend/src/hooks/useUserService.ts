import { useAxios } from "./useAxios";

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

export type LoginPayload = {
    userIdentifier: string;
    password: string;
};

export type SignupPayload = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

export type LoginResponse = {
    userIdentifier: string;
    isValid: boolean;
    message: string;
    token: string;
};

export function useUserService() {
    const axios = useAxios();

    async function login(data: LoginPayload): Promise<LoginResponse> {
        const res = await axios.post<LoginResponse>("/auth/login", data);
        return res.data;
    }

    async function signup(data: SignupPayload): Promise<void> {
        await axios.post("/auth/signup", data);
    }

    async function getProfile(): Promise<ProfileData> {
        const res = await axios.get<ProfileData>("/users/profile");
        return res.data;
    }

    async function updateProfile(data: UpdateProfilePayload): Promise<void> {
        await axios.put("/users/profile", data);
    }

    return { login, signup, getProfile, updateProfile };
}