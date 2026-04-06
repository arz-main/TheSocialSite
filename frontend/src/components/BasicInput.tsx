import * as React from "react";
import { cn } from "../utils/ClassNameMergeUtil";

function Input({ className, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            data-slot="input"
            className={cn(
                "h-9 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text placeholder:text-muted transition-colors outline-none shadow-sm",
                "hover:border-primary/50 hover:bg-card",
                "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20 focus-visible:bg-card",
                "disabled:pointer-events-none disabled:opacity-50",
                "aria-invalid:border-danger aria-invalid:ring-danger/20",
                className
            )}
            {...props}
        />
    );
}

export { Input };