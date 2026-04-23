import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/ClassNameMergeUtil";

const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 aria-invalid:ring-danger/20 aria-invalid:border-danger transition-all duration-200 overflow-hidden tracking-wider",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-text-opposite shadow-[0_2px_12px_color-mix(in_srgb,var(--primary)_40%,transparent)] hover:shadow-[0_4px_18px_color-mix(in_srgb,var(--primary)_55%,transparent)] hover:scale-105",
                secondary:
                    "border-border bg-card text-text-opaque shadow-sm hover:border-primary/40 hover:shadow-[0_2px_10px_color-mix(in_srgb,var(--primary)_15%,transparent)]",
                danger:
                    "border-transparent bg-danger text-text-opposite shadow-[0_2px_12px_color-mix(in_srgb,var(--danger)_40%,transparent)] hover:shadow-[0_4px_18px_color-mix(in_srgb,var(--danger)_55%,transparent)] hover:scale-105",
                outline:
                    "border-primary/60 bg-primary-soft/30 text-primary hover:bg-primary-soft/60 hover:border-primary hover:shadow-[0_2px_10px_color-mix(in_srgb,var(--primary)_20%,transparent)]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

function Badge({
    className,
    variant,
    asChild = false,
    ...props
}: React.ComponentProps<"span"> &
    VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
    const Comp = asChild ? Slot : "span";
    return (
        <Comp
            data-slot="badge"
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    );
}

export { Badge, badgeVariants };