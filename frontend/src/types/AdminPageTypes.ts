import type { ReactNode } from "react";
import type { User } from "./UserTypes";
import type { Post } from "./PostTypes";
import type { BadgeTemplate } from "./BadgeTypes";

export type PostConfirm = { type: "delete"; id: string } | null;
export type UserConfirm = { type: "delete" | "promote" | "demote"; id: string } | null;
export type BadgeTemplateConfirm = { type: "delete"; id: string } | null;
export type UserOptions = "delete" | "promote" | "demote";
export type PostOptions = "delete";
export type BadgeTemplateOptions = "delete";
export type Options = "delete";

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

export interface AdminBadgeTemplatesTableProps {
    filteredData: BadgeTemplate[];
    loading: boolean;
    error: string | null;
    search: string;
    onSearch: (val: string) => void;
    confirm: BadgeTemplateConfirm | null;
    setConfirm: (id: BadgeTemplateConfirm | null) => void;
    executeConfirm: () => Promise<void>;
    targetTemplateBadge: BadgeTemplate | null;
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