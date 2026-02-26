import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react"

type User = {
	name: string;
	role: string;
} | null;

type AuthContextType = {
	user: User;
	login: (username: string, role: string) => void;
	logout: () => void;
};

type AuthProviderProps = {
	children: ReactNode;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem("user") as string) || null
	);

	const login = (username: string, role: string) => {
		const newUser = { username, role };
		setUser(newUser);
		localStorage.setItem("user", JSON.stringify(newUser));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("user");
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth(): AuthContextType {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
