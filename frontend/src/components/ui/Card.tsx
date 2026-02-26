import * as React from "react";
import { cn } from "../../utils/Utils";
import type { LucideIcon } from "lucide-react";

type HomeCardProp = {
	id: number
	icon: LucideIcon
	title: string
	description: string
}

type PracticeCardProp = {
	id: number
	icon: LucideIcon,
	title: string
	selected?: boolean;
	onToggle?: () => void;
	disabled?: boolean;
}

type StatisticsCardProp = {
	id: number
	icon: LucideIcon,
	value: number,
	title: string
}


function HomeCard({ icon: Icon, title, description }: HomeCardProp) { // that :Icon is just a way of saying it's a react component not html tag
	return (
		<div className="w-full rounded-xl border border-none bg-card p-4 shadow">
			<Icon className="text-background bg-primary w-10 h-10 p-1 rounded-lg"></Icon>
			<h1 className="text-lg text-text font-semibold py-4">
				{title}
			</h1>
			<p className="text-sm text-text-opaque py-4">
				{description}
			</p>
		</div>
	)
}

function PracticeCard({ icon: Icon, title, selected, onToggle, disabled }: PracticeCardProp) {
	return (
		<div
			className={`
                flex flex-col w-full rounded-xl border-2 p-4 shadow items-center
                transition-colors duration-150
                ${selected
					? "border-primary bg-primary/10"
					: "border-transparent bg-card hover:border-primary"
				}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
			onClick={!disabled ? onToggle : undefined}
		>

			<Icon className={`w-10 h-10 p-1 rounded-lg ${selected ? "text-primary" : "text-text"}`}></Icon>
			<h1 className={`text-lg font-semibold ${selected ? "text-primary" : "text-text"}`}>
				{title}
			</h1>
		</div>
	)
}

function StatisticsCard({ icon: Icon, value, title }: StatisticsCardProp) {
	return (
		<div className="w-full rounded-xl border border-none bg-card p-4 shadow">
			<Icon className="text-background bg-primary w-10 h-10 p-1 rounded-lg"></Icon>
			<h1 className="text-lg text-text font-semibold py-4">
				{title}
			</h1>
			<p className="text-sm text-text-opaque py-4">
				{value}
			</p>
		</div>
	)
}

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card"
			className={cn(
				"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-none",
				className,
			)}
			{...props}
		/>
	);
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				"@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
				className,
			)}
			{...props}
		/>
	);
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<h4
			data-slot="card-title"
			className={cn("leading-none", className)}
			{...props}
		/>
	);
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<p
			data-slot="card-description"
			className={cn("text-muted-foreground", className)}
			{...props}
		/>
	);
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				"col-start-2 row-span-2 row-start-1 self-start justify-self-end",
				className,
			)}
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-content"
			className={cn("px-6 [&:last-child]:pb-6", className)}
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}

export {
	HomeCard,
	PracticeCard,
	StatisticsCard,
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardAction,
	CardDescription,
	CardContent,
};