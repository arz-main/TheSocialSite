import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Save, Palette, CheckCircle2, X, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "../components/BasicButton";
import { Card } from "../components/Card";
import { Input } from "../components/BasicInput";
import { Label } from "../components/LabelComponent";
import { Textarea } from "../components/TextArea";
import paths from "../routes/paths";
import { useAuth } from "../hooks/useAuth";
import { useUsers } from "../hooks/useUsers";
import { useSocialMedia } from "../hooks/useSocialMedia";
import type { EditProfileForm } from "../types/UserTypes";
import { defaultEditProfileForm } from "../types/UserTypes";
import type { SocialMediaDto } from "../types/SocialMediaTypes";
import LoadingScreen from "../components/LoadingScreen";

const socialPlatforms: { key: keyof EditProfileForm["socialMedia"]; label: string; type: string }[] = [
    { key: "twitter",    label: "Twitter / X", type: "url"  },
    { key: "pinterest",  label: "Pinterest",   type: "url"  },
    { key: "deviantArt", label: "DeviantArt",  type: "url"  },
    { key: "youTube",    label: "YouTube",     type: "url"  },
    { key: "discord",    label: "Discord",     type: "text" },
];

export default function EditProfile() {
    const navigate = useNavigate();
    const { user, logout, refreshUser } = useAuth();
    const { getUser, updateUser, deleteUser } = useUsers();
    const { getSocialMedia, createSocialMedia, updateSocialMedia } = useSocialMedia();

    const [form, setForm] = useState<EditProfileForm>(defaultEditProfileForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [hasSocialRecord, setHasSocialRecord] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!user?.id) return;

        const fetchData = async () => {
            try {
                const userData = await getUser(user.id);
                if (!userData) throw new Error("User not found");

                const social = await getSocialMedia(user.id);
                const socialExists = !!social && Object.values(social).some(val => val !== "");

                setHasSocialRecord(socialExists);
                setForm({
                    username:    userData.username  ?? "",
                    email:       userData.email     ?? "",
                    bio:         userData.bio       ?? "",
                    location:    userData.location  ?? "",
                    website:     userData.website   ?? "",
                    avatar:      userData.avatar    ?? null,
                    socialMedia: {
                        twitter:    social?.twitter    ?? "",
                        pinterest:  social?.pinterest  ?? "",
                        deviantArt: social?.deviantArt ?? "",
                        youTube:    social?.youTube    ?? "",
                        discord:    social?.discord    ?? "",
                    },
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Could not load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "bio" && value.length > 500) return;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (key: keyof EditProfileForm["socialMedia"], value: string) => {
        setForm(prev => ({
            ...prev,
            socialMedia: { ...prev.socialMedia, [key]: value },
        }));
    };

    const handleAvatarClick = () => fileInputRef.current?.click();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setError("Image must be smaller than 5 MB.");
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            setForm(prev => ({ ...prev, avatar: reader.result as string }));
            setError(null);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) return;

        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            await updateUser(user.id, {
                username: form.username,
                email:    form.email,
                bio:      form.bio,
                location: form.location,
                website:  form.website,
                avatar:   form.avatar,
            });

            const socialPayload: SocialMediaDto = {
                userId: user.id,
                ...form.socialMedia,
            };

            if (hasSocialRecord) {
                await updateSocialMedia(socialPayload);
            } else {
                await createSocialMedia(socialPayload);
                setHasSocialRecord(true);
            }

            await refreshUser();
            setSuccess(true);
            navigate(paths.artist.profile);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!user?.id) return;
        setDeleting(true);
        setError(null);
        try {
            await deleteUser(user.id);
            logout();
            navigate(paths.home);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to delete account.");
            setShowDeleteDialog(false);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <LoadingScreen />;

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

                            {/* Error / Success banners */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        key="error"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 text-danger text-sm"
                                    >
                                        <span>{error}</span>
                                        <button type="button" onClick={() => setError(null)}>
                                            <X className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                )}
                                {success && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-600 text-sm"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Profile saved! Redirecting…</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Profile Picture */}
                            <div>
                                <Label className="mb-4 block">Profile Picture</Label>
                                <div className="flex items-center gap-6">
                                    <div className="relative">
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl overflow-hidden">
                                            {form.avatar
                                                ? <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                                                : <Palette />
                                            }
                                        </div>
                                        <motion.button
                                            type="button"
                                            onClick={handleAvatarClick}
                                            className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
                                            whileTap={{ scale: 0.9 }}
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                            aria-label="Upload profile picture"
                                        >
                                            <Camera color="white" className="w-4 h-4" />
                                        </motion.button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        JPG, PNG or GIF · Max 5 MB
                                    </p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                            </div>

                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input id="username" name="username" type="text"
                                        value={form.username} onChange={handleChange} required className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" name="email" type="email"
                                        value={form.email} onChange={handleChange} required className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input id="location" name="location" type="text"
                                        value={form.location} onChange={handleChange} placeholder="City, Country" className="bg-background" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input id="website" name="website" type="url"
                                        value={form.website} onChange={handleChange} placeholder="https://yourwebsite.com" className="bg-background" />
                                </div>
                            </div>

                            {/* Bio */}
                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea id="bio" name="bio"
                                    value={form.bio} onChange={handleChange} rows={4}
                                    placeholder="Tell us about yourself…" className="bg-background" />
                                <p className={`text-sm ${form.bio.length >= 500 ? "text-danger" : "text-muted-foreground"}`}>
                                    {form.bio.length}/500 characters
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
                                    {socialPlatforms.map(({ key, label, type }) => (
                                        <div key={key} className="space-y-2">
                                            <Label htmlFor={key}>{label}</Label>
                                            <Input
                                                id={key}
                                                type={type}
                                                value={form.socialMedia[key] ?? ""}
                                                onChange={e => handleSocialChange(key, e.target.value)}
                                                placeholder={type === "url" ? `https://${key}.com/yourprofile` : `Your ${label} username`}
                                                className="bg-background"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4 pt-4">
                                <motion.div
                                    className="flex-1"
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
                                    <Button type="submit" className="w-full h-11" disabled={saving || success}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {saving ? "Saving…" : "Save Changes"}
                                    </Button>
                                </motion.div>
                                <motion.div
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                >
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
                    <Card className="w-full p-8 mt-6 border border-danger/30">
                        <div className="flex items-center gap-2 mb-1">
                            <AlertTriangle className="w-4 h-4 text-danger" />
                            <h3 className="font-semibold text-danger">Danger Zone</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-5">
                            Permanently delete your account and all your data. This cannot be undone.
                        </p>
                        <motion.div
                            whileTap={{ scale: 0.98 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            className="inline-block"
                        >
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 border-danger/50 text-danger hover:bg-danger/10 hover:border-danger"
                                onClick={() => setShowDeleteDialog(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </motion.div>
                    </Card>

                </motion.div>
            </div>

            {/* Confirm Delete Dialog */}
            <AnimatePresence>
                {showDeleteDialog && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-40"
                            onClick={() => !deleting && setShowDeleteDialog(false)}
                        />
                        <motion.div
                            key="dialog"
                            initial={{ opacity: 0, scale: 0.95, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 8 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
                        >
                            <Card className="p-6 shadow-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                                        <Trash2 className="w-5 h-5 text-danger" />
                                    </div>
                                    <h3 className="text-lg font-semibold">Delete Account</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Are you sure you want to delete your account? All your posts, badges, and data will be permanently removed.{" "}
                                    <span className="font-medium text-text">This cannot be undone.</span>
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10"
                                        onClick={() => setShowDeleteDialog(false)}
                                        disabled={deleting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        className="h-10 bg-danger hover:bg-danger/90 text-white"
                                        onClick={handleDelete}
                                        disabled={deleting}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        {deleting ? "Deleting…" : "Yes, Delete"}
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}