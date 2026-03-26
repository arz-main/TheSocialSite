import { createContext, useEffect, useState } from "react";
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
    const axios = useAxios()!;

    const fetchUser = async (token: string): Promise<User> => {
        const { sub: id } = jwtDecode<JwtPayload>(token);
        const { data } = await axios.get(`users/${id}`);
        setUser(data);
        return data;
    };

    const clearSession = () => {
        setUser(undefined);
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
        if (!token) return setInitializing(false);
        fetchUser(token).catch(clearSession).finally(() => setInitializing(false));
    }, []);

    return (
        <AuthContext.Provider value={{ user, initializing, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}