import { CalendarDays, ExternalLink, MapPin, Medal, Plus, Settings } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { FaDeviantart, FaDiscord, FaPinterest, FaTwitter, FaYoutube } from "react-icons/fa";
import { useNavigate } from "react-router";
import { AvatarFallback } from "../components/AvatarFallback";
import { Card } from "../components/Card";
import { CommentsModal, PostCard } from "../components/ExplorePageComponents";
import { CreatePostModal } from "../components/CreatePostModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";
import { useAuth } from "../hooks/useAuth";
import { usePosts } from "../hooks/usePosts";
import { useSocialMedia } from "../hooks/useSocialMedia";
import { usePostInteractions } from "../hooks/usePostInteractions";
import paths from "../routes/paths";
import type { PostDto } from "../types/PostTypes";
import type { SocialMediaDto } from "../types/SocialMediaTypes";
import { formatDate } from "../utils/FormatDateUtil";
import { type AwardedBadgeWithTemplate, type BadgeTier } from "../types/BadgeTypes";
import { useAwardedBadges } from "../hooks/useAwardedBadges";
import { BadgeCard } from "../components/badge/BadgeCard";

export default function ArtistProfile() {

    // ─── Data ─────────────────────────────────────────────
    const [userPosts, setUserPosts] = useState<PostDto[]>([]);
    const [socialMedia, setSocialMedia] = useState<SocialMediaDto | null>(null);
    const [awardedBadges, setAwardedBadges] = useState<AwardedBadgeWithTemplate[]>([]);  // <-- new


    // ─── UI ───────────────────────────────────────────────
    const [activeTab, setActiveTab] = useState("posts");
    const [showCreatePost, setShowCreatePost] = useState(false);

    // ─── Hooks ────────────────────────────────────────────
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { getUserPosts } = usePosts();
    const { getSocialMedia } = useSocialMedia();
    const {
        likedPosts, likeCounts, commentCounts,
        comments, openedPost, imageIndex, newComment,
        setImageIndex, setNewComment,
        initPostStates, fetchCommentCounts,
        handleLike, handleOpenComments, handleSubmitComment, closeModal,
    } = usePostInteractions();
    const { getAwardedBadgesByUserId } = useAwardedBadges();

    // ─── Fetch ────────────────────────────────────────────
    useEffect(() => {
        if (!currentUser?.id) return;

        getUserPosts(currentUser.id).then(data => {
            if (!data) return;
            setUserPosts(data);
            initPostStates(data);
            fetchCommentCounts(data);
        });

        getSocialMedia(currentUser.id).then(data => setSocialMedia(data));
        getAwardedBadgesByUserId(currentUser.id).then(data => setAwardedBadges(data));  // <-- new
    }, [currentUser?.id]);

    if (!currentUser) return null;

    // ─── Derived ──────────────────────────────────────────
    const hasSocialLinks = !!socialMedia && Object.values(socialMedia).some(v => v && v !== currentUser.id);
    const rankBadge = currentUser.level || "Advanced Sketcher";
    const streak = currentUser.streak ?? 0;
    const postsCount = userPosts.length;

    // ─── Render ───────────────────────────────────────────
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
                        <div className="h-36 w-full" style={{ backgroundColor: "var(--button)" }} />

                        <div className="px-8 pt-4 pb-6 relative">
                            <div className="absolute -top-14 left-8">
                                <AvatarFallback
                                    src={currentUser.avatarUrl}
                                    alt={currentUser.username ?? ""}
                                    size={112}
                                    className="ring-4 ring-card shadow-lg"
                                />
                            </div>

                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => navigate(paths.artist.edit_profile)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/30 text-sm font-medium text-text transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>

                            <div className="h-8" />

                            <div className="mt-2">
                                <h1 className="text-2xl font-bold leading-tight">{currentUser.username}</h1>
                                <p className="text-sm text-muted mt-0.5">
                                    @{(currentUser.username ?? "artist").toLowerCase().replace(/\s/g, "")}
                                </p>
                            </div>

                            {currentUser.bio && (
                                <p className="mt-3 text-sm text-text/80 leading-relaxed max-w-2xl">{currentUser.bio}</p>
                            )}

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

                            <div className="flex items-center gap-1 mt-4 text-sm">
                                <span className="font-bold">{currentUser.followers?.length ?? 0}</span>
                                <span className="text-muted mr-4">Followers</span>
                                <span className="font-bold">{currentUser.following?.length ?? 0}</span>
                                <span className="text-muted">Following</span>
                            </div>

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
                                    <span className="text-2xl font-bold">{awardedBadges.length}</span>
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
                                    Badges <span className="ml-1.5 text-xs opacity-60">{awardedBadges.length}</span>
                                </TabsTrigger>
                                <TabsTrigger value="favorites" className="h-full text-sm font-semibold">
                                    Favorites <span className="ml-1.5 text-xs opacity-60">0</span>
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-5">
                                <TabsContent value="posts">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        <div className="columns-2 sm:columns-3 lg:columns-4 gap-2.5">
                                            {/* New Post card — always first */}
                                            <motion.button
                                                initial={{ opacity: 0, y: 12 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                onClick={() => setShowCreatePost(true)}
                                                className="break-inside-avoid mb-2.5 w-full relative rounded-xl overflow-hidden border border-dashed border-border hover:border-primary/60 transition-all group flex flex-col items-center justify-center gap-3 bg-background"
                                                style={{ height: 140 }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 group-hover:from-primary/10 group-hover:to-primary/20 transition-all" />
                                                <div className="relative z-10 flex flex-col items-center gap-2">
                                                    <div className="w-9 h-9 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                                                        <Plus className="w-4 h-4 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-bold text-text">New Post</span>
                                                    <span className="text-xs text-muted">Share your artwork</span>
                                                </div>
                                            </motion.button>

                                            {userPosts.map((post, index) => (
                                                <PostCard
                                                    key={post.id}
                                                    post={post}
                                                    index={index + 1}
                                                    isLiked={likedPosts.has(post.id)}
                                                    likeCount={likeCounts[post.id] ?? post.likes}
                                                    commentCount={commentCounts[post.id]}
                                                    onToggleLike={handleLike}
                                                    onOpenComments={handleOpenComments}
                                                    formatDate={formatDate}
                                                />
                                            ))}
                                        </div>
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="badges">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm text-muted">{awardedBadges.length} badge{awardedBadges.length !== 1 ? "s" : ""} earned</p>
                                            <button
                                                onClick={() => navigate(paths.badge_templates)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted/30 text-xs font-medium text-text transition-colors"
                                            >
                                                <Medal className="w-3.5 h-3.5" />
                                                View All Badges
                                            </button>
                                        </div>

                                        {awardedBadges.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {awardedBadges.map((badge, index) => (
                                                    <motion.div
                                                        key={badge.id}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.05 * index, duration: 0.3 }}
                                                    >
                                                        <BadgeCard
                                                            title={badge.title}
                                                            iconUrl={badge.iconUrl}
                                                            tier={badge.tier as BadgeTier}
                                                            description={badge.description}
                                                        />
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
                {showCreatePost && (
                    <CreatePostModal
                        onClose={() => setShowCreatePost(false)}
                        userPosts={userPosts}
                        onCreated={post => {
                            setUserPosts(prev => [post, ...prev]);
                            initPostStates([post, ...userPosts]);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {openedPost && (
                    <CommentsModal
                        post={openedPost}
                        comments={comments}
                        imageIndex={imageIndex}
                        newComment={newComment}
                        isLiked={likedPosts.has(openedPost.id)}
                        likeCount={likeCounts[openedPost.id] ?? openedPost.likes}
                        onToggleLike={handleLike}
                        onChangeImageIndex={setImageIndex}
                        onChangeNewComment={setNewComment}
                        onSubmitComment={handleSubmitComment}
                        onClose={closeModal}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}