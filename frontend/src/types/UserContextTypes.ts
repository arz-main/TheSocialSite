import type { User } from "./UserTypes";

export type UserContextType = {
    user: User | undefined;
    loading: boolean;
    error: string | null;
    fetchUser: (userId: string) => Promise<void>;
};
