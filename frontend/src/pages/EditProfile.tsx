import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Camera, Save, Palette } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/InputComponent";
import { Label } from "../components/ui/LabelComponent";
import { Textarea } from "../components/ui/TextArea";
import Paths from "../routes/paths";

export default function EditProfile() {
	const navigate = useNavigate();
	const [profileData, setProfileData] = useState(() => {
		const saved = localStorage.getItem("profileData");
		return saved
			? JSON.parse(saved) : {
				username: "ArtistUser",
				email: "your@email.com",
				description:
					"Aspiring artist on a journey to improve my skills. Love sketching and exploring new techniques!",
				location: "New York, USA",
				website: "https://yourwebsite.com",
				socialLinks: {
					pinterest: "",
					x: "",
					deviantart: "",
					youtube: "",
					discord: ""
				}
			};
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Save to localStorage
		localStorage.setItem("profileData", JSON.stringify(profileData));
		console.log("Update profile:", profileData);
		navigate(Paths.artist.profile);
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setProfileData({
			...profileData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSocialChange = (platform: string, value: string) => {
		setProfileData({
			...profileData,
			socialLinks: {
				...profileData.socialLinks,
				[platform]: value
			}
		});
	};

	return (
		<div className="flex flex-col flex-1 bg-background text-text">
			<div className="flex flex-1 p-6">
				<motion.div
					className="px-6 md:px-12 lg:px-16 w-full max-w-5xl mx-auto"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="w-full p-8">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Profile Picture */}
							<div>
								<Label className="mb-4 block">Profile Picture</Label>
								<div className="flex items-center gap-6">
									<div className="relative">
										<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-5xl">
											<Palette></Palette>
										</div>
										<motion.button
											type="button"
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

							{/* Basic Information - Grid Layout */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
							</div>

							{/* Description - Full Width */}
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

							{/* Social Links Section */}
							<div className="space-y-4">
								<Label className="text-lg font-semibold">Social Links (Optional)</Label>
								<p className="text-sm text-muted-foreground -mt-2">
									Add your social media profiles. Leave blank to hide.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{/* Pinterest */}
									<div className="space-y-2">
										<Label htmlFor="pinterest">Pinterest</Label>
										<Input
											id="pinterest"
											name="pinterest"
											type="url"
											value={profileData.socialLinks?.pinterest || ""}
											onChange={(e) => handleSocialChange("pinterest", e.target.value)}
											placeholder="https://pinterest.com/username"
											className="bg-background"
										/>
									</div>

									{/* X (Twitter) */}
									<div className="space-y-2">
										<Label htmlFor="x">X (Twitter)</Label>
										<Input
											id="x"
											name="x"
											type="url"
											value={profileData.socialLinks?.x || ""}
											onChange={(e) => handleSocialChange("x", e.target.value)}
											placeholder="https://x.com/username"
											className="bg-background"
										/>
									</div>

									{/* DeviantArt */}
									<div className="space-y-2">
										<Label htmlFor="deviantart">DeviantArt</Label>
										<Input
											id="deviantart"
											name="deviantart"
											type="url"
											value={profileData.socialLinks?.deviantart || ""}
											onChange={(e) => handleSocialChange("deviantart", e.target.value)}
											placeholder="https://deviantart.com/username"
											className="bg-background"
										/>
									</div>

									{/* YouTube */}
									<div className="space-y-2">
										<Label htmlFor="youtube">YouTube</Label>
										<Input
											id="youtube"
											name="youtube"
											type="url"
											value={profileData.socialLinks?.youtube || ""}
											onChange={(e) => handleSocialChange("youtube", e.target.value)}
											placeholder="https://youtube.com/@username"
											className="bg-background"
										/>
									</div>

									{/* Discord */}
									<div className="space-y-2 md:col-span-2">
										<Label htmlFor="discord">Discord</Label>
										<Input
											id="discord"
											name="discord"
											type="text"
											value={profileData.socialLinks?.discord || ""}
											onChange={(e) => handleSocialChange("discord", e.target.value)}
											placeholder="username#1234"
											className="bg-background"
										/>
										<p className="text-xs text-muted-foreground">
											Your Discord username (e.g., username#1234)
										</p>
									</div>
								</div>
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