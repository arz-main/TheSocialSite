import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, User, Search, X } from "lucide-react";
import { ImageWithFallback } from "../components/ui/ImageWithFallBack";
import { Card } from "../components/ui/Card";
import { exploreDrawings } from "../_mock/mockPosts";
import { exploreImages, referenceImages } from "../_mock/mockExploreImages";
import { CommentsModal, generateMockComments } from "../components/ui/CommentsPopup";
import type { Drawing } from "../components/ui/CommentsPopup";

// Pre-generate mock comments once at module level
const mockComments = generateMockComments(exploreDrawings);

export default function ExplorePage() {
	const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState("");
	const [openedDrawing, setOpenedDrawing] = useState<Drawing | null>(null);

	const formatDate = (dateString: string) => {
		const diffHours = Math.floor(
			(Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60)
		);
		if (diffHours < 1) return "Just now";
		if (diffHours < 24) return `${diffHours}h ago`;
		return `${Math.floor(diffHours / 24)}d ago`;
	};

	const formatDuration = (seconds: number) => {
		if (seconds >= 60) return `${Math.floor(seconds / 60)} min`;
		return `${seconds}s`;
	};

	const toggleLike = (drawingId: string) => {
		setLikedDrawings((prev) => {
			const next = new Set(prev);
			if (next.has(drawingId)) next.delete(drawingId);
			else next.add(drawingId);
			return next;
		});
	};

	const filteredDrawings = useMemo(() => {
		const query = searchQuery.trim().toLowerCase();
		if (!query) return exploreDrawings;
		return exploreDrawings.filter((d: Drawing) =>
			d.username.toLowerCase().includes(query)
		);
	}, [searchQuery]);

	return (
		<>
			<section className="flex flex-col flex-1 w-full p-6 bg-background">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Header row */}
					<div className="flex justify-between">
						<h1 className="text-text text-3xl font-bold mb-6">Explore</h1>

						{/* Search Bar */}
						<div className="relative mb-8 max-w-md">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder="Search by username..."
								className="w-full bg-card text-text placeholder-text/50 border border-muted rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
							/>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-text opacity-50 hover:opacity-100 transition-opacity"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>
					</div>

					{/* Cards Grid */}
					<div className="bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{filteredDrawings.length > 0 ? (
							filteredDrawings.map((drawing: Drawing, index: number) => (
								<motion.div
									key={drawing.id}
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.05 * index, duration: 0.3 }}
								>
									<Card className="bg-card overflow-hidden hover:shadow-xl transition-shadow">
										{/* User Info */}
										<div className="p-4 flex items-center gap-3">
											<div className="w-10 h-10 rounded-full flex items-center justify-center">
												<User className="w-5 h-5 text-text" />
											</div>
											<div className="flex-1">
												<div className="text-text flex items-center gap-2">
													<span>{drawing.username}</span>
													<span className="text-sm">{formatDate(drawing.createdAt)}</span>
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
													className={`flex items-center gap-1 transition-colors ${
														likedDrawings.has(drawing.id)
															? "text-primary"
															: "text-foreground hover:text-primary"
													}`}
													whileTap={{ scale: 0.9 }}
													transition={{ type: "spring", stiffness: 400, damping: 17 }}
												>
													<Heart
														className={`text-[#C24A48] w-5 h-5 ${
															likedDrawings.has(drawing.id) ? "fill-current" : ""
														}`}
													/>
													<span className="text-text">
														{drawing.likes + (likedDrawings.has(drawing.id) ? 1 : 0)}
													</span>
												</motion.button>

												{/* Opens comments modal */}
												<button
													onClick={() => setOpenedDrawing(drawing)}
													className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
												>
													<MessageCircle className="text-text w-5 h-5" />
													<span className="text-text">{drawing.comments}</span>
												</button>
											</div>

											<div className="flex items-center justify-between gap-2">
												<span className="text-text text-sm">{drawing.category}</span>
												<span className="text-sm text-text">
													{formatDuration(drawing.duration)}
												</span>
											</div>

											{drawing.showWithReference && (
												<div className="text-text mt-2">
													<span className="font-semibold text-xs">Made With Reference</span>
												</div>
											)}
										</div>
									</Card>
								</motion.div>
							))
						) : (
							<div className="col-span-3 text-center py-16 text-text opacity-50">
								No users found matching "{searchQuery}"
							</div>
						)}
					</div>

					{/* Load More */}
					{!searchQuery && (
						<div className="mt-12 text-center">
							<button className="cursor-pointer text-text inline-block bg-button hover:bg-primary border rounded-lg py-2.5 px-8">
								Load More
							</button>
						</div>
					)}
				</motion.div>
			</section>

			{/* Comments Modal — mounted outside the scrollable section */}
			<AnimatePresence>
				{openedDrawing && (
					<CommentsModal
						drawing={openedDrawing}
						mockComments={mockComments}
						onClose={() => setOpenedDrawing(null)}
						likedDrawings={likedDrawings}
						toggleLike={toggleLike}
					/>
				)}
			</AnimatePresence>
		</>
	);
}