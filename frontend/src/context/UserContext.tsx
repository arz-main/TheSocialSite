import { createContext, useState, useRef, useCallback } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type User } from "../types/UserTypes";
import type { UserContextType } from "../types/UserContextTypes";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const axiosInstance = useAxios()!;
    const axiosRef = useRef(axiosInstance);

    const fetchUser = useCallback(async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosRef.current.get<User>(`/users/${userId}`);
            setUser(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load user");
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}