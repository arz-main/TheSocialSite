import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { ExternalLink, MapPin, CalendarDays, Settings } from "lucide-react";
import {
    FaPinterest,
    FaTwitter,
    FaDeviantart,
    FaYoutube,
    FaDiscord,
    FaGlobe,
} from "react-icons/fa";
import { Badge as BadgeUI } from "../components/ui/Badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { formatDate, formatDuration } from "../utils/ProfilePageUtils";
import { usePost } from "../hooks/usePost";
import { CommentsModal, PostCard } from "../components/ui/ExplorePageComponents";
import { ImageWithFallback } from "../components/ui/ImageWithFallBack";
import { useAuth } from "../hooks/useAuth";
import type { Post } from "../types/PostTypes";
import paths from "../routes/paths";
import { Card } from "../components/ui/Card";

export default function ArtistProfile() {
    const [activeTab, setActiveTab] = useState("posts");
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [openedPost, setOpenedPost] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    const navigate = useNavigate();
    const { user } = useAuth();
    const { fetchUserPosts } = usePost();

    useEffect(() => {
        if (user?.id)
            fetchUserPosts(user.id)
                .then(data => { if (data) setUserPosts(data); console.log(data); });
    }, [user?.id]);

    const handleToggleLike = (postId: string) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return next;
        });
    };

    const handleOpenComments = (post: any) => setOpenedPost(post);

    const DUMMY_BIO =
        "Digital artist and illustrator passionate about character design and anatomy studies. Always learning, always creating.";

    if (!user) return null;

    const bio = user.bio || DUMMY_BIO;
    const hasSocialLinks = user.socialLinks && Object.values(user.socialLinks).some(Boolean);
    const earnedBadges = user.badges ? user.badges.filter((b: any) => b.earned) : [];
    const rankBadge = user.level || "Advanced Sketcher";
    const streak = user.streak ?? 15;
    const postsCount = userPosts.length || 387;

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
                        <div className="h-36 w-full" style={{ backgroundColor: 'var(--button)' }} />

                        {/* Profile body */}
                        <div className="px-8 pb-8 relative">
                            {/* Avatar overlapping banner */}
                            <div className="absolute -top-14 left-8 w-28 h-28 rounded-full bg-card ring-4 ring-card overflow-hidden shadow-lg">
                                <ImageWithFallback
                                    src={user?.avatar}
                                    alt={user?.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Edit profile top-right */}
                            <div className="flex justify-end pt-3">
                                <button
                                    onClick={() => navigate(paths.artist.edit_profile)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/30 text-sm font-medium text-text transition-colors"
                                >
                                    <Settings className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>

                            {/* Name & handle */}
                            <div className="mt-8">
                                <h1 className="text-2xl font-bold leading-tight">{user.username}</h1>
                                <p className="text-sm text-muted mt-0.5">@{(user.username || "artist").toLowerCase().replace(/\s/g, "")}</p>
                            </div>

                            {/* Bio */}
                            <p className="mt-3 text-sm text-text/80 leading-relaxed max-w-2xl">{bio}</p>

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
                                        {user.website.replace(/^https?:\/\//, '')}
                                    </a>
                                )}
                                <span className="flex items-center gap-1.5">
                                    <CalendarDays className="w-4 h-4 shrink-0" />
                                    Joined {formatDate(user.joinedDate)}
                                </span>
                            </div>

                            {/* Social icon buttons */}
                            {hasSocialLinks && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {user.socialLinks!.x && (
                                        <a href={user.socialLinks!.x} target="_blank" rel="noopener noreferrer"
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
                                    {user.socialLinks!.deviantart && (
                                        <a href={user.socialLinks!.deviantart} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaDeviantart className="w-4 h-4" />
                                        </a>
                                    )}
                                    {user.socialLinks!.youtube && (
                                        <a href={user.socialLinks!.youtube} target="_blank" rel="noopener noreferrer"
                                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-border bg-card hover:bg-muted/30 text-muted hover:text-text transition-colors">
                                            <FaYoutube className="w-4 h-4" />
                                        </a>
                                    )}
                                    {user.socialLinks!.discord && (
                                        <button onClick={() => navigator.clipboard.writeText(user.socialLinks!.discord!)}
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
                                <span className="font-bold">1.2K</span>
                                <span className="text-muted mr-4">Followers</span>
                                <span className="font-bold">342</span>
                                <span className="text-muted">Following</span>
                            </div>

                            {/* Stats pills row */}
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
                                    <span className="text-2xl font-bold">{earnedBadges.length || 4}</span>
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
                                    Badges <span className="ml-1.5 text-xs opacity-60">{earnedBadges.length || 4}</span>
                                </TabsTrigger>
                                <TabsTrigger value="favorites" className="h-full text-sm font-semibold">
                                    Favorites <span className="ml-1.5 text-xs opacity-60">12</span>
                                </TabsTrigger>
                            </TabsList>

                            <div className="mt-5">
                                <TabsContent value="posts">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        {userPosts.length === 0 ? (
                                            <Card className="p-20 text-center">
                                                <div className="text-5xl mb-4">🎨</div>
                                                <h3 className="text-lg font-semibold mb-2">No Drawings Yet</h3>
                                                <p className="text-muted-foreground">Start practicing to see your drawings here</p>
                                            </Card>
                                        ) : (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {userPosts.map((post, index) => (
                                                    <PostCard
                                                        key={post.id}
                                                        post={post}
                                                        index={index}
                                                        pageSize={userPosts.length}
                                                        isLiked={likedPosts.has(post.id)}
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
                                        {user.badges && user.badges.filter((b: any) => b.earned).length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {user.badges.filter((b: any) => b.earned).map((badge: any, index: number) => (
                                                    <motion.div key={badge.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * index, duration: 0.3 }}>
                                                        <Card className="p-5 hover:shadow-lg transition-all">
                                                            <div className="flex items-start gap-4">
                                                                <div className="text-4xl">{badge.icon}</div>
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <h4 className="font-semibold">{badge.name}</h4>
                                                                        <BadgeUI variant="default" className="text-xs border border-2">Earned</BadgeUI>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                                                                    {badge.earnedDate && <p className="text-xs text-muted-foreground">{formatDate(badge.earnedDate)}</p>}
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
                                                <p className="text-muted-foreground">Complete challenges to earn badges</p>
                                            </Card>
                                        )}
                                    </motion.div>
                                </TabsContent>

                                <TabsContent value="favorites">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                        <Card className="p-20 text-center">
                                            <div className="text-5xl mb-4">❤️</div>
                                            <h3 className="text-lg font-semibold mb-2">No Favorites Yet</h3>
                                            <p className="text-muted-foreground">Posts you favorite will appear here</p>
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
                        onClose={() => setOpenedPost(null)}
                        likedDrawings={likedPosts}
                        toggleLike={handleToggleLike}
                        initialImageIndex={0}
                        onSubmitComment={}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}