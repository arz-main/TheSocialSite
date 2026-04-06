import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard, CommentsModal, Dropdown, PostCardSkeleton } from "../components/ExplorePageComponents";
import type { Post } from "../types/PostTypes";
import type { Comment } from "../types/CommentTypes";
import type { SearchByOption, SortByOption } from "../types/ExplorePageTypes";
import { getSearchPlaceholder, searchByOptions, sortByOptions, filterPosts, sortPosts } from "../utils/ExplorePageUtils";
import { Button } from "../components/BasicButton";
import { usePosts } from "../hooks/usePosts";
import { useComments } from "../hooks/useComments";
import { Input } from "../components/BasicInput";
import ErrorScreen from "../components/ErrorScreen";
// import { useAuth } from "../hooks/useAuth";

const PAGE_SIZE = 9;

const safeDate = (str: string | null | undefined): string => {
    if (!str) return new Date().toISOString();
    return str.replace(/(\.\d{3})\d+/, "$1");
};

export default function ExplorePage() {
    // data
    const [posts, setPosts] = useState<Post[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
    const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());

    // ui state
    const [openedPost, setOpenedPost] = useState<Post | null>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // search & sort
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState<SearchByOption>("creator");
    const [sortBy, setSortBy] = useState<SortByOption>("relevance");
    const [searchByOpen, setSearchByOpen] = useState(false);
    const [sortByOpen, setSortByOpen] = useState(false);

    // hooks
    const { getAllPosts, loading: loadingPosts, error: errorPosts } = usePosts();
    const { getComments, postComment } = useComments();
    // const { currentUser } = useAuth();

    // fetch posts
    useEffect(() => {
        getAllPosts()
            .then((data) => setPosts(data ?? []))
            .catch(() => { });
    }, [getAllPosts]);

    // fetch comment counts
    useEffect(() => {
        if (!posts || posts.length === 0) return;
        posts.forEach((post) => {
            getComments(post.id)
                .then((data) => setCommentCounts((prev) => ({ ...prev, [post.id]: data.length })))
                .catch(() => { });
        });
    }, [posts]);

    // derived
    const filteredPosts = useMemo(() => filterPosts(posts, searchQuery, searchBy), [posts, searchQuery, searchBy]);
    const sortedPosts = useMemo(() => sortPosts(filteredPosts, sortBy), [filteredPosts, sortBy]);
    const visiblePosts = useMemo(() => sortedPosts.slice(0, visibleCount), [sortedPosts, visibleCount]);
    const hasMore = !searchQuery && visibleCount < sortedPosts.length;

    // handlers
    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setVisibleCount(PAGE_SIZE);
    };

    const handleLoadMore = () => setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedPosts.length));

    const toggleLike = useCallback((id: string) => {
        setLikedDrawings((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    }, []);

    const handleOpenComments = useCallback(async (post: Post) => {
        setOpenedPost(post);
        try {
            const data = await getComments(post.id);
            setComments(data);
        } catch {
            setComments([]);
        }
    }, [getComments]);

    const handleSubmitComment = useCallback(async (postId: string, content: string) => {
        const raw = await postComment(postId, content);
        const normalized: Comment = {
            id: raw.id,
            postId: raw.postId,
            content: raw.content,
            authorId: raw.authorId,
            authorUsername: raw.authorUsername,
            authorAvatar: raw.authorAvatar,
            createdAt: safeDate(raw.createdAt),
        };
        setComments((prev) => [...prev, normalized]);
        setCommentCounts((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }));
        return normalized;
    }, [postComment]);

    const closeModal = () => {
        setOpenedPost(null);
        setComments([]);
        setImageIndex(0);
        setNewComment("");
    };

    // ─── Formatters ───────────────────────────────────────
    const formatDate = useCallback((dateString: string) => {
        const diffHours = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
        if (diffHours < 1) return "Just now";
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    }, []);

    const formatDuration = useCallback((seconds: number) =>
        seconds >= 60 ? `${Math.floor(seconds / 60)} min` : `${seconds}s`
        , []);

    return (
        <>
            <section className="flex flex-col flex-1 w-full min-h-screen bg-background text-text p-6">
                <motion.div
                    className="flex-1 flex flex-col"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Search & Filters */}
                    <div className="flex items-center gap-3 mb-8">
                        <Input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder={getSearchPlaceholder(searchBy)}
                            className="flex-1"
                        />
                        <Dropdown
                            label="Search by"
                            value={searchBy}
                            options={searchByOptions}
                            onChange={(val: string) => setSearchBy(val as SearchByOption)}
                            isOpen={searchByOpen}
                            onToggle={() => setSearchByOpen(p => !p)}
                        />
                        <Dropdown
                            label="Sort by"
                            value={sortBy}
                            options={sortByOptions}
                            onChange={(val: string) => setSortBy(val as SortByOption)}
                            isOpen={sortByOpen}
                            onToggle={() => setSortByOpen(p => !p)}
                        />
                    </div>

                    {/* Posts Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {loadingPosts
                                ? Array.from({ length: 9 }).map((_, i) => <PostCardSkeleton key={i} />)
                                : errorPosts
                                    ? <div className="col-span-full"><ErrorScreen /></div>
                                    : visiblePosts.map((post, index) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            index={index}
                                            isLiked={likedDrawings.has(post.id)}
                                            commentCount={commentCounts[post.id]}
                                            onToggleLike={toggleLike}
                                            onOpenComments={handleOpenComments}
                                            formatDate={formatDate}
                                            formatDuration={formatDuration}
                                        />
                                    ))
                            }
                        </div>
                    </div>


                    {hasMore && (
                        <div className="mt-12 text-center">
                            <Button variant="primary" onClick={handleLoadMore}>Load More</Button>
                        </div>
                    )}
                </motion.div>
            </section>

            {/* Comments Modal */}
            <AnimatePresence>
                {openedPost && (
                    <CommentsModal
                        post={openedPost}
                        comments={comments}
                        likedDrawings={likedDrawings}
                        imageIndex={imageIndex}
                        newComment={newComment}
                        onChangeImageIndex={setImageIndex}
                        onChangeNewComment={setNewComment}
                        onSubmitComment={handleSubmitComment}
                        toggleLike={toggleLike}
                        onClose={closeModal}
                    />
                )}
            </AnimatePresence>
        </>
    );

}