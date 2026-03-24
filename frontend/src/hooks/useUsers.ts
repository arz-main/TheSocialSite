import { useContext } from "react";
import { UsersContext } from "../context/UsersContext";

export const useUsers = () => {
    const ctx = useContext(UsersContext);
    if (!ctx) throw new Error("useUser must be used within a UserProvider");
    return ctx;
};