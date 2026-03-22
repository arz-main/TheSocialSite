import { createContext, useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtTypes";
import type { User } from "../types/UserTypes";
import useAxios from "../hooks/useAxios";
import { type AuthContextType } from "../types/AuthContextTypes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | undefined>(undefined);
    const [initializing, setInitializing] = useState(true);
    const axiosInstance = useAxios()!;
    const axiosRef = useRef(axiosInstance);

    // ── pure helpers, no cross-calling ──────────────────────────
    const fetchUser = async (token: string): Promise<User> => {
        const { sub: id } = jwtDecode<JwtPayload>(token);
        const res = await axiosRef.current.get(`users/${id}`);
        console.log(res.data);
        setUser(res.data);
        return res.data; // return it so login() can use it
    };

    const clearSession = () => {
        setUser(undefined);
        localStorage.removeItem("token");
    };

    // ── public actions ───────────────────────────────────────────

    const login = async (credential: string, password: string): Promise<User> => {
        const res = await axiosRef.current.post("auth/login", {
            UserIdentifier: credential,
            Password: password,
        });
        const { token } = res.data;
        localStorage.setItem("token", token);
        const userData = await fetchUser(token);
        return userData;
    };

    const logout = () => clearSession();

    const signup = async (username: string, email: string, password: string) => {
        await axiosRef.current.post("auth/signup", {
            Username: username,
            Email: email,
            Password: password,
            ConfirmPassword: password,
        });
        // signup just creates the user — caller must call login() after
    };

    // ── rehydrate session on startup ─────────────────────────────

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setInitializing(false);
            return;
        }

        fetchUser(token)
            .catch(() => clearSession())
            .finally(() => setInitializing(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}