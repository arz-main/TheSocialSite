import type { Role } from "../types/RolesTypes";
import { useMemo } from "react";

export const roleOrder: Role[] = ["User", "Admin"];

export function promoteRole(role: Role): Role {
    const idx = roleOrder.indexOf(role);
    return idx < roleOrder.length - 1 ? roleOrder[idx + 1] : role;
}

export function demoteRole(role: Role): Role {
    const idx = roleOrder.indexOf(role);
    return idx > 0 ? roleOrder[idx - 1] : role;
}

export function useFilteredData<T>(
    data: T[],
    search: string,
    keys: (keyof T)[]
) {
    return useMemo(() => {
        return data.filter(item =>
            keys.some(key =>
                String(item[key]).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [data, search, keys]);
}