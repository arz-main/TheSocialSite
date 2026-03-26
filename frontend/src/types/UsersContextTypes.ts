import type { User } from "./UserTypes";

export type UsersContextType = {
    loading: boolean;
    error: string | null;
    getUser: (userId: string) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
};
