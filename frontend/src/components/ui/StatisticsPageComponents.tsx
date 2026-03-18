import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area } from "recharts";
import { SectionHeader, ContributionCell, CategoryRow, BadgePill } from "../ui/StatisticsUIComponents";
import { groupIntoWeeks, formatMonthLabel, computeStreak } from "../../utils/StatisticsPageUtils";
import type { DailyContribution, CategoryItem } from "../../types/StatisticsPageTypes";

export function ContributionGrid({ contributions }: { contributions: DailyContribution[] }) {
    const [tooltip, setTooltip] = useState<{ x: number; y: number; date: string; count: number } | null>(null);

    // Group ALL contributions into weeks
    const weeks = useMemo(() => groupIntoWeeks(contributions), [contributions]);
    const streak = useMemo(() => computeStreak(contributions), [contributions]);
    const total = useMemo(() => contributions.reduce((s, d) => s + d.count, 0), [contributions]);

    // Month labels: first column index where a new month starts
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
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <SectionHeader
                    title="Drawing Activity"
                    subtitle={`${total} drawings in the last year · ${streak} day streak`}
                />
                <div className="flex items-center gap-1.5 text-xs text-text-opaque flex-shrink-0">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map(l => (
                        <div key={l} className={`w-3 h-3 rounded-sm ${["bg-primary/10", "bg-primary/25", "bg-primary/50", "bg-primary/75", "bg-primary"][l]}`} />
                    ))}
                    <span>More</span>
                </div>
            </div>

            {/* Scrollable grid — centered */}
            <div className="flex justify-center overflow-x-auto pb-1">
                <div className="flex gap-2 min-w-0">
                    {/* Weekday labels column */}
                    <div className="flex flex-col gap-[3px] pt-5 flex-shrink-0">
                        {WEEKDAYS.map((d, i) => (
                            i % 2 === 1
                                ? <span key={d} className="text-[9px] text-text-opaque h-3 leading-3 w-7 text-right pr-1">{d}</span>
                                : <span key={d} className="h-3 w-7" />
                        ))}
                    </div>

                    {/* Weeks */}
                    <div className="flex flex-col min-w-0">
                        {/* Month labels */}
                        <div className="flex gap-[3px] mb-1 h-4">
                            {weeks.map((_, col) => {
                                const lbl = monthLabels.find(m => m.col === col);
                                return (
                                    <div key={col} className="w-3 flex-shrink-0 relative">
                                        {lbl && (
                                            <span className="text-[9px] text-text-opaque absolute whitespace-nowrap">{lbl.label}</span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Cell grid */}
                        <div className="flex gap-[3px]">
                            {weeks.map((week, col) => (
                                <div key={col} className="flex flex-col gap-[3px] flex-shrink-0">
                                    {Array.from({ length: 7 }).map((_, row) => {
                                        const d = week[row];
                                        if (!d) return <div key={row} className="w-3 h-3" />;
                                        return (
                                            <div
                                                key={row}
                                                className={`w-3 h-3 rounded-sm cursor-default transition-all hover:ring-1 hover:ring-primary ${d.count === 0 ? "bg-primary/10"
                                                        : d.count <= 2 ? "bg-primary/25"
                                                            : d.count <= 5 ? "bg-primary/50"
                                                                : d.count <= 9 ? "bg-primary/75"
                                                                    : "bg-primary"
                                                    }`}
                                                onMouseEnter={e => {
                                                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                                                    setTooltip({ x: rect.left + rect.width / 2, y: rect.top - 8, date: d.date, count: d.count });
                                                }}
                                                onMouseLeave={() => setTooltip(null)}
                                            />
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating tooltip — rendered via portal-like fixed positioning */}
            {tooltip && (
                <div
                    className="fixed z-50 pointer-events-none"
                    style={{ left: tooltip.x, top: tooltip.y, transform: "translate(-50%, -100%)" }}
                >
                    <div className="bg-background-opposite text-text-opposite text-xs rounded-lg px-2.5 py-1.5 shadow-lg whitespace-nowrap">
                        <span className="font-semibold">
                            {tooltip.count === 0 ? "No drawings" : `${tooltip.count} drawing${tooltip.count > 1 ? "s" : ""}`}
                        </span>
                        <span className="text-text-opposite/60 ml-1.5">
                            {new Date(tooltip.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0"
                            style={{ borderLeft: "4px solid transparent", borderRight: "4px solid transparent", borderTop: "4px solid var(--background-opposite)" }} />
                    </div>
                </div>
            )}
        </div>
    );
}

export function CategoryBreakdown({ data }: { data: CategoryItem[] }) {
    const total = data.reduce((s, d) => s + d.value, 0);
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
                        <CategoryRow {...cat} total={total} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export function FollowersTrend({ data }: { data: { date: string; followers: number }[] }) {
    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Followers" subtitle={`${data[data.length - 1]?.followers ?? 0} total · growing`} />
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                        <defs>
                            <linearGradient id="fGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                        <XAxis dataKey="date" tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: "var(--text-opaque)", fontSize: 10 }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "none", borderRadius: 8, color: "var(--text)", fontSize: 12 }} labelStyle={{ color: "var(--text-opaque)" }} />
                        <Area type="monotone" dataKey="followers" stroke="var(--primary)" fill="url(#fGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function PostsTrend({ data }: { data: { date: string; posts: number }[] }) {
    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Posts" subtitle={`${data.reduce((s, d) => s + d.posts, 0)} total posts`} />
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
                        <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "none", borderRadius: 8, color: "var(--text)", fontSize: 12 }} labelStyle={{ color: "var(--text-opaque)" }} />
                        <Area type="monotone" dataKey="posts" stroke="var(--secondary)" fill="url(#pGrad)" strokeWidth={2} dot={false} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export function SpeedTrend({ data }: { data: { name: string; minutes: number }[] }) {
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

export function BadgesGrid({ badges }: { badges: { id: string; icon: string; name: string; description: string; earned: boolean; earnedDate?: string }[] }) {
    const earned = badges.filter(b => b.earned).length;
    return (
        <div className="rounded-2xl bg-card p-5 shadow-sm">
            <SectionHeader title="Badges" subtitle={`${earned} / ${badges.length} earned`} />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {badges.map((badge, i) => (
                    <motion.div key={badge.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }} title={badge.description + (badge.earnedDate ? ` · Earned ${badge.earnedDate}` : "")}>
                        <BadgePill icon={badge.icon} name={badge.name} earned={badge.earned} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export function StreakBanner({ streak, longestStreak, totalDays }: {
    streak: number; longestStreak: number; totalDays: number;
}) {
    return (
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/70 p-5 text-white shadow-sm flex flex-wrap gap-6 items-center">
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