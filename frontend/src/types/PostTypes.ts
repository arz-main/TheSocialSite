export type PostStatus = "Published" | "Draft" | "Flagged";

export interface Post {
	id: string;
	title: string,
	description: string,
	authorId: string;
	authorUsername: string;
	authorAvatarUrl: string;
	status: PostStatus;
	imageUrl: string;
	category: string;
	createdAt: string;
	likes: number;
}

export interface PostDto {
	id: string;
	authorId: string;
	authorUsername: string;
	authorAvatarUrl: string;
	status: PostStatus;
	likes: number;
	title: string;
	imageUrl: string;
	category: string;
	description?: string;
	createdAt: string;
	isLiked: boolean;
}

export interface UpdatePostPayload {
	title?: string;
	description?: string;
	status?: PostStatus;
	imageUrl?: string;
	category?: string;
}

export interface PostActionResponse {
	isValid: boolean;
	message: string;
	postDto?: PostDto;
	postDtos?: PostDto[];
	isLiked: boolean;
	likeCount: number;
}

export type PostsContextType = {
	getAllPosts: () => Promise<PostDto[] | null>;
	getUserPosts: (userId: string) => Promise<PostDto[]>;
	getPost: (postId: string) => Promise<PostDto>;
	updatePost: (postId: string, data: UpdatePostPayload) => Promise<void>;
	deletePost: (postId: string) => Promise<void>;
	toggleLikePost: (postId: string) => Promise<PostActionResponse>;
};