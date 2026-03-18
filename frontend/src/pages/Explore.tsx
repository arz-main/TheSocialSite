import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { CommentsModal, Dropdown, PostCard } from "../components/ui/ExplorePageComponents";
import type { SearchByOption, SortByOption } from "../types/ExplorePageTypes";
import { getSearchPlaceholder, searchByOptions, sortByOptions, filterPosts, sortPosts } from "../utils/ExplorePageUtils";
import Paths from "../routes/paths";
import { Button } from "../components/ui/BasicButton";
import type { Post } from "../types/PostTypes";

const PAGE_SIZE = 9;

// --- Main Page ---
export default function ExplorePage() {
    const navigate = useNavigate();
    const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());
    const [searchQuery, setSearchQuery] = useState("");
    const [searchBy, setSearchBy] = useState<SearchByOption>("creator");
    const [sortBy, setSortBy] = useState<SortByOption>("relevance");
    const [openedDrawing, setOpenedDrawing] = useState<Post | null>(null);
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

    const handleUserClick = (userId: string) => {
        navigate(`${Paths.explore}/user/${userId}`);
    };

    const filteredPosts = useMemo(() => {
        return filterPosts(mockPosts, searchQuery, searchBy);
    }, [searchQuery, searchBy]);

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

    return (
        <>
            <section className="flex flex-col flex-1 w-full p-6 bg-background">
                <motion.div
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
                        <div className="bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visiblePosts.length > 0 ? (
                                visiblePosts.map((post: Post, index: number) => (
                                    <PostCard
                                        key={post.id}
                                        post={post}
                                        index={index}
                                        pageSize={PAGE_SIZE}
                                        isLiked={likedDrawings.has(post.id)}
                                        onToggleLike={toggleLike}
                                        onOpenComments={setOpenedDrawing}
                                        formatDate={formatDate}
                                        formatDuration={formatDuration}
                                        onUserClick={handleUserClick}
                                    />
                                ))
                            ) : (
                                <div className="col-span-3 text-center py-16 text-text opacity-50">
                                    {searchBy === "reference" ? (
                                        <>No reference search available yet</>
                                    ) : (
                                        <>No results found matching "{searchQuery}"</>
                                    )}
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
                {openedDrawing && (
                    <CommentsModal
                        post={openedDrawing}
                        // mockComments={mockComments}
                        onClose={() => setOpenedDrawing(null)}
                        likedDrawings={likedDrawings}
                        toggleLike={toggleLike}
                        initialImageIndex={0}
                        onUserClick={handleUserClick}
                    />
                )}
            </AnimatePresence>
        </>
    );
}