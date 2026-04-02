import type { Role } from "../types/RolesTypes";
const roleOrder: Role[] = ["User", "Admin"];

export function promoteRole(role: Role): Role {
    const idx = roleOrder.indexOf(role);
    return idx < roleOrder.length - 1 ? roleOrder[idx + 1] : role;
}

export function demoteRole(role: Role): Role {
    const idx = roleOrder.indexOf(role);
    return idx > 0 ? roleOrder[idx - 1] : role;
}
