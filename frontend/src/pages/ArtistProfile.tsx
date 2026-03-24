import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import { Calendar, Users, ExternalLink, Pencil } from "lucide-react";
import {
    FaPinterest,
    FaTwitter,
    FaDeviantart,
    FaYoutube,
    FaDiscord
} from "react-icons/fa";
import { Card } from "../components/ui/Card";
import { Badge as BadgeUI } from "../components/ui/Badge";
import { Button } from "../components/ui/BasicButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { formatDate, formatDuration } from "../utils/ProfilePageUtils";
import { usePost } from "../hooks/usePost";
import { CommentsModal, PostCard } from "../components/ui/ExplorePageComponents";
import { ImageWithFallback } from "../components/ui/ImageWithFallBack";
import { useAuth } from "../hooks/useAuth";
import type { Post } from "../types/PostTypes";
import paths from "../routes/paths";

export default function ArtistProfile() {
    const [activeTab, setActiveTab] = useState("posts");
    const [isFollowing, setIsFollowing] = useState(false);
    const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
    const [openedPost, setOpenedPost] = useState<any>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);

    const navigate = useNavigate();

    const { user } = useAuth();
    const { fetchUserPosts } = usePost();

    useEffect(() => {
        if (user?.id)
            fetchUserPosts(user.id)
                .then(data => { if (data) setUserPosts(data) });
    }, [user?.id]);

    const handleToggleLike = (postId: string) => {
        setLikedPosts(prev => {
            const next = new Set(prev);
            next.has(postId) ? next.delete(postId) : next.add(postId);
            return next;
        });
    };

    const handleOpenComments = (post: any) => setOpenedPost(post);
    const handleFollow = () => setIsFollowing(!isFollowing);

    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'pinterest': return <FaPinterest className="w-5 h-5" />;
            case 'x': return <FaTwitter className="w-5 h-5" />;
            case 'deviantart': return <FaDeviantart className="w-5 h-5" />;
            case 'youtube': return <FaYoutube className="w-5 h-5" />;
            case 'discord': return <FaDiscord className="w-5 h-5" />;
            default: return <ExternalLink className="w-5 h-5" />;
        }
    };

    if (!user) return null;

    return (
        <div className="flex flex-col flex-1 bg-background p-6 text-text">
            <div className="max-w-7xl mx-auto w-full px-6 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Header */}
                    <Card className="p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl overflow-hidden">
                                <ImageWithFallback
                                    src={user?.avatar}
                                    alt={user?.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                                    <h1 className="text-2xl font-bold">{user.username}</h1>
                                    <Button variant="outline" size="sm" onClick={() => navigate(paths.artist.edit_profile)}>
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                </div>

                                {user.bio && <p className="text-muted-foreground mb-3">{user.bio}</p>}

                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                    {user.location && <span>📍 {user.location}</span>}
                                    {user.website && (
                                        <a href={user.website} target="_blank" rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors flex items-center gap-1">
                                            <ExternalLink className="w-4 h-4" />
                                            {user.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                    <span>📅 Joined {formatDate(user.joinedDate)}</span>
                                </div>

                                <div className="flex gap-4 flex-wrap mb-4">
                                    <BadgeUI variant="secondary" className="text-sm">{userPosts.length} Posts</BadgeUI>
                                    <BadgeUI variant="secondary" className="text-sm">0 Followers</BadgeUI>
                                    <BadgeUI variant="secondary" className="text-sm">0 Following</BadgeUI>
                                </div>

                                {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                                    <div className="flex gap-3 flex-wrap">
                                        {user.socialLinks.pinterest && (
                                            <a href={user.socialLinks.pinterest} target="_blank" rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all">
                                                {getSocialIcon('pinterest')}
                                            </a>
                                        )}
                                        {user.socialLinks.x && (
                                            <a href={user.socialLinks.x} target="_blank" rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all">
                                                {getSocialIcon('x')}
                                            </a>
                                        )}
                                        {user.socialLinks.deviantart && (
                                            <a href={user.socialLinks.deviantart} target="_blank" rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all">
                                                {getSocialIcon('deviantart')}
                                            </a>
                                        )}
                                        {user.socialLinks.youtube && (
                                            <a href={user.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all">
                                                {getSocialIcon('youtube')}
                                            </a>
                                        )}
                                        {user.socialLinks.discord && (
                                            <div className="p-2 rounded-full bg-muted text-text cursor-pointer hover:bg-primary/20 hover:text-primary transition-all"
                                                title={`Discord: ${user.socialLinks.discord}`}
                                                onClick={() => navigator.clipboard.writeText(user.socialLinks!.discord!)}>
                                                {getSocialIcon('discord')}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Tabs */}
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="mb-6">
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="drawings">Drawings</TabsTrigger>
                            <TabsTrigger value="badges">Badges</TabsTrigger>
                        </TabsList>

                        {/* Posts Tab */}
                        <TabsContent value="posts">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                {userPosts.length === 0 ? (
                                    <Card className="p-12 text-center">
                                        <div className="text-5xl mb-4">📝</div>
                                        <h3 className="mb-2">No Posts Yet</h3>
                                        <p className="text-muted-foreground">This user hasn't posted anything yet</p>
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

                        {/* Badges Tab */}
                        <TabsContent value="badges">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                {user.badges && user.badges.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {user.badges.filter((b: any) => b.earned).map((badge: any, index: number) => (
                                            <motion.div
                                                key={badge.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.05 * index, duration: 0.3 }}
                                            >
                                                <Card className="p-6 hover:shadow-lg transition-all">
                                                    <div className="flex items-start gap-4">
                                                        <div className="text-4xl">{badge.icon}</div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h4>{badge.name}</h4>
                                                                <BadgeUI variant="default" className="text-xs h-5 border border-2">
                                                                    Earned
                                                                </BadgeUI>
                                                            </div>
                                                            <p className="text-sm mb-2">{badge.description}</p>
                                                            {badge.earnedDate && (
                                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                    <Calendar className="w-3 h-3" />
                                                                    {formatDate(badge.earnedDate)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-12 text-center">
                                        <div className="text-5xl mb-4">🏅</div>
                                        <h3 className="mb-2">No Badges Yet</h3>
                                        <p className="text-muted-foreground">This user hasn't earned any badges yet</p>
                                    </Card>
                                )}
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* Comments Modal */}
            <AnimatePresence>
                {openedPost && (
                    <CommentsModal
                        post={openedPost}
                        onClose={() => setOpenedPost(null)}
                        likedDrawings={likedPosts}
                        toggleLike={handleToggleLike}
                        initialImageIndex={0}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}