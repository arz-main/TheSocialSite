import { useContext } from "react";
import { AwardedBadgeContext } from "../providers/AwardedBadgesProvider";

export function useAwardedBadges() {
    const context = useContext(AwardedBadgeContext);
    if (!context) throw new Error("useAwardedBadges must be used within AwardedBadgesProvider");
    return context;
}