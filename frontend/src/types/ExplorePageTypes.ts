// --- Types ---
export type Drawing = {
	id: string;
	username: string;
	createdAt: string;
	likes: number;
	comments: number;
	category: string;
	duration: number;
	showWithReference?: boolean;
	referenceUrl?: string;
}

export type Comment = {
	id: string;
	username: string;
	text: string;
	createdAt: string;
}

// --- Props ---
export interface CommentsModalProps {
	drawing: Drawing;
	mockComments: Record<string, Comment[]>;
	onClose: () => void;
	likedDrawings: Set<string>;
	toggleLike: (id: string) => void;
	initialImageIndex?: number;
	onUserClick?: (userId: string) => void;
}

export interface PostCardProps {
    drawing: Drawing;
	index: number;
	isLiked: boolean;
    pageSize: number;
	onToggleLike: (id: string) => void;
	onOpenComments: (drawing: Drawing) => void;
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
