import type { StatisticsCardProp } from "../../types/StatisticsPageTypes";

export function StatisticsCard({ icon: Icon, value, title }: StatisticsCardProp) {
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
