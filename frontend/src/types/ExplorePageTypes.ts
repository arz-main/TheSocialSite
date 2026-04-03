import type { Comment } from "./CommentTypes";
import type { Post } from "./PostTypes";
// --- Props ---

export interface CommentsModalProps {
	post: Post;
	comments: Comment[];
	newComment: string;                             // controlled input
	imageIndex: number;                             // controlled current image
	onChangeNewComment: (value: string) => void;   // setter for newComment
	onChangeImageIndex: (index: number) => void;   // setter for imageIndex
	onClose: () => void;
	likedDrawings: Set<string>;
	toggleLike: (id: string) => void;
	onSubmitComment: (postId: string, text: string) => Promise<Comment>;
}

export interface PostCardProps {
	post: Post;
	index: number;
	isLiked: boolean;
	onToggleLike: (id: string) => void;
	onOpenComments: (post: Post) => void;
	formatDate: (d: string) => string;
	formatDuration: (s: number) => string;
}

export interface DropDownProps {
	label: string;
	value: string;
	isOpen: boolean;                               // controlled dropdown state
	options: { value: string; label: string }[];
	onChange: (value: string) => void;
	onToggle: () => void;                          // toggle open/close state
}

// --- Search & Sort types ---
export type SearchByOption = "creator" | "reference" | "keywords" | "category";
export type SortByOption = "relevance" | "likes" | "recent" | "category";