export type BadgeTier = "Bronze" | "Silver" | "Gold";
export type BadgeCategory = "Engagement" | "ContentCreation" | "CommunitySupport" | "Milestone";

export type BadgeTemplate = {
    id: string;
    title: string;
    description: string;
    iconUrl: string;
    tier: BadgeTier;
    category: BadgeCategory;
    criteriaTarget: number;
}

export type BadgeForm = {
    title: string;
    description: string;
    iconUrl: string;
    tier: BadgeTier;
    category: BadgeCategory;
    criteriaTarget: number;
}

export interface BadgeTemplateCreatorProps {
    form: CreateBadgeTemplateDto;
    loading: boolean;
    error: string | null;
    validationError: string;
    success: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
    onSubmit: () => void;
}

export type CreateBadgeTemplateDto = {
    title: string;
    description: string;
    iconUrl: string;
    tier: BadgeTier;
    category: BadgeCategory;
    criteriaTarget: number;
};

export interface BadgeTemplateContextType {
    loading: boolean;
    error: string | null;
    createBadgeTemplate: (badgeData: CreateBadgeTemplateDto) => Promise<BadgeTemplate>;
    deleteBadgeTemplate: (badgeTemplateId: string) => Promise<string>;
    getAllBadgeTemplates: () => Promise<BadgeTemplate[]>
};

export interface BadgeTemplateActionResponse {
    isValid: boolean;
    message: string;
    badgeTemplate: BadgeTemplate;
    badgeTemplates: BadgeTemplate[];
};
