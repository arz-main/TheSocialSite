import * as React from "react";
import { cn } from "../../utils/ClassNameMergeUtil";
import { Medal } from "lucide-react";

export type BadgeTier = "Bronze" | "Silver" | "Gold";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    iconUrl: string;
    tier: BadgeTier;
    description: string;
};

const tierStyles: Record<BadgeTier, { medal: string; dot: string; line: string; label: string }> = {
    Bronze: {
        medal: "text-orange-500",
        dot: "bg-orange-500",
        line: "bg-orange-500",
        label: "bg-orange-100 text-orange-700 border-orange-300",
    },
    Silver: {
        medal: "text-slate-400",
        dot: "bg-slate-400",
        line: "bg-slate-400",
        label: "bg-slate-100 text-slate-600 border-slate-300",
    },
    Gold: {
        medal: "text-amber-400",
        dot: "bg-amber-400",
        line: "bg-amber-400",
        label: "bg-amber-100 text-amber-700 border-amber-300",
    },
};

export function BadgeCard({ title, iconUrl, tier, description, className }: Props) {
    const styles = tierStyles[tier];
    return (
        <div
            className={cn(
                "relative w-full rounded-xl bg-card p-5 overflow-hidden group shadow-sm",
                className
            )}
        >

            {/* Icon + Title on the same row */}
            <div className="flex items-center gap-3 mb-4">
                <div className="relative shrink-0">
                    <img
                        src={iconUrl}
                        alt={title}
                        className="w-11 h-11 p-0.5 rounded-xl object-contain bg-primary shadow-md group-hover:rotate-6 transition-transform duration-300 ease-out"
                    />
                </div>
                <h2 className="text-base text-text font-bold leading-snug">
                    {title}
                </h2>
            </div>

            {/* Ruled divider */}
            <div className="flex items-center gap-2 mb-2">
                <div className={cn("h-px flex-1 opacity-20", styles.line)} />
                <div className={cn("w-1 h-1 rounded-full opacity-40", styles.dot)} />
            </div>

            {/* Tier badge + description */}
            <div className="flex flex-col gap-1">
                <span className={cn(
                    "text-[10px] px-2 py-[2px] rounded-full border font-medium flex items-center gap-1 w-fit",
                    styles.label
                )}>
                    <Medal className="w-2.5 h-2.5" strokeWidth={2} />
                    {tier}
                </span>
                <p className="text-sm text-text-opaque leading-relaxed">
                    {description}
                </p>
            </div>
        </div>
    );
}