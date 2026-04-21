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

export type AwardedBadge = {
    id: string;
    userId: string;
    badgeTemplateId: string;
    earnedDate: string;
};

export type AwardedBadgeActionResponse = {
    isValid: boolean;
    message: string;
    awardedBadge: AwardedBadge;
    awardedBadges: AwardedBadge[];
}

export interface AwardedBadgeContextType {
    getAwardedBadgeById: (id: string) => Promise<AwardedBadge>;
    getAwardedBadgesByUserId: (userId: string) => Promise<AwardedBadgeWithTemplate[]>;
    createAwardedBadge: (data: CreateAwardedBadgeDto) => Promise<AwardedBadge>;
    updateAwardedBadge: (data: UpdateAwardedBadgeDto) => Promise<AwardedBadge>;
    deleteAwardedBadge: (id: string) => Promise<string>;
};

export type CreateAwardedBadgeDto = {
    userId: string;
    badgeTemplate: string;
}

export type UpdateAwardedBadgeDto = {
    id: string;
    userId: string;
    badgeTemplate: string;
}


// What the profile page will actually render
export type AwardedBadgeWithTemplate = AwardedBadge & {
    title: string;
    description: string;
    iconUrl: string;
    category: string;
    tier: string;
};

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
