import React from "react";
import type {
    AdminTableProps,
    ActionsPanelProps,
    Column,
    TableSectionPropsWithPagination,
} from "../../types/AdminPageTypes";

import { Button } from "./BasicButton";
import type { User } from "../../types/UserTypes";
import type { Post } from "../../types/PostTypes";
import { usePaginatedData } from "../../hooks/usePaginatedData";

export const userColumns: Column<User>[] = [
    { label: "Name", field: "name", sortable: true },
    { label: "Email", field: "email", sortable: true },
    { label: "Role", field: "role", sortable: true },
    { label: "Posts", field: "postsCount", sortable: true },
];

export const postColumns: Column<Post>[] = [
    { label: "ID", field: "id", sortable: true },
    { label: "Username", field: "username", sortable: true },
    { label: "Category", field: "category", sortable: true },
    { label: "Duration", field: "duration", sortable: true },
    { label: "Likes", field: "likes", sortable: true },
    { label: "Comments", field: "comments", sortable: true },
    { label: "Created At", field: "createdAt", sortable: true },
];

export const StatCard: React.FC<{ label: string; value: number | string; color: string }> = ({
    label, value, color,
}) => (
    <div className="flex flex-col gap-1 bg-surface rounded-xl border border-border px-6 py-5 flex-1 min-w-[140px]">
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
        <span className="text-sm text-text-opaque">{label}</span>
    </div>
);

export const TableSection: React.FC<TableSectionPropsWithPagination> = ({
    title,
    count,
    page,
    totalPages,
    onPageChange,
    children,
}) => (
    <section className="bg-surface border border-border rounded-xl overflow-hidden mb-8">
        {/* Top row: title + pagination */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{title}</h2>
                <span className="text-xs font-medium bg-background text-text-opaque px-2 py-0.5 rounded-full border border-border">
                    {count} total
                </span>
            </div>

            {page !== undefined && totalPages !== undefined && onPageChange && (
                <div className="flex gap-2 items-center">
                    <Button
                        variant={"primary"}
                        onClick={() => onPageChange(Math.max(page - 1, 1))}
                        disabled={page === 1}
                        className="px-3 py-1.5 text-sm disabled:opacity-40"
                    >
                        ← Prev
                    </Button>
                    <span className="text-sm text-text-opaque min-w-[72px] text-center">
                        Page {page} of {totalPages}
                    </span>
                    <Button
                        variant={"primary"}
                        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                        disabled={page >= totalPages}
                        className="px-3 py-1.5 text-sm disabled:opacity-40"
                    >
                        Next →
                    </Button>
                </div>
            )}
        </div>

        {/* Table / content */}
        <div className="p-4">{children}</div>
    </section>
);

export function AdminTable<T extends { id: string }>({
    columns,
    paginatedData,
    sortField,
    sortAsc,
    onSort,
}: AdminTableProps<T>) {
    return (
        <div className="flex-1 overflow-x-auto">
            <table className="w-full table-fixed">
                <thead className="bg-card text-text-opaque">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.label}
                                className="px-4 py-3 text-left cursor-pointer select-none"
                                onClick={() => col.sortable && onSort(col.field)}
                            >
                                <span className="flex items-center gap-1">
                                    {col.label.toUpperCase()}
                                    {col.sortable && (
                                        <span className="text-text-opaque/50 text-xs">
                                            {sortField === col.field ? (sortAsc ? "↑" : "↓") : "↕"}
                                        </span>
                                    )}
                                </span>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-8 text-center text-text-opaque">
                                No results found.
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row, i) => (
                            <tr
                                key={row.id}
                                className={`hover:bg-card/10 transition-colors ${i < paginatedData.length - 1 ? "border-b border-border" : ""
                                    }`}
                            >
                                {columns.map((col) => (
                                    <td key={col.label} className="px-4 py-3 font-normal truncate">
                                        {col.render ? col.render(row) : String(row[col.field] ?? "")}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

export function ActionsPanel<T extends { id: string }>({
    data,
    actions,
}: ActionsPanelProps<T>) {
    if (data.length === 0) return null;

    return (
        <div className="flex flex-col border-l border-border pl-4 min-w-[160px]">
            <div className="py-3 text-sm font-medium text-text-opaque">
                ACTIONS
            </div>
            {data.map((row, i) => (
                <div
                    key={row.id}
                    className={`flex items-center py-3 ${i < data.length - 1 ? "border-b border-border" : ""
                        }`}
                >
                    {actions(row)}
                </div>
            ))}
        </div>
    );
}

export const UsersTable: React.FC<{ data: User[] }> = ({ data }) => {
    const {
        paginatedData,
        sortField,
        sortAsc,
        handleSort,
        page,
        totalPages,
        setPage,
    } = usePaginatedData(data);

    return (
        <div className="flex gap-4">
            <AdminTable<User>
                columns={userColumns}
                data={data}                 // full dataset
                paginatedData={paginatedData} // paginated slice
                sortField={sortField}
                sortAsc={sortAsc}
                onSort={handleSort}         // must match AdminTableProps
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}      // must match AdminTableProps
            />
        </div>
    );
};

export const PostsTable: React.FC<{ data: Post[] }> = ({ data }) => {
    const {
        paginatedData,
        sortField,
        sortAsc,
        handleSort,
        page,
        totalPages,
        setPage,
    } = usePaginatedData(data);

    return (
        <div className="flex gap-4">
            <AdminTable<Post>
                columns={postColumns}
                data={data}
                paginatedData={paginatedData}
                sortField={sortField}
                sortAsc={sortAsc}
                onSort={handleSort}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
};