import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, X, ChevronLeft, ChevronRight, Send, MessageCircle, ChevronDown } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./BasicButton";
import { ImageWithFallback } from "./ImageWithFallBack";
import { exploreImages, referenceImages } from "../../_mock/mockExplorePage";
import { mockUsers } from "../../_mock/mockUsers";
import type { CommentsModalProps, Comment, PostCardProps, DropDownProps } from "../../types/ExplorePageTypes";

// --- User Banner Component ---
export function UserBanner({
    user,
    onUserClick,
    onFollow,
    isFollowing,
}: {
    user: typeof mockUsers[0];
    onUserClick: (userId: string) => void;
    onFollow: (userId: string) => void;
    isFollowing: boolean;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                        className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                        onClick={() => onUserClick(user.id)}
                    >
                        {user.avatar ? (
                            <img
                                src={user.avatar}
                                alt={user.username}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
                                {user.username.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                        <h3
                            className="text-lg font-semibold text-text mb-1 cursor-pointer hover:text-primary transition-colors truncate"
                            onClick={() => onUserClick(user.id)}
                        >
                            {user.username}
                        </h3>
                        {user.bio && (
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {user.bio}
                            </p>
                        )}
                        <div className="flex gap-3 text-xs text-muted-foreground">
                            <span>{user.postsCount} posts</span>
                            <span>{user.followers?.length} followers</span>
                            <span>{user.following?.length} following</span>
                        </div>
                    </div>

                    {/* Follow Button */}
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <Button
                            variant={isFollowing ? "outline" : "default"}
                            size="sm"
                            onClick={() => onFollow(user.id)}
                        >
                            <User className="w-4 h-4 mr-2" />
                            {isFollowing ? "Following" : "Follow"}
                        </Button>
                    </motion.div>
                </div>
            </Card>
        </motion.div>
    );
}
export function CommentsModal({
    post,
    mockComments,
    onClose,
    likedDrawings,
    toggleLike,
    initialImageIndex = 0,
    onUserClick,
}: CommentsModalProps) {
    // Drawing is always index 0 (matches what's shown on the card), reference is index 1
    const images: string[] = [];
    images.push(exploreImages[post.id]);
    if (post.showWithReference && post.referenceUrl) {
        images.push(referenceImages[post.id]);
    }

    const [imageIndex, setImageIndex] = useState(initialImageIndex);
    // const [comments, setComments] = useState<Comment[]>(mockComments[post.id] || []);
    const [newComment, setNewComment] = useState("");
    const commentsEndRef = useRef<HTMLDivElement>(null);

    const formatDate = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "Just now";
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    // const submitComment = () => {
    //     const text = newComment.trim();
    //     if (!text) return;
    //     setComments((prev) => [
    //         ...prev,
    //         {
    //             id: `new-${Date.now()}`,
    //             username: "you",
    //             text,
    //             createdAt: new Date().toISOString(),
    //         },
    //     ]);
    //     setNewComment("");
    //     setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    // };

    // const handleKeyDown = (e: React.KeyboardEvent) => {
    //     if (e.key === "Enter" && !e.shiftKey) {
    //         e.preventDefault();
    //         submitComment();
    //     }
    // };

    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdrop}
        >
            {/* Modal shell — fixed size, no shrinking */}
            <motion.div
                className="relative bg-card rounded-2xl overflow-hidden shadow-2xl flex"
                style={{
                    width: "min(1400px, 95vw)",
                    height: "min(920px, 92vh)",
                }}
                initial={{ scale: 0.93, opacity: 0, y: 24 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.93, opacity: 0, y: 24 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* ── LEFT: Image panel — fixed 55% width, black background always ── */}
                <div
                    className="relative flex-shrink-0 flex items-center justify-center bg-black"
                    style={{ width: "55%" }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={imageIndex}
                            initial={{ opacity: 0, x: 16 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -16 }}
                            transition={{ duration: 0.18 }}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <ImageWithFallback
                                src={images[imageIndex]}
                                alt={`Image ${imageIndex + 1}`}
                                className="object-contain"
                                style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Navigation arrows */}
                    {images.length > 1 && (
                        <>
                            <button
                                onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
                                disabled={imageIndex === 0}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 disabled:opacity-20 flex items-center justify-center text-white transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setImageIndex((i) => Math.min(images.length - 1, i + 1))}
                                disabled={imageIndex === images.length - 1}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 disabled:opacity-20 flex items-center justify-center text-white transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Dot indicators */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImageIndex(i)}
                                        className={`rounded-full transition-all ${i === imageIndex
                                            ? "w-4 h-1.5 bg-white"
                                            : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Label badge */}
                            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                                {imageIndex === 0 ? "Drawing" : "Reference"}
                            </div>
                        </>
                    )}
                </div>

                {/* ── RIGHT: Comments panel — fills remaining width ── */}
                <div className="flex flex-col flex-1 min-w-0 border-l border-muted">
                    {/* Post author header */}
                    <div className="px-4 py-3.5 border-b border-muted flex items-center gap-3 flex-shrink-0">
                        <div
                            className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all overflow-hidden"
                            onClick={() => {
                                const user = mockUsers.find(u => u.username === post.author);
                                if (user && onUserClick) {
                                    onUserClick(user.id);
                                    onClose();
                                }
                            }}
                        >
                            {(() => {
                                const user = mockUsers.find(u => u.username === post.author);
                                return user?.avatar ? (
                                    <img src={user.avatar} alt={post.author} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-text/60" />
                                );
                            })()}
                        </div>
                        <div className="min-w-0">
                            <p
                                className="text-text font-semibold text-sm truncate cursor-pointer hover:underline"
                                onClick={() => {
                                    const user = mockUsers.find(u => u.username === post.author);
                                    if (user && onUserClick) {
                                        onUserClick(user.id);
                                        onClose();
                                    }
                                }}
                            >
                                {post.author}
                            </p>
                            <p className="text-text/50 text-xs truncate">{post.category}</p>
                        </div>
                    </div>

                    {/* Like summary */}
                    {/* <div className="px-4 py-2.5 border-b border-muted flex items-center gap-4 flex-shrink-0">
                        <motion.button
                            onClick={() => toggleLike(post.id)}
                            className="flex items-center gap-1.5 transition-colors"
                            whileTap={{ scale: 0.88 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Heart
                                className={`w-4 h-4 text-[#C24A48] transition-all ${likedDrawings.has(post.id) ? "fill-current scale-110" : ""
                                    }`}
                            />
                            <span className="text-text text-sm">
                                {post.likes + (likedDrawings.has(post.id) ? 1 : 0)} likes
                            </span>
                        </motion.button>
                        <span className="text-text/40 text-xs">·</span>
                        <span className="text-text/50 text-sm">{comments.length} comments</span>
                    </div> */}

                    {/* Comments list — scrollable */}
                    {/* <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
                        {comments.length === 0 && (
                            <p className="text-text/30 text-sm text-center pt-8">
                                No comments yet. Be the first!
                            </p>
                        )}
                        {comments.map((comment) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex gap-2.5"
                            >
                                <div
                                    className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5 cursor-pointer hover:ring-2 hover:ring-primary transition-all overflow-hidden"
                                    onClick={() => {
                                        const user = mockUsers.find(u => u.username === comment.username || `user_${u.id}` === comment.username);
                                        if (user && onUserClick) {
                                            onUserClick(user.id);
                                            onClose();
                                        }
                                    }}
                                >
                                    {(() => {
                                        const user = mockUsers.find(u => u.username === comment.username || `user_${u.id}` === comment.username);
                                        return user?.avatar ? (
                                            <img src={user.avatar} alt={comment.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-3.5 h-3.5 text-text/50" />
                                        );
                                    })()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-baseline gap-2 flex-wrap">
                                        <span
                                            className="text-text font-semibold text-sm cursor-pointer hover:underline"
                                            onClick={() => {
                                                const user = mockUsers.find(u => u.username === comment.username || `user_${u.id}` === comment.username);
                                                if (user && onUserClick) {
                                                    onUserClick(user.id);
                                                    onClose();
                                                }
                                            }}
                                        >
                                            {comment.username}
                                        </span>
                                        <span className="text-text/35 text-xs">{formatDate(comment.createdAt)}</span>
                                    </div>
                                    <p className="text-text/80 text-sm mt-0.5 leading-relaxed break-words">
                                        {comment.text}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                        <div ref={commentsEndRef} />
                    </div> */}

                    {/* Comment input — pinned to bottom */}
                    {/* <div className="px-4 py-3 border-t border-muted flex-shrink-0">
                        <div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2.5 border border-muted focus-within:border-primary transition-colors">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Add a comment…"
                                className="flex-1 bg-transparent text-text text-sm placeholder-text/35 focus:outline-none"
                            />
                            <motion.button
                                onClick={submitComment}
                                disabled={!newComment.trim()}
                                className="text-primary disabled:opacity-25 transition-opacity flex-shrink-0"
                                whileTap={{ scale: 0.85 }}
                            >
                                <Send className="w-4 h-4" />
                            </motion.button>
                        </div>
                    </div> */}
                </div>
            </motion.div>
        </motion.div>
    );
}

// --- Dropdown Component ---
export function Dropdown({
    label,
    value,
    options,
    onChange,
}: DropDownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-card text-text border border-muted rounded-lg py-2.5 px-4 hover:bg-muted/50 transition-colors"
            >
                <span className="text-sm text-text/70">{label}:</span>
                <span className="text-sm font-medium">{selectedOption?.label}</span>
                <ChevronDown className={`w-4 h-4 text-text/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full mt-2 left-0 bg-card border border-muted rounded-lg shadow-lg overflow-hidden z-10 min-w-[200px]"
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${option.value === value
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-text hover:bg-muted/50"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// --- PostCard with single/double click and like flash ---
export function PostCard({
    post,
    index,
    isLiked,
    pageSize,
    onToggleLike,
    onOpenComments,
    formatDate,
    formatDuration,
}: PostCardProps) {
    const [likeFlash, setLikeFlash] = useState(false);
    const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clickCount = useRef(0);

    // Safe user reference
    const user = mockUsers.find((u) => u.username === post.author) || mockUsers[0];

    const handleImageClick = useCallback(() => {
        clickCount.current += 1;
        if (clickTimer.current) clearTimeout(clickTimer.current);

        clickTimer.current = setTimeout(() => {
            const count = clickCount.current;
            clickCount.current = 0;

            if (count === 1) {
                onOpenComments(post);
            } else if (count >= 2) {
                onToggleLike(post.id);
                setLikeFlash(true);
                setTimeout(() => setLikeFlash(false), 800);
            }
        }, 220);
    }, [post, onToggleLike, onOpenComments]);

    //const imageCount = drawing.showWithReference && drawing.referenceUrl ? 2 : 1;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.04 * (index % pageSize), duration: 0.3 }}
        >
            <Card className="bg-card overflow-hidden hover:shadow-xl transition-shadow">
                {/* User Info */}
                <div className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-5 h-5 text-text/50" />
                        )}
                    </div>

                    <div className="flex-1">
                        <div className="text-text flex items-center gap-2">
                            <span>{user.username}</span>
                            <span className="text-sm text-text/50">{formatDate(user.joinedDate)}</span>
                        </div>
                    </div>
                </div>

                {/* Image */}
                <div className="relative cursor-pointer select-none" onClick={handleImageClick}>
                    <div className="aspect-square bg-muted overflow-hidden">
                        <ImageWithFallback
                            src={exploreImages[post.id]}
                            alt={`Drawing by ${post.author}`}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Double-click like flash */}
                    <AnimatePresence>
                        {likeFlash && (
                            <motion.div
                                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                exit={{ opacity: 0, scale: 1.4 }}
                                transition={{ duration: 0.15 }}
                            >
                                <Heart className="w-16 h-16 text-[#C24A48] fill-current drop-shadow-lg" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Actions */}
                <div className="p-4">
                    <div className="flex items-center gap-4 mb-3">
                        <motion.button
                            onClick={() => onToggleLike(post.id)}
                            className="flex items-center gap-1 transition-colors"
                            whileTap={{ scale: 0.85 }}
                        >
                            <Heart
                                className={`w-5 h-5 text-[#C24A48] transition-all ${isLiked ? "fill-current scale-110" : ""
                                    }`}
                            />
                            <span className="text-text">{post.likes + (isLiked ? 1 : 0)}</span>
                        </motion.button>

                        <button
                            onClick={() => onOpenComments(post)}
                            className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
                        >
                            <MessageCircle className="text-text w-5 h-5" />
                            <span className="text-text">{post.comments}</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <span className="text-text text-sm">{post.category}</span>
                        <span className="text-sm text-text">{formatDuration(post.duration)}</span>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}