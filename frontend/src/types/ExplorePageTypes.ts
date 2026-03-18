import type { Post } from "./PostTypes";

export type Comment = {
	id: string;
	username: string;
	text: string;
	createdAt: string;
}

// --- Props ---
export interface CommentsModalProps {
	post: Post;
	mockComments?: Record<string, Comment[]>;
	onClose: () => void;
	likedDrawings: Set<string>;
	toggleLike: (id: string) => void;
	initialImageIndex?: number;
	onUserClick?: (userId: string) => void;
}

export interface PostCardProps {
    post: Post;
	index: number;
	isLiked: boolean;
    pageSize: number;
	onToggleLike: (id: string) => void;
	onOpenComments: (post: Post) => void;
	formatDate: (d: string) => string;
	formatDuration: (s: number) => string;
	onUserClick: (userId: string) => void;
}

export interface DropDownProps {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (value: string) => void;
}

export type SearchByOption = "creator" | "reference" | "keywords" | "category";
export type SortByOption = "relevance" | "likes" | "recent" | "category";
