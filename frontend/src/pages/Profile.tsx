// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Badge as BadgeUI } from "../components/ui/Badge";
import { Button } from "../components/ui/BasicButton";
import { TabsPage } from "../components/ui/ProfilePageComponents";
import { badges } from "../_mock/mockProfile";
import { LinkButton } from "../components/ui/LinkButton";
import Paths from "../routes/paths";
import { mockPosts } from "../_mock/mockPosts";
import { exploreImages } from "../_mock/mockExplorePage";
import { useUserService } from "../hooks/useUserService";
import type { ProfileData } from "../hooks/useUserService";

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("badges");
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const { getProfile } = useUserService();


    useEffect(() => {
        getProfile()
            .then(setProfile)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    // Posts still from mock for now — swap out when posts API is ready
    const currentUserPosts = profile
        ? mockPosts.filter(post => post.author === profile.username)
        : [];
    const currentUserDrawings: Record<string, string> = Object.fromEntries(
        currentUserPosts.map(post => [post.id, exploreImages[post.id]])
    );

    const openUploadDrawingModal = () => alert("Open upload drawing modal");
    const openUploadPostModal = () => alert("Open upload post modal");

    if (loading) return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
    if (!profile) return <div className="p-8 text-center text-muted-foreground">Could not load profile.</div>;

    return (
        <div className="flex flex-col flex-1 bg-background text-primary">
            <div className="max-w-7xl mx-auto w-full p-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="text-text p-8 mb-8">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-6">
                                {/* Avatar — shows image if set, emoji fallback otherwise */}
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl overflow-hidden">
                                    {profile.avatar
                                        ? <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
                                        : "🎨"
                                    }
                                </div>
                                <div className="flex-1">
                                    <h1 className="mb-2">{profile.username}</h1>
                                    <p className="text-muted-foreground mb-4">
                                        Member since {new Date(profile.joinedDate).toLocaleDateString()}
                                    </p>
                                    {profile.bio && (
                                        <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>
                                    )}
                                    <div className="flex gap-4 flex-wrap">
                                        <BadgeUI variant="secondary" className="text-sm">
                                            {profile.postsCount} Posts
                                        </BadgeUI>
                                        {profile.location && (
                                            <BadgeUI variant="secondary" className="text-sm">
                                                📍 {profile.location}
                                            </BadgeUI>
                                        )}
                                        {profile.website && (
                                            <a href={profile.website} target="_blank" rel="noreferrer">
                                                <BadgeUI variant="secondary" className="text-sm cursor-pointer">
                                                    🌐 Website
                                                </BadgeUI>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <LinkButton variant="primary" to={Paths.artist.edit_profile}>
                                Edit Profile
                            </LinkButton>
                        </div>
                    </Card>

                    <TabsPage
                        badges={badges}
                        currentUserDrawings={currentUserPosts}
                        userDrawingImages={currentUserDrawings}
                        activeTab={activeTab}
                        setActiveTab={setActiveTab}
                        renderUploadButtons={(tab) => {
                            if (tab === "drawings") return (
                                <div className="flex justify-end mb-4">
                                    <Button onClick={openUploadDrawingModal}>Upload Drawing</Button>
                                </div>
                            );
                            if (tab === "posts") return (
                                <div className="flex justify-end mb-4">
                                    <Button onClick={openUploadPostModal}>Upload Post</Button>
                                </div>
                            );
                            return null;
                        }}
                    />
                </motion.div>
            </div>
        </div>
    );
}