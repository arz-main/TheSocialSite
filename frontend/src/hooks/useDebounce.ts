import { useRef, useCallback } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const fnRef = useRef(fn);
    fnRef.current = fn; // always keep latest fn without recreating debounce

    return useCallback((...args: any[]) => {
        clearTimeout(timer.current!);
        timer.current = setTimeout(() => fnRef.current(...args), delay);
    }, [delay]) as T;
};