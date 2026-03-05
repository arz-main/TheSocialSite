import { useState, useMemo } from "react";

export function usePaginatedData<T>(data: T[], pageSize: number = 5) {
    const [page, setPage] = useState(1);
    const [sortField, setSortField] = useState<keyof T | null>(null);
    const [sortAsc, setSortAsc] = useState(true);

    const sortedData = useMemo(() => {
        if (!sortField) return data;
        return [...data].sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            if (aVal === undefined) return 1;
            if (bVal === undefined) return -1;
            if (typeof aVal === "string" && typeof bVal === "string")
                return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            if (typeof aVal === "number" && typeof bVal === "number")
                return sortAsc ? aVal - bVal : bVal - aVal;
            return 0;
        });
    }, [data, sortField, sortAsc]);

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const safePage = Math.min(page, totalPages);

    const paginatedData = useMemo(() => {
        const start = (safePage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, safePage, pageSize]);

    const handleSort = (field: keyof T) => {
        if (sortField === field) setSortAsc(p => !p);
        else { setSortField(field); setSortAsc(true); }
        setPage(1);
    };

    return {
        paginatedData,
        sortField,
        sortAsc,
        handleSort,
        page: safePage,
        totalPages,
        setPage,
    };
}