import { useEffect, useState } from "react";
import type { AdminUsersTableProps, UserConfirm, UserOptions } from "../../types/AdminPageTypes";
import { demoteRole, promoteRole, useFilteredData } from "../../utils/AdminDashboardPageUtil";
import { SectionHeader } from "./shared/SectionHeader";
import { ConfirmModal } from "./shared/ConfirmModal";
import { DataTable } from "./shared/DataTable";
import { ErrorRow } from "./shared/ErrorRow";
import { TableSkeleton } from "./shared/TableSkeleton";
import { useUsers } from "../../hooks/useUsers";
import { useAuth } from "../../hooks/useAuth";
import type { User } from "../../types/UserTypes";
import type { Role } from "../../types/RolesTypes";

const roleBadge: Record<Role, string> = {
    Admin: "bg-primary-soft text-primary border border-primary/40 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
    User: "bg-secondary-soft text-secondary border border-secondary/40 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
};

// ─── USERS SECTION ─────────────────────────────────────────────
export function UsersSection() {
    const [users, setUsers] = useState<User[]>([]);
    const [userSearch, setUserSearch] = useState("");
    const [userConfirm, setUserConfirm] = useState<UserConfirm>(null);

    const { getAllUsers, updateUser, deleteUser, loading, error } = useUsers();
    const { currentUser, refreshToken } = useAuth();

    useEffect(() => {
        const fetch = async () => {
            const data = await getAllUsers();
            setUsers(data || []);
        };
        fetch();
    }, [getAllUsers]);

    const handleDeleteUser = async () => {
        if (!userConfirm) return;
        await deleteUser(userConfirm.id);
        setUsers(prev => prev.filter(u => u.id !== userConfirm.id));
        setUserConfirm(null);
    };

    const handlePromoteUser = async () => {
        if (!userConfirm) return;
        const target = users.find(u => u.id === userConfirm.id);
        if (!target) return;
        const newRole = promoteRole(target.role);
        await updateUser(userConfirm.id, { role: newRole });
        setUsers(prev => prev.map(u => u.id === userConfirm.id ? { ...u, role: newRole } : u));
        if (currentUser?.id === target.id) await refreshToken();
        setUserConfirm(null);
    };

    const handleDemoteUser = async () => {
        if (!userConfirm) return;
        const target = users.find(u => u.id === userConfirm.id);
        if (!target) return;
        const newRole = demoteRole(target.role);
        await updateUser(userConfirm.id, { role: newRole });
        setUsers(prev => prev.map(u => u.id === userConfirm.id ? { ...u, role: newRole } : u));
        if (currentUser?.id === target.id) await refreshToken();
        setUserConfirm(null);
    };

    const handleUserOption = async () => {
        if (!userConfirm) return;
        if (userConfirm.type === "delete") await handleDeleteUser();
        else if (userConfirm.type === "promote") await handlePromoteUser();
        else await handleDemoteUser();
    };

    const filteredUsers = useFilteredData(users, userSearch, ["username", "email", "role"]);
    const targetUser = userConfirm ? (users.find(u => u.id === userConfirm.id) ?? null) : null;

    return (
        <UsersTable
            filteredData={filteredUsers}
            loading={loading}
            error={error}
            search={userSearch}
            onSearch={setUserSearch}
            confirm={userConfirm}
            setConfirm={setUserConfirm}
            executeConfirm={handleUserOption}
            targetUser={targetUser}
        />
    );
}


function UsersTable({
    filteredData,
    loading,
    error,
    search,
    onSearch,
    confirm,
    setConfirm,
    executeConfirm,
    targetUser
}: AdminUsersTableProps) {
    const modalMessages: Record<UserOptions, string> = {
        delete: `Delete "${targetUser?.username}"?`,
        promote: `Promote "${targetUser?.username}" to ${targetUser ? promoteRole(targetUser.role) : ""}?`,
        demote: `Demote "${targetUser?.username}" to ${targetUser ? demoteRole(targetUser.role) : ""}?`,
    };
    return (
        <section className="bg-card border border-border rounded-xl overflow-hidden">
            {confirm && targetUser && (
                <ConfirmModal
                    message={modalMessages[confirm.type]}
                    onConfirm={executeConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
            <SectionHeader
                title="Users"
                count={filteredData.length}
                search={search}
                onSearch={onSearch}
                placeholder="Search users…"
            />
            <DataTable headers={["User", "Email", "Role", "Actions"]}>
                {loading ? (
                    <TableSkeleton cols={4} />
                ) : error ? (
                    <ErrorRow cols={4} message={error} />
                ) : filteredData.map((user) => (
                    <tr
                        key={user.id}
                        className="border-b border-border last:border-0 hover:bg-border/30 transition-colors group"
                    >
                        <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-7 h-7 rounded-full object-cover shrink-0"
                                    />
                                ) : (
                                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-secondary-soft text-secondary">
                                        {user.username[0].toUpperCase()}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-text">{user.username}</span>
                            </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-muted">{user.email}</td>
                        <td className="px-5 py-3.5">
                            <span className={roleBadge[user.role]}>{user.role}</span>
                        </td>
                        <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setConfirm({ type: "promote", id: user.id })}
                                    disabled={user.role === "Admin"}
                                    className="px-2.5 py-1 text-xs rounded-lg bg-secondary-soft text-secondary border border-secondary/30 hover:bg-secondary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Promote
                                </button>
                                <button
                                    onClick={() => setConfirm({ type: "demote", id: user.id })}
                                    disabled={user.role === "User"}
                                    className="px-2.5 py-1 text-xs rounded-lg bg-secondary-soft text-secondary border border-secondary/30 hover:bg-secondary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    Demote
                                </button>
                                <button
                                    onClick={() => setConfirm({ type: "delete", id: user.id })}
                                    className="px-2.5 py-1 text-xs rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </DataTable>
        </section>
    );
}