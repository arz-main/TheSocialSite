export interface Comment {
    id: string
	postId: string;
	authorId: string;
	authorUsername: string; // optional because it might be null/undefined
	authorAvatar?: string;   // optional
	content: string;
	createdAt: string;       // Date serialized as ISO string
}

export type CommentsContextType = {
    loading: boolean;
    error: string | null;
    getComments: (postId: string) => Promise<Comment[]>;
    postComment: (postId: string, content: string) => Promise<Comment>;
};

export interface CommentActionResponse {
    isValid: boolean;
    message: string;
    content?: string;
    commentDtos?: Comment[];
    commentDto?: Comment;
}
