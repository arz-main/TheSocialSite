import { cn } from "../utils/ClassNameMergeUtil";

function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
    return (
        <label
            className={cn(
                "text-xs font-semibold uppercase tracking-widest text-muted",
                className
            )}
            {...props}
        />
    );
}

export { Label };