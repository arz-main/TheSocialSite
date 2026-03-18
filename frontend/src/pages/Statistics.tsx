import { useMemo } from "react";
import { motion } from "framer-motion";
import { StatCard } from "../components/ui/StatisticsUIComponents";
import { ContributionGrid, CategoryBreakdown, FollowersTrend, PostsTrend, SpeedTrend, BadgesGrid, StreakBanner } from "../components/ui/StatisticsPageComponents";
import { practiceInfoData, categoryData, followersData, postsData, speedData, dailyContributions, badgesData } from "../_mock/mockStatistics";
import { computeStreak } from "../utils/StatisticsPageUtils";

export default function StatsPage() {
    const streak = useMemo(() => computeStreak(dailyContributions), []);
    const totalActiveDays = useMemo(() => dailyContributions.filter(d => d.count > 0).length, []);
    const longestStreak = 21;

    return (
        <div className="flex flex-col flex-1 bg-background text-text p-5 gap-5">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl font-bold text-text">Your Statistics</h1>
                <p className="text-text-opaque text-sm mt-0.5">An overview of your drawing journey</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <StreakBanner streak={streak} longestStreak={longestStreak} totalDays={totalActiveDays} />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {practiceInfoData.map((stat, i) => (
                    <motion.div key={stat.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * i }}>
                        <StatCard {...stat} />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <ContributionGrid contributions={dailyContributions} />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
                    <FollowersTrend data={followersData} />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <PostsTrend data={postsData} />
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                    <CategoryBreakdown data={categoryData} />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                    <SpeedTrend data={speedData} />
                </motion.div>
            </div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                <BadgesGrid badges={badgesData} />
            </motion.div>
        </div>
    );
}