import { Brush, Clock, Layers, TrendingUp, BookOpen, Award, Flame, Users } from "lucide-react";
import { generateYearContributions } from "../utils/StatisticsPageUtils";

export const drawingsPerMonth = [
    { name: "Jan", drawings: 12 }, { name: "Feb", drawings: 18 },
    { name: "Mar", drawings: 22 }, { name: "Apr", drawings: 16 },
    { name: "May", drawings: 25 }, { name: "Jun", drawings: 28 },
    { name: "Jul", drawings: 30 }, { name: "Aug", drawings: 34 },
    { name: "Sep", drawings: 29 }, { name: "Oct", drawings: 38 },
    { name: "Nov", drawings: 42 }, { name: "Dec", drawings: 51 },
];

export const speedData = [
    { name: "Jan", minutes: 6 }, { name: "Feb", minutes: 5.5 },
    { name: "Mar", minutes: 5 }, { name: "Apr", minutes: 4.8 },
    { name: "May", minutes: 4.5 }, { name: "Jun", minutes: 4.2 },
    { name: "Jul", minutes: 4 }, { name: "Aug", minutes: 3.8 },
    { name: "Sep", minutes: 3.6 }, { name: "Oct", minutes: 3.4 },
    { name: "Nov", minutes: 3.2 }, { name: "Dec", minutes: 3.0 },
];

export const categoryData = [
    { name: "Figure Drawing", value: 40, fill: "#C94A3D", icon: "🧍" },
    { name: "Portraits", value: 25, fill: "#4AC2B1", icon: "🖼️" },
    { name: "Hands", value: 20, fill: "#FFB703", icon: "✋" },
    { name: "Still Life", value: 10, fill: "#6366f1", icon: "🏺" },
    { name: "Animals", value: 5, fill: "#82ca9d", icon: "🐾" },
];

export const followersData = [
    { date: "Aug", followers: 42 }, { date: "Sep", followers: 61 },
    { date: "Oct", followers: 89 }, { date: "Nov", followers: 134 },
    { date: "Dec", followers: 187 }, { date: "Jan", followers: 201 },
    { date: "Feb", followers: 248 }, { date: "Mar", followers: 312 },
];

export const postsData = [
    { date: "Aug", posts: 3 }, { date: "Sep", posts: 5 },
    { date: "Oct", posts: 4 }, { date: "Nov", posts: 8 },
    { date: "Dec", posts: 12 }, { date: "Jan", posts: 9 },
    { date: "Feb", posts: 14 }, { date: "Mar", posts: 18 },
];

function buildContributionSeed(): Record<string, number> {
    const seed: Record<string, number> = {};
    const today = new Date();
    for (let i = 0; i < 364; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const iso = d.toISOString().split("T")[0];
        const recencyBoost = i < 60 ? 0.2 : 0;
        if (Math.random() > 0.4 - recencyBoost) {
            seed[iso] = Math.floor(Math.random() * 10) + 1;
        }
    }
    return seed;
}

export const dailyContributions = generateYearContributions(buildContributionSeed());

const totalDrawings = drawingsPerMonth.reduce((a, c) => a + c.drawings, 0);
const avgSpeed = (speedData.reduce((a, c) => a + c.minutes, 0) / speedData.length).toFixed(1);

export const practiceInfoData = [
    { id: 1, title: "Total Drawings", value: totalDrawings, icon: Brush, trend: "+18%", trendUp: true },
    { id: 2, title: "Avg Time / Drawing", value: `${avgSpeed} min`, icon: Clock, trend: "-12%", trendUp: true },
    { id: 3, title: "Drawing Streak", value: "14 days", icon: Flame, trend: "+3 days", trendUp: true },
    { id: 4, title: "Chapters Done", value: 24, icon: BookOpen, trend: "+4 this month", trendUp: true },
    { id: 5, title: "Lessons Done", value: 138, icon: Layers, trend: "+22 this month", trendUp: true },
    { id: 6, title: "Badges Earned", value: 8, icon: Award, trend: "2 pending", trendUp: false },
    { id: 7, title: "Followers", value: 312, icon: Users, trend: "+64 this month", trendUp: true },
    { id: 8, title: "Growth", value: "+18%", icon: TrendingUp, trend: "vs last month", trendUp: true },
];

export const badgesData = [
    { id: "1", name: "First Steps", description: "Complete your first drawing session", icon: "🎨", earned: true, earnedDate: "2026-01-15" },
    { id: "2", name: "Dedicated Artist", description: "Maintain a 7-day streak", icon: "🔥", earned: true, earnedDate: "2026-01-22" },
    { id: "3", name: "Speed Sketcher", description: "Complete 50 quick sketches under 2 min", icon: "⚡", earned: true, earnedDate: "2026-02-01" },
    { id: "4", name: "Master of Hands", description: "Complete 100 hand studies", icon: "✋", earned: false },
    { id: "5", name: "Century Club", description: "Complete 100 drawing sessions", icon: "💯", earned: true, earnedDate: "2026-02-05" },
    { id: "6", name: "Marathon Artist", description: "Draw for 3 hours in a single day", icon: "🏃", earned: false },
    { id: "7", name: "Portrait Pro", description: "Complete 50 portrait studies", icon: "🖼️", earned: true, earnedDate: "2026-03-01" },
    { id: "8", name: "Animal Kingdom", description: "Complete 30 animal drawings", icon: "🐾", earned: true, earnedDate: "2026-03-10" },
];