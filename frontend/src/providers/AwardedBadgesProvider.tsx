import { createContext, useCallback, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import type {
    AwardedBadge,
    AwardedBadgeWithTemplate,
    AwardedBadgeActionResponse,
    AwardedBadgeContextType,
    CreateAwardedBadgeDto,
    UpdateAwardedBadgeDto
} from "../types/BadgeTypes";

export const AwardedBadgeContext = createContext<AwardedBadgeContextType | undefined>(undefined);

export function AwardedBadgesProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;

    const getAwardedBadgeById = useCallback(async (id: string): Promise<AwardedBadge> => {
        const { data } = await axios.get<AwardedBadgeActionResponse>(`/awarded-badges/${id}`);
        return data.awardedBadge;
    }, [axios]);

    const getAwardedBadgesByUserId = useCallback(async (userId: string): Promise<AwardedBadgeWithTemplate[]> => {
        const { data } = await axios.get<AwardedBadgeActionResponse>(`/awarded-badges/user/${userId}`);
        if (!data.awardedBadges || data.awardedBadges.length === 0) return [];
        const enriched = await Promise.all(
            data.awardedBadges.map(async (ab) => {
                const { data: templateResponse } = await axios.get(`/badge-templates/${ab.badgeTemplateId}`);
                console.log("template response:", templateResponse); // <-- add
                const template = templateResponse.badgeTemplate;
                return {
                    ...ab,
                    title: template.title,
                    description: template.description,
                    iconUrl: template.iconUrl,
                    category: template.category,
                    tier: template.tier,
                };
            })
        );

        console.log("enriched:", enriched); // <-- add
        return enriched;
    }, [axios]);

    const createAwardedBadge = useCallback(async (data: CreateAwardedBadgeDto): Promise<AwardedBadge> => {
        const { data: response } = await axios.post<AwardedBadgeActionResponse>(`/awarded-badges/create`, data);
        return response.awardedBadge;
    }, [axios]);

    const updateAwardedBadge = useCallback(async (data: UpdateAwardedBadgeDto): Promise<AwardedBadge> => {
        const { data: response } = await axios.put<AwardedBadgeActionResponse>(`/awarded-badges/${data.id}`, data);
        return response.awardedBadge;
    }, [axios]);

    const deleteAwardedBadge = useCallback(async (id: string): Promise<string> => {
        const { data } = await axios.delete<AwardedBadgeActionResponse>(`/awarded-badges/${id}`);
        return data.message;
    }, [axios]);

    return (
        <AwardedBadgeContext.Provider value={{
            getAwardedBadgeById,
            getAwardedBadgesByUserId,
            createAwardedBadge,
            updateAwardedBadge,
            deleteAwardedBadge
        }}>
            {children}
        </AwardedBadgeContext.Provider>
    );
}