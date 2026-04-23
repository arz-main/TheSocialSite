import { useCallback, useState } from "react";
import type { PostDto } from "../types/PostTypes";
import { useRequireAuth } from "./useRequireAuth";
import { usePosts } from "./usePosts";
import { useComments } from "./useComments";
import { useDebounce } from "./useDebounce";
import type { Comment } from "../types/CommentTypes";

export function usePostInteractions() {
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
    const [comments, setComments] = useState<Comment[]>([]);
    const [openedPost, setOpenedPost] = useState<PostDto | null>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [newComment, setNewComment] = useState("");

    const { toggleLikePost } = usePosts();
    const { getComments, postComment } = useComments();
    const requireAuth = useRequireAuth();

    const initPostStates = useCallback((posts: PostDto[]) => {
        setLikedPosts(new Set(posts.filter(p => p.isLiked).map(p => p.id)));
        const counts: Record<string, number> = {};
        posts.forEach(p => counts[p.id] = p.likes);
        setLikeCounts(counts);
    }, []);

    const fetchCommentCounts = useCallback((posts: PostDto[]) => {
        posts.forEach(post => {
            getComments(post.id)
                .then(data => setCommentCounts(prev => ({ ...prev, [post.id]: data.length })))
                .catch(() => {});
        });
    }, [getComments]);

    const sendLikeRequest = useDebounce(async (id: string) => {
        try {
            const response = await toggleLikePost(id);
            setLikedPosts(prev => {
                const next = new Set(prev);
                response.isLiked ? next.add(id) : next.delete(id);
                return next;
            });
            setLikeCounts(prev => ({ ...prev, [id]: response.likeCount }));
        } catch {
            setLikedPosts(prev => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
            });
        }
    }, 600);

    const handleLike = useCallback((id: string) => {
        requireAuth(() => {
            const isLiked = likedPosts.has(id);
            setLikedPosts(prev => {
                const next = new Set(prev);
                isLiked ? next.delete(id) : next.add(id);
                return next;
            });
            setLikeCounts(prev => ({
                ...prev,
                [id]: (prev[id] ?? 0) + (isLiked ? -1 : 1)
            }));
            sendLikeRequest(id);
        });
    }, [likedPosts, sendLikeRequest, requireAuth]);

    const handleOpenComments = useCallback(async (post: PostDto) => {
        setOpenedPost(post);
        try {
            const data = await getComments(post.id);
            setComments(data);
        } catch {
            setComments([]);
        }
    }, [getComments]);

    const handleSubmitComment = useCallback(async (postId: string, content: string) => {
        const comment = await postComment(postId, content);
        setComments(prev => [...prev, comment]);
        setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }));
        return comment;
    }, [postComment]);

    const closeModal = useCallback(() => {
        setOpenedPost(null);
        setComments([]);
        setImageIndex(0);
        setNewComment("");
    }, []);

    return {
        // state
        likedPosts, likeCounts, commentCounts,
        comments, openedPost, imageIndex, newComment,
        // setters
        setImageIndex, setNewComment,
        // handlers
        initPostStates, fetchCommentCounts,
        handleLike, handleOpenComments, handleSubmitComment, closeModal,
    };
}