export type PostStatus = "Published" | "Draft" | "Flagged";

export interface Post {
	id: string;
	title: string,
	description: string,
	author: string;
	authorId: string;
	status: PostStatus;
	imageUrl: string;
	referenceUrl?: string;
	category: string;
	duration: number;
	createdAt: string;
	likes: number;
	comments: number;
	showWithReference: boolean;
}

export interface UpdatePostPayload {
	title?: string;
	description?: string;
	status?: PostStatus;
	imageUrl?: string;
	referenceUrl?: string;
	category?: string;
	duration?: number;
	showWithReference?: boolean;
}

export type PostsContextType = {
	loading: boolean;
	error: string | null;
	getAllPosts: () => Promise<Post[] | null>;
	getUserPosts: (userId: string) => Promise<Post[]>;
	getPost: (postId: string) => Promise<Post>;
	updatePost: (postId: string, data: UpdatePostPayload) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
};