import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Heart, Settings } from "lucide-react";
import { Link } from "react-router";
import { Card } from "../components/ui/Card";
import { Badge as BadgeUI } from "../components/ui/Badge";
import { Button } from "../components/ui/BasicButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/Tabs";
import { badges, currentUserDrawings } from "../_mock/mockProfile";
import { ImageWithFallback } from "../utils/imageWithFallback";
import { userDrawingImages } from "../_mock/mockProfilePostImages";
import Paths from "../routes/paths";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState("badges");

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const formatDuration = (seconds: number) => {
		if (seconds >= 60) {
			const minutes = Math.floor(seconds / 60);
			return `${minutes} min`;
		}
		return `${seconds}s`;
	};

	return (
		<div className="min-h-screen p-6 bg-background">
			<h1 className="text-text text-3xl font-bold mb-8">Profile</h1>

			<div className="max-w-7xl mx-auto">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Profile Header */}
					<Card className="text-text p-8 mb-8">
						<div className="flex items-center gap-6">
							<div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl">
								🎨
							</div>
							<div className="flex-1">
								<h1 className="mb-2">Your Profile</h1>
								<p className="text-muted-foreground mb-4">
									Member since January 2026
								</p>
								<div className="flex gap-4 flex-wrap">
									<BadgeUI variant="secondary" className="text-sm">
										387 Drawings
									</BadgeUI>
									<BadgeUI variant="secondary" className="text-sm">
										15 Day Streak
									</BadgeUI>
									<BadgeUI variant="secondary" className="text-sm">
										Advanced Sketcher
									</BadgeUI>
								</div>
							</div>
							<Link to={Paths.artist.edit_profile}>
								<motion.div
									whileTap={{ scale: 0.95 }}
									whileHover={{ scale: 1.05 }}
									transition={{ type: "spring", stiffness: 400, damping: 17 }}
								>
									<Button variant="outline" className="border-2" size="sm">
										<Settings className="w-4 h-4 mr-2" />
										Edit Profile
									</Button>
								</motion.div>
							</Link>
						</div>
					</Card>

					{/* Tabs */}
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="text-text mb-6">
							<TabsTrigger value="badges">Badges</TabsTrigger>
							<TabsTrigger value="drawings">My Drawings</TabsTrigger>
							<TabsTrigger value="posts">Posts</TabsTrigger>
						</TabsList>

						{/* Badges Tab */}
						<TabsContent value="badges">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
									{badges.map((badge, index) => (
										<motion.div
											key={badge.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.05 * index, duration: 0.3 }}
										>
											<Card
												className={`p-6 transition-all ${badge.earned
													? "hover:shadow-lg"
													: "opacity-50 grayscale"
													}`}
											>
												<div className="flex items-start gap-4">
													<div className="text-4xl">{badge.icon}</div>
													<div className="text-text flex-1">
														<div className="flex items-center gap-2 mb-1">
															<h4>{badge.name}</h4>
															{badge.earned && (
																<BadgeUI
																	variant="default"
																	className="text-white text-xs h-5 border border-2"
																>
																	Earned
																</BadgeUI>
															)}
														</div>
														<p className="text-sm mb-2">
															{badge.description}
														</p>
														{badge.earned && badge.earnedDate && (
															<div className="flex items-center gap-1 text-xs">
																<Calendar className="w-3 h-3" />
																{formatDate(badge.earnedDate)}
															</div>
														)}
														{!badge.earned && (
															<p className="text-xs">
																Not yet earned
															</p>
														)}
													</div>
												</div>
											</Card>
										</motion.div>
									))}
								</div>
							</motion.div>
						</TabsContent>

						{/* My Drawings Tab */}
						<TabsContent className="text-text" value="drawings">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
									{currentUserDrawings.map((drawing, index) => (
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

						{/* Posts Tab */}
						<TabsContent className="text-text" value="posts">
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.3 }}
							>
								<Card className="p-12 text-center">
									<div className="text-5xl mb-4">📝</div>
									<h3 className="mb-2">No Posts Yet</h3>
									<p className="text-muted-foreground">
										Share your progress and thoughts with the community
									</p>
								</Card>
							</motion.div>
						</TabsContent>
					</Tabs>
				</motion.div>
			</div>
		</div>
	);
}