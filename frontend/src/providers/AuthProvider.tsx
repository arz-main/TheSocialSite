import { createContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtTypes";
import type { User } from "../types/UserTypes";
import useAxios from "../hooks/useAxios";
import { type AuthContextType } from "../types/AuthContextTypes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);
    const [initializing, setInitializing] = useState(true);
    const axios = useAxios()!;

    // this function prevents the offline misuse of jwt tokens
    // because it enforces that a request is be made to the backend
    const fetchUser = async (token: string): Promise<User> => {
        const { sub: id } = jwtDecode<JwtPayload>(token);
        const { data } = await axios.get(`users/${id}`);
        setCurrentUser(data);
        return data;
    };

    const clearSession = () => {
        setCurrentUser(undefined);
        localStorage.removeItem("token");
    };

    const login = async (credential: string, password: string): Promise<User> => {
        const { data } = await axios.post("auth/login", {
            UserIdentifier: credential,
            Password: password,
        });
        localStorage.setItem("token", data.token);
        return fetchUser(data.token);
    };

    const logout = () => clearSession();

    const signup = async (username: string, email: string, password: string) => {
        await axios.post("auth/signup", {
            Username: username,
            Email: email,
            Password: password,
            ConfirmPassword: password,
        });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setInitializing(false);
            return;
        }
        fetchUser(token).catch(clearSession).finally(() => setInitializing(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Fixed refreshToken
    const refreshToken = async () => {
        if (!currentUser) return;
        try {
            const { data } = await axios.post("/auth/refresh-token", { userId: currentUser.id });
            localStorage.setItem("token", data.token);
            await fetchUser(data.token);
        } catch (err) {
            console.error("Failed to refresh token", err);
            clearSession();
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, initializing, refreshToken, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}