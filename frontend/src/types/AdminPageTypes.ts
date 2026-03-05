import type { ReactNode } from "react";

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