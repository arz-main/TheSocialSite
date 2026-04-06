import type { User } from "./UserTypes";

export type PostStatus = "Published" | "Draft" | "Flagged";

export interface Post {
	id: string;
	title: string,
	description: string,
	author: User;
	authorId: string;
	status: PostStatus;
	imageUrl: string;
	category: string;
	createdAt: string;
	likes: number;
}

export interface UpdatePostPayload {
	title?: string;
	description?: string;
	status?: PostStatus;
	imageUrl?: string;
	category?: string;
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