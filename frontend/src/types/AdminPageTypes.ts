import type { ReactNode } from "react";
import type { SocialLinks, User } from "./UserTypes";
import type { Role } from "./RolesTypes";
import type { Post } from "./PostTypes";

export type AdminUpdateUserPayload = {
    email?: string;
    username?: string;
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
    socialLinks?: SocialLinks;
    role?: Role;
}

export type AdminContextType = {
    loading: boolean;
    error: string | null;
    adminUpdateUser: (userId: string, data: AdminUpdateUserPayload) => Promise<AdminUpdateUserPayload>;
    adminDeleteUser: (userId: string) => Promise<void>;
    adminDeletePost: (postId: string) => Promise<void>;
};

export type PostConfirm = { type: "delete"; id: string } | null;
export type UserConfirm = { type: "delete" | "promote" | "demote"; id: string } | null;
export type UserOptions = "delete" | "promote" | "demote";
export type PostOptions = "delete";

export interface AdminUsersTableProps {
    filteredData: User[];
    loading: boolean;
    error: string | null;
    search: string;
    onSearch: (val: string) => void;
    confirm: UserConfirm | null;
    setConfirm: (val: UserConfirm | null) => void;
    executeConfirm: () => Promise<void>;
    targetUser: User | null;
}

export interface AdminPostsTableProps {
    filteredData: Post[];
    loading: boolean;
    error: string | null;
    search: string;
    onSearch: (val: string) => void;
    confirm: PostConfirm | null;
    setConfirm: (id: PostConfirm | null) => void;
    executeConfirm: () => Promise<void>;
    targetPost: Post | null;
}

export interface Column<T> {
    label: string;
    field: keyof T;
    sortable?: boolean;
    render?: (row: T) => ReactNode;
}

export interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    // pagination/sort passed in from outside
    paginatedData: T[];
    sortField: keyof T | null;
    sortAsc: boolean;
    onSort: (field: keyof T) => void;
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export interface ActionsPanelProps<T extends { id: string }> {
    data: T[];
    actions: (row: T) => ReactNode;
}

export interface TableSectionProps {
    title: string;
    count: number;
    children: ReactNode;
    actionToolbar?: React.ReactNode;
}

export interface TableSectionPropsWithPagination extends TableSectionProps {
    page?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

// Small helper: a toggle-style action button that shows its active state
export interface ActionToggleButtonProps {
    label: string;
    variant: "danger" | "warning";
    active: boolean;
    onClick: () => void;
}