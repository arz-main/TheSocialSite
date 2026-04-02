import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import type {
    Badge,
    CategoryItem, DailyContribution, SpeedData, StatisticsCardProp
} from "../types/StatisticsPageTypes";
import { computeStreak, formatMonthLabel, groupIntoWeeks } from "../utils/StatisticsPageUtils";

export function SpeedTrend({ data }: { data: SpeedData[] }) {
    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Avg Drawing Time" subtitle="Minutes per drawing — improving over time" />
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "none", borderRadius: 8, color: "var(--text)", fontSize: 12 }} labelStyle={{ color: "var(--text-opaque)" }} />
                        <Line type="monotone" dataKey="minutes" stroke="var(--accent)" strokeWidth={2} dot={{ fill: "var(--accent)", r: 3 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function StreakBanner({ streak, longestStreak, totalDays }: { streak: number; longestStreak: number; totalDays: number }) {
    return (
        <div className="rounded-2xl bg-linear-to-r from-primary to-primary/70 p-5 text-white shadow-sm flex flex-wrap gap-6 items-center">
            <div className="flex items-center gap-3">
                <span className="text-4xl">🔥</span>
                <div>
                    <p className="text-3xl font-bold leading-none">{streak}</p>
                    <p className="text-sm opacity-80">day streak</p>
                </div>
            </div>
            <div className="w-px h-10 bg-white/30 hidden sm:block" />
            <div>
                <p className="text-xl font-bold leading-none">{longestStreak}</p>
                <p className="text-xs opacity-80">longest streak</p>
            </div>
            <div className="w-px h-10 bg-white/30 hidden sm:block" />
            <div>
                <p className="text-xl font-bold leading-none">{totalDays}</p>
                <p className="text-xs opacity-80">active days this year</p>
            </div>
        </div>
    );
}

export function StatCard({ icon: Icon, value, title, trend, trendUp, tooltip }: StatisticsCardProp) {
    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    return (
        <div
            className="relative rounded-2xl bg-card p-4 shadow-sm flex flex-col gap-2 cursor-default"
            onMouseMove={(e) => tooltip && setTooltipPos({ x: e.clientX, y: e.clientY })}
            onMouseLeave={() => setTooltipPos(null)}
        >
            {tooltip && tooltipPos && (
                <div
                    className="fixed z-50 pointer-events-none px-2 py-1 bg-background-opposite text-text-opposite text-xs rounded-lg shadow-lg whitespace-nowrap"
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y - 30,
                        transform: "translateX(-50%)",
                    }}
                >
                    {tooltip}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                        style={{
                            borderLeft: "4px solid transparent",
                            borderRight: "4px solid transparent",
                            borderTop: "4px solid var(--background-opposite)",
                        }}
                    />
                </div>
            )}

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

export function ContributionCell({ count, date }: DailyContribution) {
    const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 9 ? 3 : 4;
    const colors = ["bg-primary/8", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"];
    const label = count === 0 ? "No drawings" : `${count} drawing${count > 1 ? "s" : ""}`;

    const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

    return (
        <>
            <div
                className={`w-3 h-3 rounded-sm ${colors[level]} transition-colors cursor-default`}
                onMouseMove={(e) => setTooltipPos({ x: e.clientX, y: e.clientY })}
                onMouseLeave={() => setTooltipPos(null)}
            />
            {tooltipPos && (
                <div
                    className="fixed z-50 pointer-events-none px-2 py-1 bg-background-opposite text-text-opposite text-xs rounded-lg shadow-lg whitespace-nowrap"
                    style={{
                        left: tooltipPos.x,
                        top: tooltipPos.y - 30,
                        transform: "translateX(-50%)",
                    }}
                >
                    {label} ({new Date(date).toLocaleDateString()})
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                        style={{
                            borderLeft: "4px solid transparent",
                            borderRight: "4px solid transparent",
                            borderTop: "4px solid var(--background-opposite)",
                        }}
                    />
                </div>
            )}
        </>
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
            {earned && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
        </div>
    );
}

export function CategoryRow({ name, value, icon }: CategoryItem) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-xl w-6 shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text truncate">{name}</span>
                </div>
                <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" />
                </div>
            </div>
            <span className="text-xs text-text-opaque w-10 text-right shrink-0">{value} draws</span>
        </div>
    );
}

// -------------------- TRENDS --------------------

export function ContributionGrid({ contributions }: { contributions: DailyContribution[] }) {
    // const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

    const weeks = useMemo(() => groupIntoWeeks(contributions), [contributions]);
    const streak = useMemo(() => computeStreak(contributions), [contributions]);
    const total = useMemo(() => contributions.reduce((s, d) => s + d.count, 0), [contributions]);

    const monthLabels = useMemo(() => {
        const labels: { label: string; col: number }[] = [];
        let lastMonth = "";
        weeks.forEach((week, col) => {
            const first = week.find(d => d !== null);
            if (!first) return;
            const m = formatMonthLabel(first.date);
            if (m !== lastMonth) { labels.push({ label: m, col }); lastMonth = m; }
        });
        return labels;
    }, [weeks]);

    const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <SectionHeader title="Drawing Activity" subtitle={`${total} drawings · ${streak} day streak`} />
            </div>
            <div className="flex justify-center overflow-x-auto pb-1">
                <div className="flex gap-2 min-w-0">
                    <div className="flex flex-col gap-1 pt-5 shrink-0">
                        {WEEKDAYS.map((d, i) => (
                            i % 2 === 1
                                ? <span key={d} className="text-[9px] text-text-opaque h-3 leading-3 w-7 text-right pr-1">{d}</span>
                                : <span key={d} className="h-3 w-7" />
                        ))}
                    </div>

                    <div className="flex flex-col min-w-0">
                        <div className="flex gap-1 mb-1 h-4">
                            {weeks.map((_, col) => {
                                const lbl = monthLabels.find(m => m.col === col);
                                return (
                                    <div key={col} className="w-3 shrink-0 relative">
                                        {lbl && <span className="text-[9px] text-text-opaque absolute whitespace-nowrap">{lbl.label}</span>}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="flex gap-1">
                            {weeks.map((week, col) => (
                                <div key={col} className="flex flex-col gap-1 shrink-0">
                                    {Array.from({ length: 7 }).map((_, row) => {
                                        const d = week[row];
                                        if (!d) return <div key={row} className="w-3 h-3" />;
                                        return <ContributionCell key={row} count={d.count} date={d.date} />;
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// -------------------- CATEGORY --------------------

export function CategoryBreakdown({ data }: { data: CategoryItem[] }) {
    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Category Distribution" subtitle="All-time drawing breakdown" />
            <div className="flex h-4 rounded-full overflow-hidden mb-5 gap-0.5">
                {data.map(cat => (
                    <motion.div key={cat.name} initial={{ flex: 0 }} animate={{ flex: cat.value }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        style={{ backgroundColor: cat.fill }} title={cat.name}
                        className="h-full first:rounded-l-full last:rounded-r-full cursor-default" />
                ))}
            </div>
            <div className="flex flex-col gap-3">
                {data.map((cat, i) => (
                    <motion.div key={cat.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
                        <CategoryRow {...cat} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

// -------------------- FOLLOWERS & POSTS --------------------

export function FollowersTrend({ data }: { data: { date: string; followers: number }[] }) {
    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Followers" subtitle={`${data[data.length - 1]?.followers ?? 0} total`} />
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "none", borderRadius: 8 }} />
                        <Area type="monotone" dataKey="followers" stroke="var(--primary)" fill="url(#fGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// -------------------- POSTS TREND --------------------

export function PostsTrend({ data }: { data: { date: string; posts: number }[] }) {
    const totalPosts = data.reduce((sum, d) => sum + d.posts, 0);

    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Posts" subtitle={`${totalPosts} total posts`} />
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                        <defs>
                            <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "none", borderRadius: 8, color: "var(--text)", fontSize: 12 }} />
                        <Area type="monotone" dataKey="posts" stroke="var(--secondary)" fill="url(#pGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

// -------------------- BADGES GRID --------------------

export function BadgesGrid({ badges }: { badges: Badge[] }) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; content: string } | null>(null);
    const earnedCount = badges.filter(b => b.earned).length;

    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Badges" subtitle={`${earnedCount} / ${badges.length} earned`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {badges.map((badge, i) => (
                    <div
                        key={badge.id}
                        className="relative"
                        onMouseMove={(e) =>
                            setTooltip({
                                x: e.clientX,
                                y: e.clientY,
                                content: `${badge.description}${badge.earnedDate ? ` · Earned ${badge.earnedDate}` : ""}`,
                            })
                        }
                        onMouseLeave={() => setTooltip(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <BadgePill icon={badge.icon} name={badge.name} earned={badge.earned} />
                        </motion.div>
                    </div>
                ))}
            </div>

            {tooltip && (
                <div
                    className="fixed z-50 pointer-events-none px-2 py-1 bg-background-opposite text-text-opposite text-xs rounded-lg shadow-lg whitespace-nowrap"
                    style={{ left: tooltip.x, top: tooltip.y - 30, transform: "translateX(-50%)" }}
                >
                    {tooltip.content}
                    <div
                        className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                        style={{
                            borderLeft: "4px solid transparent",
                            borderRight: "4px solid transparent",
                            borderTop: "4px solid var(--background-opposite)",
                        }}
                    />
                </div>
            )}
        </div>
    );
}