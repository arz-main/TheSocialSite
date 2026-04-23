import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtActionResponse, JwtPayload } from "../types/JwtTypes";
import type { CreateUserDto, User } from "../types/UserTypes";
import useAxios from "../hooks/useAxios";
import { type AuthContextType } from "../types/AuthContextTypes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [initializing, setInitializing] = useState(true);
    const axios = useAxios()!;

    // this function prevents the offline misuse of jwt tokens
    const fetchUser = async (token: string): Promise<User> => {
        const { sub: id } = jwtDecode<JwtPayload>(token);
        const { data } = await axios.get(`users/${id}`);
        setCurrentUser(data);
        return data;
    };

    const logout = () => {
        setCurrentUser(undefined);
        localStorage.removeItem("token");
    };

    const login = async (credential: string, password: string): Promise<User> => {
        const { data } = await axios.post<JwtActionResponse>("auth/login", {
            UserIdentifier: credential,
            Password: password,
        });
        localStorage.setItem("token", data.token);
        return fetchUser(data.token);
    };

    const signup = async (userData: CreateUserDto) => {
        await axios.post("auth/signup", userData);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setInitializing(false);
            return;
        }
        fetchUser(token)
            .catch(logout)
            .finally(() => setInitializing(false));
    }, []);

    // Fixed refreshToken
    const refreshToken = async () => {
        if (!currentUser) return;
        try {
            const { data } = await axios.post<JwtActionResponse>(`/auth/refresh-token/${currentUser.id}`);
            localStorage.setItem("token", data.token);
            await fetchUser(data.token);
        } catch (err) {
            console.error("Failed to refresh token", err);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, initializing, refreshToken, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}