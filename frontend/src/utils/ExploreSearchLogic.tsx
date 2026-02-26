import type { Drawing } from "../components/ui/CommentsPopup";

export type SearchByOption = "creator" | "reference" | "keywords" | "category";
export type SortByOption = "relevance" | "likes" | "recent" | "category";

export const searchByOptions = [
	{ value: "creator", label: "By Creator" },
	{ value: "reference", label: "By Reference" },
	{ value: "keywords", label: "By Keywords" },
	{ value: "category", label: "By Category" },
];

export const sortByOptions = [
	{ value: "relevance", label: "Relevance" },
	{ value: "likes", label: "Most Liked" },
	{ value: "recent", label: "Most Recent" },
	{ value: "category", label: "Category" },
];

export function filterDrawings(
	drawings: Drawing[],
	searchQuery: string,
	searchBy: SearchByOption
): Drawing[] {
	const query = searchQuery.trim().toLowerCase();

	if (!query) {
		return drawings;
	}

	switch (searchBy) {
		case "creator":
			return drawings.filter((d) => d.username.toLowerCase().includes(query));

		case "users":
			// Return empty for users search - handled separately
			return [];

		case "reference":
			// Empty for now
			return [];

		case "keywords":
			// Search in username or category (can be extended)
			return drawings.filter(
				(d) =>
					d.username.toLowerCase().includes(query) ||
					d.category.toLowerCase().includes(query)
			);

		case "category":
			return drawings.filter((d) => d.category.toLowerCase().includes(query));

		default:
			return drawings;
	}
}

export function sortDrawings(drawings: Drawing[], sortBy: SortByOption): Drawing[] {
	const sorted = [...drawings];

	switch (sortBy) {
		case "likes":
			sorted.sort((a, b) => b.likes - a.likes);
			break;

		case "recent":
			sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
			break;

		case "category":
			sorted.sort((a, b) => a.category.localeCompare(b.category));
			break;

		case "relevance":
		default:
			// Keep original order for relevance
			break;
	}

	return sorted;
}

export function getSearchPlaceholder(searchBy: SearchByOption): string {
	switch (searchBy) {
		case "creator":
			return "Search by username...";
		case "reference":
			return "Search by reference...";
		case "keywords":
			return "Search by keywords...";
		case "category":
			return "Search by category...";
		default:
			return "Search...";
	}
}