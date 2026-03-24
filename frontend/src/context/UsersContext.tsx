import { createContext, useCallback, useRef, useState } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type User } from "../types/UserTypes";
import type { UsersContextType } from "../types/UsersContextTypes";

export const UsersContext = createContext<UsersContextType | undefined>(undefined);

export function UsersProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, User>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getUser = useCallback(async (userId: string): Promise<User> => {
        if (cache.current.has(userId)) return cache.current.get(userId)!;
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<User>(`/users/${userId}`);
            cache.current.set(userId, data);
            return data;
        } catch {
            setError("Failed to load user");
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <UsersContext.Provider value={{ loading, error, getUser }}>
            {children}
        </UsersContext.Provider>
    );
}