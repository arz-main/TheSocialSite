import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PostCard, CommentsModal, Dropdown, PostCardSkeleton } from "../components/ExplorePageComponents";
import type { PostDto } from "../types/PostTypes";
import type { SearchByOption, SortByOption } from "../types/ExplorePageTypes";
import { getSearchPlaceholder, searchByOptions, sortByOptions, filterPosts, sortPosts } from "../utils/ExplorePageUtils";
import { Button } from "../components/BasicButton";
import { usePosts } from "../hooks/usePosts";
import { Input } from "../components/BasicInput";
import ErrorScreen from "../components/ErrorScreen";
import { formatDate } from "../utils/FormatDateUtil";
import { usePostInteractions } from "../hooks/usePostInteractions";

const PAGE_SIZE = 9;

export default function ExplorePage() {

    // ─── Data ─────────────────────────────────────────────
    const [posts, setPosts] = useState<PostDto[]>([]);
    const [localLoading, setLocalLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    // ─── Search & Sort ────────────────────────────────────
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState<SearchByOption>("creator");
    const [sortBy, setSortBy] = useState<SortByOption>("relevance");
    const [searchByOpen, setSearchByOpen] = useState(false);
    const [sortByOpen, setSortByOpen] = useState(false);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

    // ─── Hooks ────────────────────────────────────────────
    const { getAllPosts } = usePosts();
    const {
        likedPosts, likeCounts, commentCounts,
        comments, openedPost, imageIndex, newComment,
        setImageIndex, setNewComment,
        initPostStates, fetchCommentCounts,
        handleLike, handleOpenComments, handleSubmitComment, closeModal,
    } = usePostInteractions();

    // ─── Fetch ────────────────────────────────────────────
    useEffect(() => {
        setLocalLoading(true);
        setLocalError(null);
        getAllPosts()
            .then(data => {
                const fetched = data ?? [];
                setPosts(fetched);
                initPostStates(fetched);
                fetchCommentCounts(fetched);
            })
            .catch(() => setLocalError("Failed to load posts."))
            .finally(() => setLocalLoading(false));
    }, [getAllPosts]);

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
        setVisibleCount(prev => Math.min(prev + PAGE_SIZE, sortedPosts.length));

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
                            {localLoading
                                ? Array.from({ length: 9 }).map((_, i) => <PostCardSkeleton key={i} />)
                                : localError
                                    ? <div className="col-span-full"><ErrorScreen /></div>
                                    : visiblePosts.map((post, index) => (
                                        <PostCard
                                            key={post.id}
                                            post={post}
                                            index={index}
                                            isLiked={likedPosts.has(post.id)}
                                            likeCount={likeCounts[post.id] ?? post.likes}
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

            <AnimatePresence>
                {openedPost && (
                    <CommentsModal
                        post={openedPost}
                        comments={comments}
                        imageIndex={imageIndex}
                        newComment={newComment}
                        // loading={localLoading}
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