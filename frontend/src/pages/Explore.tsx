import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, User } from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallBack";
import { Card } from "../components/ui/Card";
import { exploreDrawings } from "../_mock/mockPosts";
import { exploreImages, referenceImages } from "../_mock/mockExploreImages"

export default function ExplorePage() {
	const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

		if (diffHours < 1) {
			return "Just now";
		} else if (diffHours < 24) {
			return `${diffHours}h ago`;
		} else {
			const diffDays = Math.floor(diffHours / 24);
			return `${diffDays}d ago`;
		}
	};

	const formatDuration = (seconds: number) => {
		if (seconds >= 60) {
			const minutes = Math.floor(seconds / 60);
			return `${minutes} min`;
		}
		return `${seconds}s`;
	};

	const toggleLike = (drawingId: string) => {
		setLikedDrawings((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(drawingId)) {
				newSet.delete(drawingId);
			} else {
				newSet.add(drawingId);
			}
			return newSet;
		});
	};

	return (
		<section className="mx-screen w-full p-6 bg-background">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-text text-3xl font-bold mb-8">Explore</h1>

				{/* this thing holds all the cards it's the foundation for them*/}
				<div className="bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{exploreDrawings.map((drawing, index) => (
						<motion.div
							key={drawing.id}
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.05 * index, duration: 0.3 }}
						>
							<Card className="bg-card overflow-hidden hover:shadow-xl transition-shadow">
								{/* User Info */}
								<div className="p-4 flex items-center gap-3">
									<div className="tex-text w-10 h-10 rounded-full flex items-center justify-center">
										<User className="w-5 h-5 text-text"></User>
									</div>
									<div className="flex-1">
										<div className="text-text flex items-center gap-2">
											<span>{drawing.username}</span>
											<span className="text-sm">
												{formatDate(drawing.createdAt)}
											</span>
										</div>
									</div>
								</div>

								{/* Image(s) */}
								{drawing.showWithReference && drawing.referenceUrl ? (
									<div className="grid grid-cols-2 gap-1 bg-muted">
										<div className="aspect-square overflow-hidden">
											<ImageWithFallback
												src={referenceImages[drawing.id]}
												alt="Reference"
												className="w-full h-full object-cover"
											/>
										</div>
										<div className="aspect-square overflow-hidden">
											<ImageWithFallback
												src={exploreImages[drawing.id]}
												alt={`Drawing by ${drawing.username}`}
												className="w-full h-full object-cover"
											/>
										</div>
									</div>
								) : (
									<div className="aspect-square bg-muted overflow-hidden">
										<ImageWithFallback
											src={exploreImages[drawing.id]}
											alt={`Drawing by ${drawing.username}`}
											className="w-full h-full object-cover"
										/>
									</div>
								)}

								{/* Actions and Info */}
								<div className="p-4">
									<div className="flex items-center gap-4 mb-3">
										<motion.button
											onClick={() => toggleLike(drawing.id)}
											className={`flex items-center gap-1 transition-colors ${likedDrawings.has(drawing.id)
												? "text-primary"
												: "text-foreground hover:text-primary"
												}`}
											whileTap={{ scale: 0.9 }}
											transition={{
												type: "spring",
												stiffness: 400,
												damping: 17,
											}}
										>
											<Heart className={`text-[#C24A48] w-5 h-5 ${likedDrawings.has(drawing.id) ? "fill-current" : ""}`}>
											</Heart>
											<span className="text-text">
												{drawing.likes + (likedDrawings.has(drawing.id) ? 1 : 0)}
											</span>
										</motion.button>
										<button className="flex items-center gap-1 text-foreground hover:text-primary transition-colors">
											<MessageCircle className="text-text w-5 h-5" />
											<span className="text-text">{drawing.comments}</span>
										</button>
									</div>

									<div className="flex items-center justify-between gap-2">
										<span className="text-text text-sm">
											{drawing.category}
										</span>
										<span className="text-sm text-text">
											{formatDuration(drawing.duration)}
										</span>
									</div>

									{drawing.showWithReference && (
										<div className="text-text mt-2">
											<span className="font-semibold text-xs">
												Made With Reference
											</span>
										</div>
									)}
								</div>
							</Card>
						</motion.div>
					))}
				</div>

				{/* Load More (placeholder) */}
				<div className="mt-12 text-center">
					<button className="cursor-pointer text-text inline-block bg-button hover:bg-primary border rounded-lg py-2.5 px-8">
						Load More
					</button>
				</div>
			</motion.div>
		</section>
	);
}