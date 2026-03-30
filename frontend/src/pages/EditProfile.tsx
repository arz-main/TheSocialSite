import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Camera, Save, Palette } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/BasicInput";
import { Label } from "../components/ui/LabelComponent";
import { Textarea } from "../components/ui/TextArea";
import paths from "../routes/paths";
import { useUsers } from "../hooks/useUsers";
import { useAuth } from "../hooks/useAuth";
import type { UpdateUserPayload, SocialLinks } from "../types/UserTypes";
import LoadingScreen from "../components/ui/LoadingScreen";
import ErrorScreen from "../components/ui/ErrorScreen";

type ProfileForm = {
    username: string;
    email: string;
    bio: string;
    location: string;
    website: string;
    avatar: string | null;
    socialLinks: SocialLinks;
};

const defaultForm: ProfileForm = {
    username: "",
    email: "",
    bio: "",
    location: "",
    website: "",
    avatar: null,
    socialLinks: {
        pinterest: "",
        twitter: "",
        deviantArt: "",
        youTube: "",
        discord: ""
    }
};

export default function EditProfile() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getUser, updateUser } = useUsers();
    const [profileData, setProfileData] = useState<ProfileForm>(defaultForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user?.id) return;
        getUser(user.id)
            .then(data => {
                setProfileData({
                    username: data.username ?? "",
                    email: data.email ?? "",
                    bio: data.bio ?? "",
                    location: data.location ?? "",
                    website: data.website ?? "",
                    avatar: data.avatar ?? null,
                    socialLinks: {
                        pinterest: data.socialLinks?.pinterest ?? "",
                        twitter: data.socialLinks?.x ?? "",
                        deviantArt: data.socialLinks?.deviantart ?? "",
                        youTube: data.socialLinks?.youtube ?? "",
                        discord: data.socialLinks?.discord ?? ""
                    }
                });
            })
            .catch(() => setError("Could not load profile."))
            .finally(() => setLoading(false));
    }, [user?.id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;
        setSaving(true);
        setError(null);
        try {
            const payload: UpdateUserPayload = {
                username: profileData.username,
                email: profileData.email,
                bio: profileData.bio,
                location: profileData.location,
                website: profileData.website,
                avatar: profileData.avatar ?? undefined,
                socialLinks: profileData.socialLinks
            };
            await updateUser(user.id, payload);
            navigate(paths.artist.profile);
        } catch (err: any) {
            setError(err.message ?? "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleSocialChange = (platform: keyof SocialLinks, value: string) => {
        setProfileData({
            ...profileData,
            socialLinks: { ...profileData.socialLinks, [platform]: value }
        });
    };

    if (loading) return <LoadingScreen/>
    if (error) return <ErrorScreen/>
    
    return (
        <div className="bg-background text-text">
            <div className="p-6">
                <motion.div
                    className="px-6 md:px-12 lg:px-16 w-full max-w-5xl mx-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="w-full p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 text-danger text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Profile Picture */}
                            <div>
                                <Label className="mb-4 block">Profile Picture</Label>
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl overflow-hidden">
                                            {profileData.avatar
                                                ? <img src={profileData.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                : <Palette />
                                            }
                                        </div>
                                        <motion.button
                                            type="button"
                                            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                                            whileTap={{ scale: 0.9 }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                        >
                                            <Camera color="white" className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" name="username" type="text"
                                        value={profileData.username} onChange={handleChange}
                                        required className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email"
                                        value={profileData.email} onChange={handleChange}
                                        required className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" type="text"
                                        value={profileData.location} onChange={handleChange}
                                        placeholder="City, Country" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" name="website" type="url"
                                        value={profileData.website} onChange={handleChange}
                                        placeholder="https://yourwebsite.com" className="bg-background" />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" name="bio"
                                    value={profileData.bio} onChange={handleChange}
                                    rows={4} placeholder="Tell us about yourself..."
                                    className="bg-background" />
                                <p className="text-sm text-muted-foreground">
                                    {profileData.bio.length}/500 characters
                                </p>
                            </div>

                            {/* Social Links */}
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-lg font-semibold">Social Links (Optional)</Label>
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Add your social media profiles. Leave blank to hide.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="pinterest">Pinterest</Label>
                                        <Input id="pinterest" type="url"
                                            value={profileData.socialLinks.pinterest ?? ""}
                                            onChange={e => handleSocialChange("pinterest", e.target.value)}
                                            placeholder="https://pinterest.com/username"
                                            className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="twitter">X (Twitter)</Label>
                                        <Input id="twitter" type="url"
                                            value={profileData.socialLinks.twitter ?? ""}
                                            onChange={e => handleSocialChange("twitter", e.target.value)}
                                            placeholder="https://x.com/username"
                                            className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="deviantArt">DeviantArt</Label>
                                        <Input id="deviantArt" type="url"
                                            value={profileData.socialLinks.deviantArt ?? ""}
                                            onChange={e => handleSocialChange("deviantArt", e.target.value)}
                                            placeholder="https://deviantart.com/username"
                                            className="bg-background" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="youTube">YouTube</Label>
                                        <Input id="youTube" type="url"
                                            value={profileData.socialLinks.youTube ?? ""}
                                            onChange={e => handleSocialChange("youTube", e.target.value)}
                                            placeholder="https://youtube.com/@username"
                                            className="bg-background" />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="discord">Discord</Label>
                                        <Input id="discord" type="text"
                                            value={profileData.socialLinks.discord ?? ""}
                                            onChange={e => handleSocialChange("discord", e.target.value)}
                                            placeholder="username#1234"
                                            className="bg-background" />
                                        <p className="text-xs text-muted-foreground">
                                            Your Discord username (e.g., username#1234)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <motion.div className="flex-1"
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                                    <Button type="submit" className="w-full h-11" disabled={saving}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? "Saving..." : "Save Changes"}
                                    </Button>
                                </motion.div>
                                <motion.div whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}>
                                    <Link to={paths.artist.profile} className="block">
                                        <Button variant="outline" className="h-11" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </form>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="text-text p-6 mt-8 border-destructive/50">
                        <h3 className="mb-4">Danger Zone</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg">
                                <div>
                                    <div className="text-danger mb-1">Delete Account</div>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all your data
                                    </p>
                                </div>
                                <Button variant="danger" size="lg">Delete</Button>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}