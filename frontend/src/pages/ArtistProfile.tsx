import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, Heart, ArrowLeft, Users, ExternalLink } from "lucide-react";
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
import { ImageWithFallback } from "../utils/imageWithFallback";
import { formatDate, formatDuration } from "../utils/profileUtils";
import { userDrawingImages } from "../_mock/mockProfilePostImages";
import { badges, currentUserDrawings } from "../_mock/mockProfile";
import { getUserById, mockUsers } from "../_mock/mockUsers";
import Paths from "../routes/paths";



export default function UserProfile() {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("posts");
    const [isFollowing, setIsFollowing] = useState(false);

    // Get user data from mockUsers
    const user = userId ? getUserById(userId) : null; if (!user) { return <Navigate to={Paths.error.not_found} replace />; }


    const handleFollow = () => {
        setIsFollowing(!isFollowing);
        // In a real app, this would update the backend
    };

    const getSocialIcon = (platform: string) => {
        switch (platform) {
            case 'pinterest':
                return <FaPinterest className="w-5 h-5" />;
            case 'x':
                return <FaTwitter className="w-5 h-5" />;
            case 'deviantart':
                return <FaDeviantart className="w-5 h-5" />;
            case 'youtube':
                return <FaYoutube className="w-5 h-5" />;
            case 'discord':
                return <FaDiscord className="w-5 h-5" />;
            default:
                return <ExternalLink className="w-5 h-5" />;
        }
    };

    return (
        <div className="flex flex-col flex-1 bg-background text-primary">
            {/* Back Button */}
            <div className="p-6 pb-0">
                <motion.button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-text hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5" />
                </motion.button>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 pb-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Profile Header */}
                    <Card className="text-text p-8 mb-8">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar */}
                            <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                                {user.avatar ? (
                                    <img
                                        src={user.avatar}
                                        alt={user.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl">
                                        {user.name.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
                                    <h1 className="text-2xl font-bold">{user.name}</h1>
                                    <motion.div
                                        whileTap={{ scale: 0.95 }}
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <Button
                                            variant={isFollowing ? "outline" : "default"}
                                            size="sm"
                                            onClick={handleFollow}
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            {isFollowing ? "Following" : "Follow"}
                                        </Button>
                                    </motion.div>
                                </div>

                                {/* Bio */}
                                {user.bio && (
                                    <p className="text-muted-foreground mb-3">{user.bio}</p>
                                )}

                                {/* Location and Website */}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                                    {user.location && <span>?? {user.location}</span>}
                                    {user.website && (
                                        <a
                                            href={user.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-primary transition-colors flex items-center gap-1"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            {user.website.replace(/^https?:\/\//, '')}
                                        </a>
                                    )}
                                    <span>?? Joined {formatDate(user.joinedDate)}</span>
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 flex-wrap mb-4">
                                    <BadgeUI variant="secondary" className="text-sm">
                                        {user.postsCount} Posts
                                    </BadgeUI>
                                    <BadgeUI variant="secondary" className="text-sm">
                                        {user.followers.length} Followers
                                    </BadgeUI>
                                    <BadgeUI variant="secondary" className="text-sm">
                                        {user.following.length} Following
                                    </BadgeUI>
                                </div>

                                {/* Social Links */}
                                {user.socialLinks && Object.keys(user.socialLinks).length > 0 && (
                                    <div className="flex gap-3 flex-wrap">
                                        {user.socialLinks.pinterest && (
                                            <a
                                                href={user.socialLinks.pinterest}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all"
                                                title="Pinterest"
                                            >
                                                {getSocialIcon('pinterest')}
                                            </a>
                                        )}
                                        {user.socialLinks.x && (
                                            <a
                                                href={user.socialLinks.x}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all"
                                                title="X (Twitter)"
                                            >
                                                {getSocialIcon('x')}
                                            </a>
                                        )}
                                        {user.socialLinks.deviantart && (
                                            <a
                                                href={user.socialLinks.deviantart}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all"
                                                title="DeviantArt"
                                            >
                                                {getSocialIcon('deviantart')}
                                            </a>
                                        )}
                                        {user.socialLinks.youtube && (
                                            <a
                                                href={user.socialLinks.youtube}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 rounded-full bg-muted hover:bg-primary/20 text-text hover:text-primary transition-all"
                                                title="YouTube"
                                            >
                                                {getSocialIcon('youtube')}
                                            </a>
                                        )}
                                        {user.socialLinks.discord && (
                                            <div
                                                className="p-2 rounded-full bg-muted text-text cursor-pointer hover:bg-primary/20 hover:text-primary transition-all"
                                                title={`Discord: ${user.socialLinks.discord}`}
                                                onClick={() => navigator.clipboard.writeText(user.socialLinks!.discord!)}
                                            >
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
                        <TabsList className="text-text mb-6">
                            <TabsTrigger value="posts">Posts</TabsTrigger>
                            <TabsTrigger value="badges">Badges</TabsTrigger>
                        </TabsList>

                        {/* Posts Tab */}
                        <TabsContent className="text-text" value="posts">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {currentUserDrawings.slice(0, 6).map((drawing, index) => (
                                        <motion.div
                                            key={drawing.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.1 * index, duration: 0.3 }}
                                        >
                                            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                                                <div className="aspect-square bg-muted overflow-hidden">
                                                    <ImageWithFallback
                                                        src={userDrawingImages[drawing.id]}
                                                        alt={`Drawing ${drawing.id}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <BadgeUI variant="secondary" className="text-xs">
                                                            {drawing.category}
                                                        </BadgeUI>
                                                        <span className="text-sm text-muted-foreground">
                                                            {formatDuration(drawing.duration)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {drawing.likes}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {formatDate(drawing.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </TabsContent>

                        {/* Badges Tab */}
                        <TabsContent value="badges">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {badges.filter(b => b.earned).map((badge, index) => (
                                        <motion.div
                                            key={badge.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.05 * index, duration: 0.3 }}
                                        >
                                            <Card className="p-6 hover:shadow-lg transition-all">
                                                <div className="flex items-start gap-4">
                                                    <div className="text-4xl">{badge.icon}</div>
                                                    <div className="text-text flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h4>{badge.name}</h4>
                                                            <BadgeUI
                                                                variant="default"
                                                                className="text-white text-xs h-5 border border-2"
                                                            >
                                                                Earned
                                                            </BadgeUI>
                                                        </div>
                                                        <p className="text-sm mb-2">
                                                            {badge.description}
                                                        </p>
                                                        {badge.earnedDate && (
                                                            <div className="flex items-center gap-1 text-xs">
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
                            </motion.div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>
        </div>
    );
}