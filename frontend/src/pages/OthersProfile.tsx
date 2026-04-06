import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, MapPin, CalendarDays } from "lucide-react";
import { FaPinterest, FaTwitter, FaDeviantart, FaYoutube, FaDiscord, FaGlobe } from "react-icons/fa";
import { Badge as BadgeUI } from "../components/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { formatDate, formatDuration } from "../utils/ProfilePageUtils";
import { usePosts } from "../hooks/usePosts";
import { useComments } from "../hooks/useComments";
import { CommentsModal, PostCard } from "../components/ExplorePageComponents";
import { AvatarFallback } from "../components/AvatarFallback";
import type { Post } from "../types/PostTypes";
import type { Comment } from "../types/CommentTypes";
import { Card } from "../components/Card";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../types/UserTypes";

export default function OthersProfile() {
    // data
    const [user, setUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [openedPost, setOpenedPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

    // ui
    const [activeTab, setActiveTab] = useState("posts");
    const [imageIndex, setImageIndex] = useState(0);
    const [newComment, setNewComment] = useState("");

    const { getUser } = useUsers();
    const { getUserPosts } = usePosts();
    const { getComments, postComment } = useComments();
    const { userId } = useParams();

    useEffect(() => {
        if (!userId) return;
        getUser(userId).then(data => { if (data) setUser(data); });
        getUserPosts(userId).then(data => { if (data) setUserPosts(data); });
    }, [userId]);

    useEffect(() => {
        if (userPosts.length === 0) return;
        userPosts.forEach(async (post) => {
            const data = await getComments(post.id);
            setCommentCounts(prev => ({ ...prev, [post.id]: data.length }))
        });
    }, [userPosts]);

    // ─── Handlers ─────────────────────────────────────────
    const handleToggleLike = (postId: string) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return next;
        });
    };

    const handleOpenComments = async (post: Post) => {
        setOpenedPost(post);
        try {
            const data = await getComments(post.id);
            setComments(data);
        } catch {
            setComments([]);
        }
    };

    const handleSubmitComment = async (postId: string, content: string) => {
        const raw = await postComment(postId, content);
        const normalized: Comment = {
            id: raw.id,
            postId: raw.postId,
            content: raw.content,
            authorId: raw.authorId,
            authorUsername: raw.authorUsername,
            authorAvatar: raw.authorAvatar,
            createdAt: raw.createdAt,
        };
        setComments(prev => [...prev, normalized]);
        return normalized;
    };

    const closeModal = () => {
        setOpenedPost(null);
        setComments([]);
        setImageIndex(0);
        setNewComment("");
    };

    if (!user) return null;

    // ─── Derived ──────────────────────────────────────────
    const hasSocialLinks = user.socialLinks && Object.values(user.socialLinks).some(Boolean);
    const earnedBadges = user.badges ? user.badges.filter((b: any) => b.earned) : [];
    const rankBadge = user.level || "Advanced Sketcher";
    const streak = user.streak ?? 0;
    const postsCount = userPosts.length;

    return (
        <div className="flex flex-col flex-1 bg-background text-text">
            <div className="w-full max-w-5xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    {/* PROFILE CARD */}
                    <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm">

                        {/* Banner */}
                        <div className="h-36 w-full" style={{ backgroundColor: "var(--button)" }} />

                        {/* Profile body */}
                        <div className="px-8 pt-4 pb-6 relative">

                            {/* Avatar overlapping banner */}
                            <div className="absolute -top-14 left-8">
                                <AvatarFallback
                                    src={user.avatar}
                                    alt={user.username ?? ""}
                                    size={112}
                                    className="ring-4 ring-card shadow-lg"
                                />
                            </div>

                            {/* Spacer for avatar */}
                            <div className="h-14" />

                            {/* Name & handle */}
                            <div className="mt-2">
                                <h1 className="text-2xl font-bold leading-tight">{user.username}</h1>
                                <p className="text-sm text-muted mt-0.5">
                                    @{(user.username ?? "artist").toLowerCase().replace(/\s/g, "")}
                                </p>
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <p className="mt-3 text-sm text-text/80 leading-relaxed max-w-2xl">{user.bio}</p>
                            )}

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-sm text-muted">
                                {user.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        {user.location}
                                    </span>
                                )}
                                {user.website && (
                                    <a href={user.website} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-primary hover:underline transition-colors">
                                        <ExternalLink className="w-4 h-4 shrink-0" />
                                        {user.website.replace(/^https?:\/\//, "")}
                                    </a>
                                )}
                                {user.joinedDate && (
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="w-4 h-4 shrink-0" />
                                        Joined {formatDate(user.joinedDate)}
                                    </span>
                                )}
                            </div>

                            {/* Social links */}
                            {hasSocialLinks && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {user.socialLinks!.twitter && (
                                        <a href={user.socialLinks!.twitter} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaTwitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {user.socialLinks!.pinterest && (
                                        <a href={user.socialLinks!.pinterest} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaPinterest className="w-4 h-4" />
                                        </a>
                                    )}
                                    {user.socialLinks!.deviantArt && (
                                        <a href={user.socialLinks!.deviantArt} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaDeviantart className="w-4 h-4" />
                                        </a>
                                    )}
                                    {user.socialLinks!.youTube && (
                                        <a href={user.socialLinks!.youTube} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaYoutube className="w-4 h-4" />
                                        </a>
                                    )}
                                    {user.socialLinks!.discord && (
                                        <button
                                            onClick={() => navigator.clipboard.writeText(user.socialLinks!.discord!)}
                                            title={`Copy: ${user.socialLinks!.discord}`}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaDiscord className="w-4 h-4" />
                                        </button>
                                    )}
                                    {user.website && (
                                        <a href={user.website} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaGlobe className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Followers / Following */}
                            <div className="flex items-center gap-1 mt-4 text-sm">
                                <span className="font-bold">{user.followers?.length ?? 0}</span>
                                <span className="text-muted mr-4">Followers</span>
                                <span className="font-bold">{user.following?.length ?? 0}</span>
                                <span className="text-muted">Following</span>
                            </div>

                            {/* Stats pills */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
                                <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-background border border-border">
                                    <span className="text-2xl font-bold">{postsCount}</span>
                                    <span className="text-xs text-muted">Posts</span>
                                </div>
                                <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-background border border-border">
                                    <div className="flex items-center gap-1">
                                        <span className="text-2xl font-bold">{streak}</span>
                                        <span className="text-base ml-1">🔥</span>
                                    </div>
                                    <span className="text-xs text-muted">Day Streak</span>
                                </div>
                                <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-background border border-border">
                                    <span className="text-2xl font-bold">{earnedBadges.length}</span>
                                    <span className="text-xs text-muted">Badges Earned</span>
                                </div>
                                <div className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-background border border-border">
                                    <span className="text-base">⭐</span>
                                    <span className="text-xs text-muted">{rankBadge}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TABS */}
                    <div className="mt-4">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="w-full grid grid-cols-3 h-12">
                                <TabsTrigger value="posts" className="h-full text-sm font-semibold">
                                    Posts <span className="ml-1.5 text-xs opacity-60">{postsCount}</span>
                                </TabsTrigger>
                                <TabsTrigger value="badges" className="h-full text-sm font-semibold">
                                    Badges <span className="ml-1.5 text-xs opacity-60">{earnedBadges.length}</span>
                                </TabsTrigger>
                                <TabsTrigger value="favorites" className="h-full text-sm font-semibold">
                                    Favorites <span className="ml-1.5 text-xs opacity-60">0</span>
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-5">
                                <TabsContent value="posts">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        {userPosts.length === 0 ? (
                                            <Card className="p-20 text-center">
                                                <div className="text-5xl mb-4">🎨</div>
                                                <h3 className="text-lg font-semibold mb-2">No Posts Yet</h3>
                                                <p className="text-muted">This user hasn't posted anything yet</p>
                                            </Card>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {userPosts.map((post, index) => (
                                                    <PostCard
                                                        key={post.id}
                                                        post={post}
                                                        index={index}
                                                        isLiked={likedPosts.has(post.id)}
                                                        onToggleLike={handleToggleLike}
                                                        onOpenComments={handleOpenComments}
                                                        formatDate={formatDate}
                                                        formatDuration={formatDuration}
                                                        commentCount={commentCounts[post.id]}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="badges">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        {earnedBadges.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {earnedBadges.map((badge: any, index: number) => (
                                                    <motion.div key={badge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index, duration: 0.3 }}>
                                                        <Card className="p-5 hover:shadow-lg transition-all">
                                                            <div className="flex items-start gap-4">
                                                                <div className="text-4xl">{badge.icon}</div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="font-semibold">{badge.name}</h4>
                                                                        <BadgeUI variant="default" className="text-xs border">Earned</BadgeUI>
                                                                    </div>
                                                                    <p className="text-sm text-muted mb-2">{badge.description}</p>
                                                                    {badge.earnedDate && <p className="text-xs text-muted">{formatDate(badge.earnedDate)}</p>}
                                                                </div>
                                                            </div>
                                                        </Card>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <Card className="p-20 text-center">
                                                <div className="text-5xl mb-4">🏅</div>
                                                <h3 className="text-lg font-semibold mb-2">No Badges Yet</h3>
                                                <p className="text-muted">Complete challenges to earn badges</p>
                                            </Card>
                                        )}
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="favorites">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        <Card className="p-20 text-center">
                                            <div className="text-5xl mb-4">❤️</div>
                                            <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                                            <p className="text-muted">Posts you favorite will appear here</p>
                                        </Card>
                                    </motion.div>
                                </TabsContent>
                            </div>
                        </Tabs>
                    </div>
                </motion.div>
            </div>

            <AnimatePresence>
                {openedPost && (
                    <CommentsModal
                        post={openedPost}
                        comments={comments}
                        likedDrawings={likedPosts}
                        imageIndex={imageIndex}
                        newComment={newComment}
                        onChangeImageIndex={setImageIndex}
                        onChangeNewComment={setNewComment}
                        onSubmitComment={handleSubmitComment}
                        toggleLike={handleToggleLike}
                        onClose={closeModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}