import { CalendarDays, ExternalLink, MapPin, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaDeviantart, FaDiscord, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AvatarFallback } from "../components/AvatarFallback";
import { Badge as BadgeUI } from "../components/Badge";
import { Card } from "../components/Card";
import { CommentsModal, PostCard } from "../components/ExplorePageComponents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { useAuth } from "../hooks/useAuth";
import { useComments } from "../hooks/useComments";
import { usePosts } from "../hooks/usePosts";
import { useSocialMedia } from "../hooks/useSocialMedia";
import paths from "../routes/paths";
import type { Comment } from "../types/CommentTypes";
import type { Post } from "../types/PostTypes";
import type { SocialMediaDto } from "../types/SocialMediaTypes";
import { formatDate, formatDuration } from "../utils/ProfilePageUtils";

export default function ArtistProfile() {
    // data
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [socialMedia, setSocialMedia] = useState<SocialMediaDto | null>(null);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
    const [comments, setComments] = useState<Comment[]>([]);

    // ui
    const [activeTab, setActiveTab] = useState("posts");
    const [openedPost, setOpenedPost] = useState<Post | null>(null);
    const [imageIndex, setImageIndex] = useState(0);
    const [newComment, setNewComment] = useState("");

    // hooks
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getUserPosts } = usePosts();
    const { getComments, postComment, loading: loadingComments } = useComments();
    const { getSocialMedia } = useSocialMedia();

    useEffect(() => {
        if (!currentUser?.id) return;
        getUserPosts(currentUser.id).then(data => { if (data) setUserPosts(data); });
        getSocialMedia(currentUser.id).then(data => { if (data) setSocialMedia(data); });
    }, [currentUser?.id]);

    useEffect(() => {
        if (userPosts.length === 0) return;
        userPosts.forEach((post) => {
            getComments(post.id)
                .then((data) => setCommentCounts(prev => ({ ...prev, [post.id]: data.length })))
                .catch(() => { });
        });
    }, [userPosts]);

    if (!currentUser) return null;

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
            authorAvatarUrl: raw.authorAvatarUrl,
            createdAt: raw.createdAt,
        };
        setComments(prev => [...prev, normalized]);
        setCommentCounts(prev => ({ ...prev, [postId]: (prev[postId] ?? 0) + 1 }));
        return normalized;
    };

    const closeModal = () => {
        setOpenedPost(null);
        setComments([]);
        setImageIndex(0);
        setNewComment("");
    };

    // ─── Derived ──────────────────────────────────────────
    const hasSocialLinks = !!socialMedia && Object.values(socialMedia).some(v => v && v !== currentUser.id);
    const earnedBadges = currentUser.badges ? currentUser.badges.filter((b: any) => b.isEarned) : [];
    const rankBadge = currentUser.level || "Advanced Sketcher";
    const streak = currentUser.streak ?? 0;
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

                            {/* Avatar */}
                            <div className="absolute -top-14 left-8">
                                <AvatarFallback
                                    src={currentUser.avatarUrl}
                                    alt={currentUser.username ?? ""}
                                    size={112}
                                    className="ring-4 ring-card shadow-lg"
                                />
                            </div>

                            {/* Edit profile */}
                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => navigate(paths.artist.edit_profile)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/30 text-sm font-medium text-text transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>

                            {/* Spacer for avatar */}
                            <div className="h-8" />

                            {/* Name & handle */}
                            <div className="mt-2">
                                <h1 className="text-2xl font-bold leading-tight">{currentUser.username}</h1>
                                <p className="text-sm text-muted mt-0.5">
                                    @{(currentUser.username ?? "artist").toLowerCase().replace(/\s/g, "")}
                                </p>
                            </div>

                            {/* Bio */}
                            {currentUser.bio && (
                                <p className="mt-3 text-sm text-text/80 leading-relaxed max-w-2xl">{currentUser.bio}</p>
                            )}

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-3 text-sm text-muted">
                                {currentUser.location && (
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 shrink-0" />
                                        {currentUser.location}
                                    </span>
                                )}
                                {currentUser.website && (
                                    <a href={currentUser.website} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-primary hover:underline transition-colors">
                                        <ExternalLink className="w-4 h-4 shrink-0" />
                                        {currentUser.website.replace(/^https?:\/\//, "")}
                                    </a>
                                )}
                                {currentUser.joinedDate && (
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="w-4 h-4 shrink-0" />
                                        Joined {formatDate(currentUser.joinedDate)}
                                    </span>
                                )}
                            </div>

                            {/* Social links */}
                            {hasSocialLinks && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {socialMedia!.twitter && (
                                        <a href={socialMedia!.twitter} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaTwitter className="w-4 h-4" />
                                        </a>
                                    )}
                                    {socialMedia!.pinterest && (
                                        <a href={socialMedia!.pinterest} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaPinterest className="w-4 h-4" />
                                        </a>
                                    )}
                                    {socialMedia!.deviantArt && (
                                        <a href={socialMedia!.deviantArt} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaDeviantart className="w-4 h-4" />
                                        </a>
                                    )}
                                    {socialMedia!.youTube && (
                                        <a href={socialMedia!.youTube} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaYoutube className="w-4 h-4" />
                                        </a>
                                    )}
                                    {socialMedia!.discord && (
                                        <button
                                            onClick={() => navigator.clipboard.writeText(socialMedia!.discord!)}
                                            title={`Copy: ${socialMedia!.discord}`}
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaDiscord className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* Followers / Following */}
                            <div className="flex items-center gap-1 mt-4 text-sm">
                                <span className="font-bold">{currentUser.followers?.length ?? 0}</span>
                                <span className="text-muted mr-4">Followers</span>
                                <span className="font-bold">{currentUser.following?.length ?? 0}</span>
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
                                    My Posts <span className="ml-1.5 text-xs opacity-60">{postsCount}</span>
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
                                                <h3 className="text-lg font-semibold mb-2">No Drawings Yet</h3>
                                                <p className="text-muted">Start practicing to see your drawings here</p>
                                            </Card>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {userPosts.map((post, index) => (
                                                    <PostCard
                                                        key={post.id}
                                                        post={post}
                                                        index={index}
                                                        isLiked={likedPosts.has(post.id)}
                                                        commentCount={commentCounts[post.id]}
                                                        onToggleLike={handleToggleLike}
                                                        onOpenComments={handleOpenComments}
                                                        formatDate={formatDate}
                                                        formatDuration={formatDuration}
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
                        loading={loadingComments}
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