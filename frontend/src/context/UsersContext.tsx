import { createContext, useCallback, useRef, useState } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type User } from "../types/UserTypes";
import type { UsersContextType } from "../types/UsersContextTypes";
import type { UpdateUserPayload } from "../types/UserTypes";

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, User>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function updateUser(userId: string, data: UpdateUserPayload): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.put(`/users/${userId}`, data);
        } catch (err) {
            setError("Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    // ─── User Fetching ─────────────────────────────────────────────────────

    const getUser = useCallback(async (userId: string): Promise<User> => {
        if (cache.current.has(userId)) return cache.current.get(userId)!;
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<User>(`/users/${userId}`);
            cache.current.set(userId, data);
            return data;
        } catch (err) {
            setError("Failed to load user");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllUsers = useCallback(async (): Promise<User[]> => {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<User[]>("/users");
            data.forEach(user => cache.current.set(user.id, user));
            return data;
        } catch (err) {
            setError("Failed to load users");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <UsersContext.Provider value={{ getUser, getAllUsers, updateUser, loading, error, }}>
            {children}
        </UsersContext.Provider>
    );
}