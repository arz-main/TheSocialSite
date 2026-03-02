export const formatRelativeTime = (isoDateString: string): string => {
	const diffMs: number = Date.now() - new Date(isoDateString).getTime();
	const mins: number = Math.floor(diffMs / 60_000);
	const hours: number = Math.floor(mins / 60);
	const days: number = Math.floor(hours / 24);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins}m`;
	if (hours < 24) return `${hours}h`;
	return `${days}d`;
};

export const formatMessageTimestamp = (isoDateString: string): string =>
	new Date(isoDateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
