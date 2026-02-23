
export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
};

export const formatDuration = (seconds: number) => {
	if (seconds >= 60) {
		const minutes = Math.floor(seconds / 60);
		return `${minutes} min`;
	}
	return `${seconds}s`;
};