import { useContext } from "react";
import type { BadgeTemplateContextType } from "../types/BadgeTypes";
import { BadgeTemplateContext } from "../providers/BadgeTemplatesProvider";

export function useBadgeTemplates(): BadgeTemplateContextType {
    const context = useContext(BadgeTemplateContext);
    if (!context) throw new Error("useBadgeTemplates must be used within an BadgeTemplatesProvider");
    return context;
}