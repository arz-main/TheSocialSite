import { useContext } from "react";
import { AdminContext } from "../providers/AdminProvider";
import { type AdminContextType } from "../types/AdminPageTypes";

export function useAdmin(): AdminContextType {
    const context = useContext(AdminContext);
    if (!context) throw new Error("useAdmin must be used within an AdminProvider");
    return context;
}