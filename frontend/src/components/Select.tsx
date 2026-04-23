import { cn } from "../utils/ClassNameMergeUtil";

function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={cn(
                "h-9 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text transition-colors outline-none shadow-sm",
                "hover:border-primary/50",
                "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
                "disabled:pointer-events-none disabled:opacity-50",
                className
            )}
            {...props}
        />
    );
}

export { Select };