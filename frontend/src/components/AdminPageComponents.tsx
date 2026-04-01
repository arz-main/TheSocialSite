import React from "react";
import { Search, X, AlertCircle } from "lucide-react";

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

// ─── StatCards ────────────────────────────────────────
export function StatCards({ stats }: { stats: { label: string; value: number }[] }) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-1 hover:border-primary transition-colors group"
                >
                    <div className="text-2xl font-bold text-text group-hover:text-primary transition-colors">
                        {s.value}
                    </div>
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-muted">
                        {s.label}
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── GenericTable ─────────────────────────────────────
interface Column<T> {
    header: string;
    render: (item: T) => React.ReactNode;
}

interface GenericTableProps<T> {
    data: T[];
    columns: Column<T>[];
    loading?: boolean;
    error?: string | null;
    emptyMessage?: string;
}

export function GenericTable<T>({
    data,
    columns,
    loading,
    error,
    emptyMessage = "No data found",
}: GenericTableProps<T>) {
    const isEmpty = !loading && !error && data.length === 0;

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-background">
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-muted border-b border-border"
                            >
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <TableSkeleton cols={columns.length} />
                    ) : error ? (
                        <ErrorRow cols={columns.length} message={error} />
                    ) : isEmpty ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-10 text-muted text-sm">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((item, idx) => (
                            <tr
                                key={idx}
                                className="border-b border-border last:border-0 hover:bg-border/30 transition-colors"
                            >
                                {columns.map((col, i) => (
                                    <td key={i} className="px-5 py-3.5">
                                        {col.render(item)}
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