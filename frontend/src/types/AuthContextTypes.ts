import type { CreateUserDto, User } from "./UserTypes";

export type AuthContextType = {
    currentUser: User | undefined;
    initializing: boolean;
    login: (credential: string, password: string) => Promise<User>;
    logout: () => void;
    signup: (userData: CreateUserDto) => Promise<void>;
    refreshToken(): Promise<void>;
    reloadCurrentUser(): Promise<void>;
};
