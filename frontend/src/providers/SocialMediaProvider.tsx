import { createContext, useState, useCallback, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import type { SocialMediaDto, SocialMediaContextType } from "../types/SocialMediaTypes";

export const SocialMediaContext = createContext<SocialMediaContextType | undefined>(undefined);

export function SocialMediaProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const axios = useAxios()!;

    // --- Generic request handler ---
    const request = async <T,>(fn: () => Promise<T>): Promise<T | null> => {
        try {
            setLoading(true);
            setError(null);
            const result = await fn();
            return result ?? null;
        } catch (err: any) {
            setError(err.message ?? "Request failed");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // --- Get Social Media for user ---
    const getSocialMedia = useCallback((userId: string) =>
        request(async () => {
            const { data } = await axios.get<SocialMediaDto>(`/socialmedia/${userId}`);
            return data ?? null;
        }), []);

    const createSocialMedia = useCallback((payload: SocialMediaDto) =>
        request(async () => {
            const { data } = await axios.post<SocialMediaDto>("/socialmedia/create", payload);
            return data ?? null;
        }), []);

    const updateSocialMedia = useCallback((payload: SocialMediaDto) =>
        request(async () => {
            const { data } = await axios.put<SocialMediaDto>(`/socialmedia/${payload.userId}`, payload);
            return data ?? null;
        }), []);

    // --- Delete Social Media ---
    const deleteSocialMedia = useCallback((userId: string) =>
        request(async () => {
            const { data } = await axios.delete<{message: string}>(`/socialmedia/${userId}`);
            return data ?? null;
        }), []);

    return (
        <SocialMediaContext.Provider value={{
            loading,
            error,
            getSocialMedia,
            createSocialMedia,
            updateSocialMedia,
            deleteSocialMedia
        }}>
            {children}
        </SocialMediaContext.Provider>
    );
}