import type { SearchByOption, SortByOption } from "../types/ExplorePageTypes";
import type { Post } from "../types/PostTypes";

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

export function filterPosts(
	posts: Post[],
	searchQuery: string,
	searchBy: SearchByOption
): Post[] {
	const query = searchQuery.trim().toLowerCase();

	if (!query) {
		return posts;
	}

	switch (searchBy) {
		case "creator":
			return posts.filter((p) => p.author.toLowerCase().includes(query));

		case "reference":
			// Empty for now
			return [];

		case "keywords":
			// Search in username or category (can be extended)
			return posts.filter(
				(p) =>
					p.author.toLowerCase().includes(query) ||
					p.category.toLowerCase().includes(query)
			);

		case "category":
			return posts.filter((p) => p.category.toLowerCase().includes(query));

		default:
			return posts;
	}
}

export function sortPosts(posts: Post[], sortBy: SortByOption): Post[] {
	const sorted = [...posts];

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
