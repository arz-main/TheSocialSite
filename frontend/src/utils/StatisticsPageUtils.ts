import type { DailyContribution } from "../types/StatisticsPageTypes";

export function generateYearContributions(seed: Record<string, number> = {}): DailyContribution[] {
    const days: DailyContribution[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().split("T")[0];
        days.push({ date: iso, count: seed[iso] ?? 0 });
    }
    return days;
}

export function computeStreak(contributions: DailyContribution[]): number {
    let streak = 0;
    for (let i = contributions.length - 1; i >= 0; i--) {
        if (contributions[i].count > 0) streak++;
        else break;
    }
    return streak;
}

export function groupIntoWeeks(contributions: DailyContribution[]): (DailyContribution | null)[][] {
    const firstDay = new Date(contributions[0].date).getDay();
    const padded: (DailyContribution | null)[] = [
        ...Array(firstDay).fill(null),
        ...contributions,
    ];
    const weeks: (DailyContribution | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
        weeks.push(padded.slice(i, i + 7));
    }
    return weeks;
}

export function formatMonthLabel(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString("en-US", { month: "short" });
}