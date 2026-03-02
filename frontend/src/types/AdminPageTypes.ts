import type { Post } from "./PostTypes";
import type { User } from "./UserTypes"; // make sure you import your User type

export interface Column<T> {
    label: string;
    field: keyof T;
    sortable?: boolean;
    render?: (row: T) => React.ReactNode; // optional custom cell renderer
}


// Users
export const userColumns: Column<User>[] = [
    { label: "Name", field: "name" },
    { label: "Email", field: "email" },
    { label: "Role", field: "role" },
    { label: "Posts", field: "postsCount" },
];

// Posts
export const postColumns: Column<Post>[] = [
    { label: "ID", field: "id" },
    { label: "Username", field: "username" },
    { label: "Category", field: "category" },
    { label: "Duration", field: "duration" },
    { label: "Likes", field: "likes" },
    { label: "Comments", field: "comments" },
    { label: "Created At", field: "createdAt" },
];

export interface AdminTableProps<T> {
    data: T[];
    columns: Column<T>[];
    actions?: (row: T) => React.ReactNode;
    pageSize?: number;

    // Add these for sortable tables
    sortField?: keyof T;
    sortAsc?: boolean;
    onSort?: (field: keyof T) => void;
}