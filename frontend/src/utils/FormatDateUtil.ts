
export const formatDate = (dateString: string) => {
    // append 'Z' to tell JS this is UTC, not local time
    const date = new Date(dateString.endsWith("Z") ? dateString : dateString + "Z");
    const diffHours = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));
    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
};
