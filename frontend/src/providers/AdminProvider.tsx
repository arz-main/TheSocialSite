import { createContext, useRef, useState } from "react";
import { type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import { type User } from "../types/UserTypes";
import type { AdminContextType, AdminUpdateUserPayload } from "../types/AdminPageTypes";

export const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;
    const cache = useRef<Map<string, User>>(new Map());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    async function adminUpdateUser(userId: string, data: AdminUpdateUserPayload): Promise<AdminUpdateUserPayload> {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.put(`/admin/${userId}`, data);
            cache.current.delete(userId); // force new fetch next time
            return response.data;
        } catch (err) {
            setError("Failed to update profile");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    async function adminDeleteUser(userId: string): Promise<void> {
        try {
            setLoading(true);
            setError(null);
            await axios.delete(`/admin/${userId}`);
            cache.current.delete(userId); // clear from cache
        } catch (err) {
            setError("Failed to delete account");
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return (
        <AdminContext.Provider value={{ adminUpdateUser, adminDeleteUser, loading, error }}>
            {children}
        </AdminContext.Provider>
    );
}