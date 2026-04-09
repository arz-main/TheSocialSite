import React, { createContext, useState, type ReactNode } from "react";
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function createBadgeTemplate(badgeData: CreateBadgeTemplateDto): Promise<BadgeTemplate> {
    try {
        setLoading(true);
        setError(null);
        const { data } = await axios.post<BadgeTemplateActionResponse>(`/badge-templates/create`, badgeData);
        return data.badgeTemplate;
    } catch (err) {
        setError("Failed to create badge template.");
        throw err;
    } finally {
        setLoading(false);
    }
}

    async function getAllBadgeTemplates(): Promise<BadgeTemplate[]> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.get<BadgeTemplateActionResponse>(`/badge-templates/`);
            return data.badgeTemplates;
        } catch (err) {
            setError("Failed to retrieve badge templates.");
            throw err;
        } finally {
            setLoading(false);
        } 
    }

    async function deleteBadgeTemplate(badgeTemplateId: string): Promise<string> {
        try {
            setLoading(true);
            setError(null);
            const { data } = await axios.delete<BadgeTemplateActionResponse>(`/badge-templates/${badgeTemplateId}`);
            return data.message;
        } catch (err) {
            setError("Failed to delete badge template.");
            throw err;
        } finally {
            setLoading(false);
        } 
    }
    
    return (
        <BadgeTemplateContext.Provider value={{ createBadgeTemplate, deleteBadgeTemplate, getAllBadgeTemplates, loading, error }}>
            {children}
        </BadgeTemplateContext.Provider>
    )
}