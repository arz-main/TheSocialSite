import type { StatisticsCardProp } from "../../types/StatisticsPageTypes";

export function StatCard({ icon: Icon, value, title, trend, trendUp }: StatisticsCardProp) {
    return (
        <div className="rounded-2xl bg-card p-4 shadow-sm flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-text-opaque">{title}</span>
                <div className="p-1.5 rounded-lg bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
            </div>
            <p className="text-2xl font-bold text-text">{value}</p>
            {trend && (
                <p className={`text-xs font-medium ${trendUp ? "text-green-500" : "text-text-opaque"}`}>
                    {trendUp ? "↑" : "→"} {trend}
                </p>
            )}
        </div>
    );
}

export function ContributionCell({ count, date }: { count: number; date: string }) {
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
    const colors = ["bg-primary/8", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];
    const label = count === 0 ? "No drawings" : `${count} drawing${count > 1 ? "s" : ""}`;
    return (
        <div
            className={`w-3 h-3 rounded-sm ${colors[level]} transition-colors cursor-default`}
            title={`${date}: ${label}`}
        />
    );
}

export function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className="mb-4">
            <h2 className="text-text font-bold text-base">{title}</h2>
            {subtitle && <p className="text-text-opaque text-xs mt-0.5">{subtitle}</p>}
        </div>
    );
}

export function BadgePill({ icon, name, earned }: { icon: string; name: string; earned: boolean }) {
    return (
        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all
            ${earned ? "bg-primary/10 text-primary" : "bg-card text-text-opaque opacity-50 grayscale"}`}>
            <span className="text-base">{icon}</span>
            <span className="font-medium text-xs leading-tight">{name}</span>
            {earned && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />}
        </div>
    );
}

export function CategoryRow({ name, value, fill, icon, total }: {
    name: string; value: number; fill: string; icon: string; total: number;
}) {
    const pct = Math.round((value / total) * 100);
    return (
        <div className="flex items-center gap-3">
            <span className="text-xl w-6 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text truncate">{name}</span>
                    <span className="text-xs text-text-opaque ml-2 flex-shrink-0">{pct}%</span>
                </div>
                <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: fill }} />
                </div>
            </div>
            <span className="text-xs text-text-opaque w-10 text-right flex-shrink-0">{value} draws</span>
        </div>
    );
}