import { createContext, useCallback, type ReactNode } from "react";
import useAxios from "../hooks/useAxios";
import type {
    BadgeTemplate,
    BadgeTemplateActionResponse,
    BadgeTemplateContextType,
    CreateBadgeTemplateDto
} from "../types/BadgeTypes";

export const BadgeTemplateContext = createContext<BadgeTemplateContextType | undefined>(undefined);

export function BadgeTemplatesProvider({ children }: { children: ReactNode }) {
    const axios = useAxios()!;

    const createBadgeTemplate = useCallback(async (badgeData: CreateBadgeTemplateDto): Promise<BadgeTemplate> => {
        const { data } = await axios.post<BadgeTemplateActionResponse>(`/badge-templates/create`, badgeData);
        return data.badgeTemplate;
    }, [axios]);

    const getAllBadgeTemplates = useCallback(async (): Promise<BadgeTemplate[]> => {
        const { data } = await axios.get<BadgeTemplateActionResponse>(`/badge-templates/`);
        return data.badgeTemplates;
    }, [axios]);

    const deleteBadgeTemplate = useCallback(async (badgeTemplateId: string): Promise<string> => {
        const { data } = await axios.delete<BadgeTemplateActionResponse>(`/badge-templates/${badgeTemplateId}`);
        return data.message;
    }, [axios]);

    return (
        <BadgeTemplateContext.Provider value={{ createBadgeTemplate, deleteBadgeTemplate, getAllBadgeTemplates }}>
            {children}
        </BadgeTemplateContext.Provider>
    );
}