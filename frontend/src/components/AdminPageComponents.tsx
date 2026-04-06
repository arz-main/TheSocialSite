import { Search, X, AlertCircle } from "lucide-react";
import type { PostStatus } from "../types/PostTypes";
import type { Role } from "../types/RolesTypes";
import type { AdminPostsTableProps, UserOptions, AdminUsersTableProps } from "../types/AdminPageTypes";
import { demoteRole, promoteRole } from "../utils/AdminDashboardPageUtil";

// ─── SearchBar ────────────────────────────────────────
export function SearchBar({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    return (
        <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted pointer-events-none" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-background border border-border rounded-lg pl-8 pr-7 py-1.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors w-52"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-2 text-muted hover:text-text transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}

// ─── ConfirmModal ─────────────────────────────────────
export function ConfirmModal({
    message,
    onConfirm,
    onCancel,
}: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-4 h-4 text-danger" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text mb-0.5">Confirm Action</p>
                            <p className="text-sm text-muted">{message}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-1.5 text-sm rounded-lg border border-border bg-background text-text hover:bg-border/50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-1.5 text-sm rounded-lg bg-primary text-text-opposite hover:bg-primary-hover transition-colors font-medium"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── TableSkeleton ────────────────────────────────────
export function TableSkeleton({ cols }: { cols: number }) {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                    {Array.from({ length: cols }).map((__, j) => (
                        <td key={j} className="px-5 py-3.5">
                            <div
                                className="h-3 rounded-full bg-border animate-pulse"
                                style={{ width: `${55 + ((i * 3 + j * 7) % 35)}%`, opacity: 1 - i * 0.15 }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

// ─── ErrorRow ─────────────────────────────────────────
export function ErrorRow({ cols, message }: { cols: number; message: string }) {
    return (
        <tr>
            <td colSpan={cols} className="py-10">
                <div className="flex flex-col items-center gap-2 text-danger">
                    <AlertCircle className="w-5 h-5 opacity-70" />
                    <span className="text-sm">{message}</span>
                </div>
            </td>
        </tr>
    );
}

// ─── DataTable ────────────────────────────────────────
type DataTableProps = {
    headers: string[];
    children: React.ReactNode;
};

export function DataTable({ headers, children }: DataTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-background">
                        {headers.map((h) => (
                            <th
                                key={h}
                                className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted border-b border-border"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────
export function StatCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
    return (
        <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-1 min-w-32.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</span>
            <span className={`text-2xl font-bold ${accent}`}>{value}</span>
        </div>
    );
}

// ─── Section Header ───────────────────────────────────
function SectionHeader({ title, count, search, onSearch, placeholder }: {
    title: string;
    count: number;
    search: string;
    onSearch: (v: string) => void;
    placeholder: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-text">{title}</h2>
                <span className="text-[11px] font-semibold bg-border text-muted px-2 py-0.5 rounded-full">
                    {count}
                </span>
            </div>
            <SearchBar value={search} onChange={onSearch} placeholder={placeholder} />
        </div>
    );
}

const roleBadge: Record<Role, string> = {
    Admin: "bg-primary-soft text-primary border border-primary/40 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
    User: "bg-secondary-soft text-secondary border border-secondary/40 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
};

const statusBadge: Record<PostStatus, string> = {
    Published: "bg-success/10 text-success border border-success/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
    Draft: "bg-muted/10 text-muted border border-muted/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
    Flagged: "bg-danger/10 text-danger border border-danger/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
};

// ─── USERS TABLE ──────────────────────────────────────
export function UsersTable({
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
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-secondary-soft text-secondary">
                                    {user.username[0].toUpperCase()}
                                </div>
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

export function PostsTable({
    filteredData,
    loading,
    error,
    search,
    onSearch,
    confirm,
    setConfirm,
    executeConfirm,
    targetPost,
}: AdminPostsTableProps) {
    return (
        <section className="bg-card border border-border rounded-xl overflow-hidden">
            {confirm && targetPost && (
                <ConfirmModal
                    message={`Delete "${targetPost.title}"?`}
                    onConfirm={executeConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
            <SectionHeader
                title="Posts"
                count={filteredData.length}
                search={search}
                onSearch={onSearch}
                placeholder="Search posts…"
            />
            <DataTable headers={["Title", "Author", "Status", "Actions"]}>
                {loading ? (
                    <TableSkeleton cols={4} />
                ) : error ? (
                    <ErrorRow cols={4} message={error} />
                ) : filteredData.map((post) => (
                    <tr
                        key={post.id}
                        className="border-b border-border last:border-0 hover:bg-border/30 transition-colors"
                    >
                        <td className="px-5 py-3.5 text-sm font-medium text-text max-w-65 truncate">
                            {post.title}
                        </td>
                        <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-accent-soft text-accent flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {post.author.username[0].toUpperCase()}
                                </div>
                                <span className="text-sm text-muted">{post.author.username}</span>
                            </div>
                        </td>
                        <td className="px-5 py-3.5">
                            <span className={statusBadge[post.status]}>{post.status}</span>
                        </td>
                        <td className="px-5 py-3.5">
                            <button
                                onClick={() => setConfirm({ type: "delete", id: post.id })}
                                className="px-2.5 py-1 text-xs rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
                            >
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </DataTable>
        </section>
    );
}