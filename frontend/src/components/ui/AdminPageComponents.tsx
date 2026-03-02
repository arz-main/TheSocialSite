import { useState, useMemo } from "react";
import type { AdminTableProps } from "../../types/AdminPageTypes";


export function AdminTable<T extends { id: string }>({
    data,
    columns,
    actions,
    pageSize = 5,
}: AdminTableProps<T>) {
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const sortedData = useMemo(() => {
        if (!sortField) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];

            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;

            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortAsc ? aVal - bVal : bVal - aVal;
            }

            return 0;
        });
    }, [data, sortField, sortAsc]);

        const page = 1;

    const paginatedData = useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, page, pageSize]);

    const handleSort = (field: keyof T) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    return (
        <div className="overflow-x-auto border rounded-lg">
            <table className="w-full table-fixed">
                <thead className="bg-card text-text-opaque">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.label}
                                className="px-4 py-3 text-left cursor-pointer"
                                onClick={() => col.sortable && handleSort(col.field)}
                            >
                                {col.label.toUpperCase()}
                            </th>
                        ))}
                        {actions && <th className="px-4 py-3 text-left">ACTIONS</th>}
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.map((row, i) => (
                        <tr
                            key={row.id}
                            className={`hover:bg-card/10 transition-colors ${i === paginatedData.length - 1 ? "" : "border-b"
                                }`}
                        >
                            {columns.map((col) => (
                                <td key={col.label} className="px-4 py-3 font-normal">
                                    {col.render ? col.render(row) : String(row[col.field] ?? "")}
                                </td>
                            ))}
                            {actions && <td className="px-4 py-3 font-normal">{actions(row)}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}