import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Badge as BadgeUI } from "../components/ui/Badge";
import { Button } from "../components/ui/BasicButton";
import { TabsPage } from "../components/ui/ProfilePageComponents";
import { mockUsers } from "../_mock/mockUsers";
import { badges, currentUserDrawings } from "../_mock/mockProfile";
import { userDrawingImages } from "../_mock/mockProfilePostImages";

export default function ProfilePage() {
	const [activeTab, setActiveTab] = useState("badges");

	// In a real app, this would come from auth context
	const currentUser = mockUsers[0]; // Using first user as the logged-in user

	// Handlers for upload buttons
	const openUploadDrawingModal = () => {
		alert("Open upload drawing modal");
	};

	const openUploadPostModal = () => {
		alert("Open upload post modal");
	};

	return (
		<div className="flex flex-col flex-1 bg-background text-primary">
			<div className="max-w-7xl mx-auto w-full p-6">
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
								<h1 className="mb-2">{currentUser.name}</h1>
								<p className="text-muted-foreground mb-4">
									Member since {currentUser.joinedDate}
								</p>
								<div className="flex gap-4 flex-wrap">
									<BadgeUI variant="secondary" className="text-sm">
										{currentUser.postsCount} Posts
									</BadgeUI>
									<BadgeUI variant="secondary" className="text-sm">
										{currentUser.followers.length} Followers
									</BadgeUI>
									<BadgeUI variant="secondary" className="text-sm">
										{currentUser.following.length} Following
									</BadgeUI>
								</div>
							</div>
						</div>
					</Card>

					{/* Tabs with Upload Buttons */}
					<TabsPage
						badges={badges}
						currentUserDrawings={currentUserDrawings}
						userDrawingImages={userDrawingImages}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						renderUploadButtons={(tab) => {
							if (tab === "drawings") {
								return (
									<div className="flex justify-end mb-4">
										<Button onClick={openUploadDrawingModal}>Upload Drawing</Button>
									</div>
								);
							}
							if (tab === "posts") {
								return (
									<div className="flex justify-end mb-4">
										<Button onClick={openUploadPostModal}>Upload Post</Button>
									</div>
								);
							}
							return null;
						}}
					/>
				</motion.div>
			</div>
		</div>
	);
}