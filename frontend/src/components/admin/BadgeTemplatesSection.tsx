import { useState, useEffect } from "react";
import { useBadgeTemplates } from "../../hooks/useBadgeTemplates";
import type { BadgeTemplateConfirm, AdminBadgeTemplatesTableProps, BadgeTemplateOptions } from "../../types/AdminPageTypes";
import type { BadgeTemplate } from "../../types/BadgeTypes";
import { useFilteredData } from "../../utils/AdminDashboardPageUtil";
import { SectionHeader } from "./shared/SectionHeader";
import { ConfirmModal } from "./shared/ConfirmModal";
import { DataTable } from "./shared/DataTable";
import { ErrorRow } from "./shared/ErrorRow";
import { TableSkeleton } from "./shared/TableSkeleton";

export function BadgeTemplatesSection() {
    const [badgeTemplates, setBadgeTemplates] = useState<BadgeTemplate[]>([]);
    const [badgeTemplateSearch, setBadgeTemplateSearch] = useState("");
    const [badgeTemplateConfirm, setBadgeTemplateConfirm] = useState<BadgeTemplateConfirm>(null);

    const { getAllBadgeTemplates, deleteBadgeTemplate, loading, error } = useBadgeTemplates();

    useEffect(() => {
        const fetch = async () => {
            const data = await getAllBadgeTemplates();
            setBadgeTemplates(data || []);
        };
        fetch();
    }, []);

    const handleDeleteBadgeTemplate = async () => {
        if (!badgeTemplateConfirm) return;
        await deleteBadgeTemplate(badgeTemplateConfirm.id);
        setBadgeTemplates(prev => prev.filter(p => p.id !== badgeTemplateConfirm.id));
        setBadgeTemplateConfirm(null);
    };

    const handleBadgeTemplateOption = async () => {
        if (!badgeTemplateConfirm) return;
        if (badgeTemplateConfirm.type === "delete") await handleDeleteBadgeTemplate();
    };

    const filteredBadgeTemplate = useFilteredData(badgeTemplates, badgeTemplateSearch, ["title", "tier", "category"]);
    const targetBadgeTemplate = badgeTemplateConfirm ? (badgeTemplates.find(bt => bt.id === badgeTemplateConfirm.id) ?? null) : null;

    return (
        <BadgeTemplatesTable
            filteredData={filteredBadgeTemplate}
            loading={loading}
            error={error}
            search={badgeTemplateSearch}
            onSearch={setBadgeTemplateSearch}
            confirm={badgeTemplateConfirm}
            setConfirm={setBadgeTemplateConfirm}
            executeConfirm={handleBadgeTemplateOption}
            targetTemplateBadge={targetBadgeTemplate}
        />
    );
}


function BadgeTemplatesTable({
    filteredData,
    loading,
    error,
    search,
    onSearch,
    confirm,
    setConfirm,
    executeConfirm,
    targetTemplateBadge
}: AdminBadgeTemplatesTableProps) {
    const modalMessages: Record<BadgeTemplateOptions, string> = {
        delete: `Delete "${targetTemplateBadge?.title}"?`
    };

    return (
        <section className="bg-card border border-border rounded-xl overflow-hidden">
            {confirm && targetTemplateBadge && (
                <ConfirmModal
                    message={modalMessages[confirm.type]}
                    onConfirm={executeConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
            <SectionHeader
                title="Badge Templates"
                count={filteredData.length}
                search={search}
                onSearch={onSearch}
                placeholder="Search badge templates…"
            />
            <DataTable headers={["Icon", "Title", "Tier", "Category", "Criteria Target", "Actions"]}>
                {loading ? (
                    <TableSkeleton cols={6} />
                ) : error ? (
                    <ErrorRow cols={6} message={error} />
                ) : filteredData.map((badge) => (
                    <tr
                        key={badge.id}
                        className="border-b border-border last:border-0 hover:bg-border/30 transition-colors group"
                    >
                        <td className="px-5 py-3.5">
                            <img
                                src={badge.iconUrl}
                                alt={badge.title}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                        </td>
                        <td className="px-5 py-3.5 text-sm font-medium text-text">{badge.title}</td>
                        <td className="px-5 py-3.5 text-sm text-muted">{badge.tier}</td>
                        <td className="px-5 py-3.5 text-sm text-muted">{badge.category}</td>
                        <td className="px-5 py-3.5 text-sm text-muted">{badge.criteriaTarget}</td>
                        <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setConfirm({ type: "delete", id: badge.id })}
                                    className="px-2.5 py-1 text-xs rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </DataTable>
        </section>
    );
}