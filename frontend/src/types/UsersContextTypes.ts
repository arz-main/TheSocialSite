import type { UpdateUserPayload, User } from "./UserTypes";

// UsersContextTypes.ts
export type UsersContextType = {
    loading: boolean;
    error: string | null;
    getUser: (userId: string) => Promise<User>;
    getAllUsers: () => Promise<User[]>;
    updateUser(userId: string, data: UpdateUserPayload): Promise<void>;
};