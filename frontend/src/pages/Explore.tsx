import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard, CommentsModal, Dropdown, PostCardSkeleton } from "../components/ExplorePageComponents";
import type { PostDto } from "../types/PostTypes";
import type { Comment } from "../types/CommentTypes";
import type { SearchByOption, SortByOption } from "../types/ExplorePageTypes";
import { getSearchPlaceholder, searchByOptions, sortByOptions, filterPosts, sortPosts } from "../utils/ExplorePageUtils";
import { Button } from "../components/BasicButton";
import { usePosts } from "../hooks/usePosts";
import { useComments } from "../hooks/useComments";
import { Input } from "../components/BasicInput";
import ErrorScreen from "../components/ErrorScreen";
import { useDebounce } from "../hooks/useDebounce";
import { useRequireAuth } from "../hooks/useRequireAuth";
import { formatDate } from "../utils/FormatDateUtil";

const PAGE_SIZE = 9;

export default function ExplorePage() {

    // ─── Data ─────────────────────────────────────────────
    const [posts, setPosts] = useState<PostDto[]>([]);  // Post[] -> PostDto[]
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

    // ─── UI State ─────────────────────────────────────────
    const [openedPost, setOpenedPost] = useState<PostDto | null>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [newComment, setNewComment] = useState("");
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // ─── Search & Sort ────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState<SearchByOption>("creator");
    const [sortBy, setSortBy] = useState<SortByOption>("relevance");
    const [searchByOpen, setSearchByOpen] = useState(false);
    const [sortByOpen, setSortByOpen] = useState(false);

    const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

    // ─── Hooks ────────────────────────────────────────────
    const { getAllPosts, toggleLikePost, loading: loadingPosts, error: errorPosts } = usePosts();
    const { getComments, postComment, loading: loadingComments } = useComments();
    const requireAuth = useRequireAuth();


    // seed on fetch
    useEffect(() => {
        getAllPosts()
            .then((data) => {
                const fetched = data ?? [];
                setPosts(fetched);
                setLikedPosts(new Set(fetched.filter(p => p.isLiked).map(p => p.id)));
                // seed like counts from server
                const counts: Record<string, number> = {};
                fetched.forEach(p => counts[p.id] = p.likes);
                setLikeCounts(counts);
            })
            .catch(() => { });
    }, [getAllPosts]);

    // ─── Fetch Comment Counts ─────────────────────────────
    useEffect(() => {
        if (!posts.length) return;
        posts.forEach((post) => {
            getComments(post.id)
                .then((data) => setCommentCounts((prev) => ({ ...prev, [post.id]: data.length })))
                .catch(() => { });
        });
    }, [posts]);

    // ─── Derived State ────────────────────────────────────
    const filteredPosts = useMemo(() => filterPosts(posts, searchQuery, searchBy), [posts, searchQuery, searchBy]);
    const sortedPosts = useMemo(() => sortPosts(filteredPosts, sortBy), [filteredPosts, sortBy]);
    const visiblePosts = useMemo(() => sortedPosts.slice(0, visibleCount), [sortedPosts, visibleCount]);
    const hasMore = !searchQuery && visibleCount < sortedPosts.length;

    // ─── Handlers ─────────────────────────────────────────
    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setVisibleCount(PAGE_SIZE);
    };

    const handleLoadMore = () =>
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedPosts.length));

    const sendLikeRequest = useDebounce(async (id: string) => {
        try {
            const response = await toggleLikePost(id);
            setLikedPosts((prev) => {
                const next = new Set(prev);
                response.isLiked ? next.add(id) : next.delete(id);
                return next;
            });
            setLikeCounts(prev => ({ ...prev, [id]: response.likeCount }));
        } catch {
            // revert on failure
            setLikedPosts((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
            });
        }
    }, 600);

    const toggleLike = (id: string) => {
        // optimistic update — flip immediately for snappy UI
        setLikedPosts((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
        sendLikeRequest(id);
    };

    const handleLike = (id: string) => requireAuth(() => toggleLike(id));

    const openComments = useCallback(async (post: PostDto) => {
        setOpenedPost(post);
        try {
            const data = await getComments(post.id);
            setComments(data);
        } catch {
            setComments([]);
        }
    }, [getComments]);

    const handleOpenComments = (post: PostDto) => requireAuth(() => openComments(post));

    const handleSubmitComment = useCallback(async (postId: string, content: string) => {
        const comment = await postComment(postId, content);
        setComments((prev) => [...prev, comment]);
        setCommentCounts((prev) => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }));
        return comment;
    }, [postComment]);

    const closeModal = () => {
        setOpenedPost(null);
        setComments([]);
        setImageIndex(0);
        setNewComment("");
    };

    // ─── Render ───────────────────────────────────────────
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
                                            isLiked={likedPosts.has(post.id)}
                                            likeCount={likeCounts[post.id] ?? post.likes}   // <-- add this
                                            commentCount={commentCounts[post.id]}
                                            onToggleLike={handleLike}
                                            onOpenComments={handleOpenComments}
                                            formatDate={formatDate}
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
                        imageIndex={imageIndex}
                        newComment={newComment}
                        loading={loadingComments}
                        onChangeImageIndex={setImageIndex}
                        onChangeNewComment={setNewComment}
                        onSubmitComment={handleSubmitComment}
                        onClose={closeModal}
                    />
                )}
            </AnimatePresence>
        </>
    );
}