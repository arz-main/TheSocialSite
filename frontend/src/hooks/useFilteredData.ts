import { useMemo } from "react";

export function useFilteredData<T>(
    data: T[],
    search: string,
    keys: (keyof T)[]
) {
    return useMemo(() => {
        return data.filter(item =>
            keys.some(key =>
                String(item[key]).toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [data, search, keys]);
}