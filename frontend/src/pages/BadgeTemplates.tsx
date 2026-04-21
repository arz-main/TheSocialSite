import { useEffect, useState } from "react";
import { useBadgeTemplates } from "../hooks/useBadgeTemplates";
import type { BadgeTemplate } from "../types/BadgeTypes";
import { BadgeCard } from "../components/badge/BadgeCard";
import LoadingScreen from "../components/LoadingScreen";
import ErrorScreen from "../components/ErrorScreen";

export default function BadgeTemplates() {
    const [badgeTemplates, setBadgeTemplates] = useState<BadgeTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { getAllBadgeTemplates } = useBadgeTemplates();

    useEffect(() => {
        setLoading(true);
        setError(null);
        getAllBadgeTemplates()
            .then(data => setBadgeTemplates(data))
            .catch(() => setError("Failed to retrieve badge templates."))
            .finally(() => setLoading(false));
    }, [getAllBadgeTemplates]);

    if (loading) return <LoadingScreen />;
    if (error) return <ErrorScreen />;

    return (
        <section className="flex flex-col flex-1 w-full min-h-screen bg-background text-text p-6 gap-6">
            {/* Header */}
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-2xl font-bold text-text">Badge Templates</h1>
                <p className="text-sm text-text-opaque">
                    {badgeTemplates.length} badge{badgeTemplates.length !== 1 ? "s" : ""} available
                </p>
            </div>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {badgeTemplates.map(badge => (
                    <BadgeCard
                        key={badge.id}
                        title={badge.title}
                        iconUrl={badge.iconUrl}
                        tier={badge.tier}
                        description={badge.description}
                    />
                ))}
            </div>
        </section>
    );
}