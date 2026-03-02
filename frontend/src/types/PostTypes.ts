export interface Post {
	id: string;
	userId: string;
	username: string;
	imageUrl: string;
	referenceUrl?: string;
	category: string;
	duration: number;
	createdAt: string;
	likes: number;
	comments: number;
	showWithReference: boolean;
}