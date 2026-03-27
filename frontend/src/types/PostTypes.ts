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