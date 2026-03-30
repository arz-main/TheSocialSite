import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { CommentsModal, Dropdown, PostCard } from "../components/ui/ExplorePageComponents";
import type { SearchByOption, SortByOption } from "../types/ExplorePageTypes";
import { getSearchPlaceholder, searchByOptions, sortByOptions, filterPosts, sortPosts } from "../utils/ExplorePageUtils";
import { Button } from "../components/ui/BasicButton";
import type { Post } from "../types/PostTypes";
import LoadingScreen from "../components/ui/LoadingScreen";
import ErrorScreen from "../components/ui/ErrorScreen";
import { usePost } from "../hooks/usePost";

const PAGE_SIZE = 9;

// --- Main Page ---
export default function ExplorePage() {
    const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState<SearchByOption>("creator");
    const [sortBy, setSortBy] = useState<SortByOption>("relevance");
    const [openedPost, setOpenedPost] = useState<Post | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");

    const { getAllPosts } = usePost();

    useEffect(() => {
        setLoading(true);
        setError(""); // reset

        getAllPosts()
            .then(data => {
                if (!data) {
                    throw new Error("Failed to load posts");
                }
                setPosts(data);
            })
            .catch(err => {
                console.error(err);
                setError(err.message || "Failed to load posts");
            })
            .finally(() => setLoading(false));
    }, [getAllPosts]);

    const formatDate = (dateString: string) => {
        const diffHours = Math.floor(
            (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
        );
        if (diffHours < 1) return "Just now";
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    const formatDuration = (seconds: number) => {
        if (seconds >= 60) return `${Math.floor(seconds / 60)} min`;
        return `${seconds}s`;
    };

    const toggleLike = useCallback((drawingId: string) => {
        setLikedDrawings((prev) => {
            const next = new Set(prev);
            if (next.has(drawingId)) next.delete(drawingId);
            else next.add(drawingId);
            return next;
        });
    }, []);

    const filteredPosts = useMemo(() => {
        return filterPosts(posts, searchQuery, searchBy);
    }, [posts, searchQuery, searchBy]);

    const sortedPosts = useMemo(() => {
        return sortPosts(filteredPosts, sortBy);
    }, [filteredPosts, sortBy]);

    const visiblePosts = useMemo(
        () => sortedPosts.slice(0, visibleCount),
        [sortedPosts, visibleCount]
    );

    const hasMore = !searchQuery && visibleCount < sortedPosts.length;

    const handleLoadMore = () => {
        setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedPosts.length));
    };

    // Reset pagination when search changes
    const handleSearch = (val: string) => {
        setSearchQuery(val);
        setVisibleCount(PAGE_SIZE);
    };

    if (loading) return <LoadingScreen />
    if (error) return <ErrorScreen />;

    return (
        <>
            <section className="flex flex-col flex-1 w-full h-screen bg-background text-text p-6">
                <motion.div
                    className="flex-1 flex flex-col" // <-- makes this fill available height
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Search and Filter Bar */}
                    <div className="flex gap-4 mb-8">
                        {/* Mobile toggle button */}
                        <button
                            onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                            className="md:hidden w-10 h-10 bg-card text-text border border-muted rounded-lg flex items-center justify-center"
                        >
                            <Search className="w-5 h-5" />
                        </button>

                        {/* Search input */}
                        <div className={`${isSearchExpanded ? "flex" : "hidden"} md:flex flex-1 max-w-2xl relative`}>
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder={getSearchPlaceholder(searchBy)}
                                className="flex-1 w-full text-text h-10 px-10 bg-card border border-muted rounded-lg outline-none"
                            />
                        </div>

                        {/* Filter Dropdowns - Always show */}
                        {/* Search By Dropdown */}
                        <div className="hidden md:block">
                            <Dropdown
                                label="Search by"
                                value={searchBy}
                                options={searchByOptions}
                                onChange={(val) => setSearchBy(val as SearchByOption)}
                            />
                        </div>

                        {/* Sort By Dropdown - Hide for user search */}
                        {
                            <Dropdown
                                label="Sort by"
                                value={sortBy}
                                options={sortByOptions}
                                onChange={(val) => setSortBy(val as SortByOption)}
                            />
                        }
                    </div>

                    <>
                        {/* Cards Grid */}
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.length > 0 ? (
                                visiblePosts.map((post, index) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        index={index}
                                        pageSize={PAGE_SIZE}
                                        isLiked={likedDrawings.has(post.id)}
                                        onToggleLike={toggleLike}
                                        onOpenComments={setOpenedPost}
                                        formatDate={formatDate}
                                        formatDuration={formatDuration}
                                    />
                                ))
                            ) : (
                                // <-- Empty state message for API success but no posts
                                <div className="col-span-3 text-center py-16 text-text opacity-50">
                                    {searchQuery
                                        ? `No results found matching "${searchQuery}"`
                                        : "No posts available at the moment. Check back later!"}
                                </div>
                            )}
                        </div>

                        {/* Load More */}
                        {hasMore && (
                            <div className="mt-12 text-center">
                                <Button
                                    variant={"primary"}
                                    onClick={handleLoadMore}
                                >
                                    Load More
                                </Button>
                            </div>
                        )}
                    </>
                </motion.div>
            </section>

            {/* Comments Modal */}
            <AnimatePresence>
                {openedPost && (
                    <CommentsModal
                        post={openedPost}
                        onClose={() => setOpenedPost(null)}
                        likedDrawings={likedDrawings}
                        toggleLike={toggleLike}
                        initialImageIndex={0}
                    //onSubmitComment={ }
                    />
                )}
            </AnimatePresence>
        </>
    );
}