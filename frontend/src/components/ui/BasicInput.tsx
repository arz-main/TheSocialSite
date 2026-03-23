import * as React from "react";
import { cn } from "../../utils/ClassNameMergeUtil";

function Input({ className, ...props }: React.ComponentProps<"input">) {
    return (
        <input
            data-slot="input"
            className={cn(
                "h-9 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-text placeholder:text-text-opaque transition-colors outline-none",
                "hover:border-primary",
                "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
                "disabled:pointer-events-none disabled:opacity-50",
                "aria-invalid:border-danger aria-invalid:ring-danger/20",
                className
            )}
            {...props}
        />
    );
}

export { Input };