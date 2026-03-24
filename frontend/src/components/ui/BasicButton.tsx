import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/ClassNameMergeUtil";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-danger/20 aria-invalid:border-danger",
	{
		variants: {
			variant: {
				default:
					"bg-button text-text-opposite hover:bg-primary hover:text-text-opposite",
				primary:
					"bg-button hover:bg-button-hover text-text-opposite border-2 border-background-opposite rounded-lg px-8 py-2.5",
				danger:
					"px-3 py-1.5 border-2 border-border hover:border-danger hover:text-danger text-text-opaque rounded-lg transition-colors data-[active=true]:border-danger data-[active=true]:bg-danger/15 data-[active=true]:text-danger",
				warning:
					"px-3 py-1.5 border-2 border-border hover:border-warning hover:text-warning text-text-opaque rounded-lg transition-colors data-[active=true]:border-warning data-[active=true]:bg-warning/15 data-[active=true]:text-warning",
				outline:
					"border border-border bg-background text-text hover:bg-primary/10 hover:text-primary hover:border-primary",
				secondary:
					"bg-secondary text-text-opposite hover:bg-secondary-hover",
				ghost:
					"hover:bg-primary-soft hover:text-text",
				link:
					"text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-9 px-4 py-2 has-[>svg]:px-3",
				sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
				lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
				xl: "h-12 rounded-md px-8 has-[>svg]:px-6",
				icon: "size-9 rounded-md",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

function Button({
	className,
	variant,
	size,
	asChild = false,
	active,
	...props
}: React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> & {
		asChild?: boolean;
		active?: boolean;
	}) {
	const Comp = asChild ? Slot : "button";
	return (
		<Comp
			data-slot="button"
			data-active={active ?? undefined}
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	);
}

export { Button, buttonVariants };