import type { User } from "./UserTypes";

export type AuthContextType = {
    user: User | undefined;
    initializing: boolean;
    login: (credential: string, password: string) => Promise<User>;
    logout: () => void;
    signup: (username: string, email: string, password: string) => Promise<void>;
    refreshUser(): Promise<void>;
};
