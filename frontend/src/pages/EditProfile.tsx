import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Camera, Save } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../utils/input";
import { Label } from "../utils/label";
import { Textarea } from "../components/ui/TextArea";
import Paths from "../routes/paths";

export default function EditProfilePage() {
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState({
		username: "Your Name",
		email: "your@email.com",
		description:
			"Aspiring artist on a journey to improve my skills. Love sketching and exploring new techniques!",
		location: "New York, USA",
		website: "https://yourwebsite.com",
	});

	const [profileImage, setProfileImage] = useState("🎨");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle profile update logic here
		console.log("Update profile:", profileData);
		// Navigate back to profile
		navigate("/profile");
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setProfileData({
			...profileData,
			[e.target.name]: e.target.value,
		});
	};

	const handleImageClick = () => {
		// In a real app, this would open a file picker
		const emojis = ["🎨", "✏️", "🖌️", "🖍️", "🎭", "🌟", "💫", "🔥", "⚡", "🌈"];
		const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
		setProfileImage(randomEmoji);
	};

	return (
		<div className="min-h-screen p-6 bg-background text-text">
			<h1 className="text-text text-3xl font-bold mb-8">Edit Profile</h1>
			<div className="max-w-3xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="p-8">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Profile Picture */}
							<div>
								<Label className="mb-4 block">Profile Picture</Label>
								<div className="flex items-center gap-6">
									<div className="relative">
										<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl">
											{profileImage}
										</div>
										<motion.button
											type="button"
											onClick={handleImageClick}
											className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors"
											whileTap={{ scale: 0.9 }}
											whileHover={{ scale: 1.1 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 17,
											}}
										>
											<Camera color={"white"} className="w-4 h-4" />
										</motion.button>
									</div>
								</div>
							</div>

							{/* Username */}
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<Input
									id="username"
									name="username"
									type="text"
									value={profileData.username}
									onChange={handleChange}
									required
									className="bg-background"
								/>
							</div>

							{/* Email */}
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={profileData.email}
									onChange={handleChange}
									required
									className="bg-background"

								/>
								<p className="text-sm text-muted-foreground">
									Your email is private and won't be shown on your profile
								</p>
							</div>

							{/* Description */}
							<div className="space-y-2">
								<Label htmlFor="description">Bio</Label>
								<Textarea
									id="description"
									name="description"
									value={profileData.description}
									onChange={handleChange}
									rows={4}
									placeholder="Tell us about yourself..."
									className="bg-background"

								/>
								<p className="text-sm text-muted-foreground">
									{profileData.description.length}/500 characters
								</p>
							</div>

							{/* Location */}
							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									name="location"
									type="text"
									value={profileData.location}
									onChange={handleChange}
									placeholder="City, Country"
									className="bg-background"

								/>
							</div>

							{/* Website */}
							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input
									id="website"
									name="website"
									type="url"
									value={profileData.website}
									onChange={handleChange}
									placeholder="https://yourwebsite.com"
									className="bg-background"

								/>
							</div>

							{/* Action Buttons */}
							<div className="flex gap-4 pt-4 text-text">
								<motion.div
									className="flex-1"
									whileTap={{ scale: 0.98 }}
									transition={{ type: "spring", stiffness: 400, damping: 17 }}
								>
									<Button type="submit" className="w-full h-11">
										<Save className="w-4 h-4 mr-2" />
										Save Changes
									</Button>
								</motion.div>
								<motion.div
									whileTap={{ scale: 0.98 }}
									transition={{ type: "spring", stiffness: 400, damping: 17 }}
								>
									<Link to={Paths.artist.profile} className="block">
										<Button variant="outline" className="w-full h-11" type="button">
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
								<Button variant="danger" size="sm">
									Delete
								</Button>
							</div>
						</div>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}