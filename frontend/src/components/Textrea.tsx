import { cn } from "../utils/ClassNameMergeUtil";

function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className={cn(
                "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-text placeholder:text-muted transition-colors outline-none shadow-sm",
                "hover:border-primary/50",
                "focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20",
                "disabled:pointer-events-none disabled:opacity-50",
                "resize-none",
                className
            )}
            {...props}
        />
    );
}

export { Textarea };