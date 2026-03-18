export type PostStatus = "published" | "draft" | "flagged";

export interface Post {
	id: string;
	title: string,
	description: string,
	author: string;
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