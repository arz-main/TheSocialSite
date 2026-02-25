import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, User, X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { ImageWithFallback } from "../../utils/imageWithFallback";
import { exploreImages, referenceImages } from "../../_mock/mockExploreImages";

// --- Types ---
export interface Drawing {
	id: string;
	username: string;
	createdAt: string;
	likes: number;
	comments: number;
	category: string;
	duration: number;
	showWithReference?: boolean;
	referenceUrl?: string;
}

interface Comment {
	id: string;
	username: string;
	text: string;
	createdAt: string;
}

// --- Mock comments ---
const sampleComments = [
	"This is absolutely stunning! 😍",
	"Love the brushwork on this one.",
	"How long did this take you?",
	"The shading is incredible.",
	"This is so inspiring, keep it up!",
	"What tool did you use for this?",
	"Beautiful composition!",
	"Wow, the details are amazing.",
];

export function generateMockComments(drawings: Drawing[]): Record<string, Comment[]> {
	const result: Record<string, Comment[]> = {};
	drawings.forEach((d, i) => {
		result[d.id] = Array.from({ length: Math.max(2, (i % 5) + 2) }, (_, j) => ({
			id: `${d.id}-comment-${j}`,
			username: `user_${(i * 3 + j + 1) % 20}`,
			text: sampleComments[(i + j) % sampleComments.length],
			createdAt: new Date(Date.now() - (j + 1) * 1000 * 60 * 60 * 3).toISOString(),
		}));
	});
	return result;
}

// --- Props ---
interface CommentsModalProps {
	drawing: Drawing;
	mockComments: Record<string, Comment[]>;
	onClose: () => void;
	likedDrawings: Set<string>;
	toggleLike: (id: string) => void;
}

// --- Component ---
export function CommentsModal({
	drawing,
	mockComments,
	onClose,
	likedDrawings,
	toggleLike,
}: CommentsModalProps) {
	const images: string[] = [];
	if (drawing.showWithReference && drawing.referenceUrl) {
		images.push(referenceImages[drawing.id]);
		images.push(exploreImages[drawing.id]);
	} else {
		images.push(exploreImages[drawing.id]);
	}

	const [imageIndex, setImageIndex] = useState(0);
	const [comments, setComments] = useState<Comment[]>(mockComments[drawing.id] || []);
	const [newComment, setNewComment] = useState("");
	const commentsEndRef = useRef<HTMLDivElement>(null);

	const formatDate = (dateString: string) => {
		const diff = Date.now() - new Date(dateString).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours < 1) return "Just now";
		if (hours < 24) return `${hours}h ago`;
		return `${Math.floor(hours / 24)}d ago`;
	};

	const submitComment = () => {
		const text = newComment.trim();
		if (!text) return;
		setComments((prev) => [
			...prev,
			{
				id: `new-${Date.now()}`,
				username: "you",
				text,
				createdAt: new Date().toISOString(),
			},
		]);
		setNewComment("");
		setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submitComment();
		}
	};

	const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) onClose();
	};

	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={handleBackdrop}
		>
			{/* Modal shell — fixed size, no shrinking */}
			<motion.div
				className="relative bg-card rounded-2xl overflow-hidden shadow-2xl flex"
				style={{
					width: "min(1400px, 95vw)",
					height: "min(920px, 92vh)",
				}}
				initial={{ scale: 0.93, opacity: 0, y: 24 }}
				animate={{ scale: 1, opacity: 1, y: 0 }}
				exit={{ scale: 0.93, opacity: 0, y: 24 }}
				transition={{ type: "spring", stiffness: 320, damping: 28 }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-colors"
				>
					<X className="w-4 h-4" />
				</button>

				{/* ── LEFT: Image panel — fixed 55% width, black background always ── */}
				<div
					className="relative flex-shrink-0 flex items-center justify-center bg-black"
					style={{ width: "55%" }}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={imageIndex}
							initial={{ opacity: 0, x: 16 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -16 }}
							transition={{ duration: 0.18 }}
							className="w-full h-full flex items-center justify-center"
						>
							<ImageWithFallback
								src={images[imageIndex]}
								alt={`Image ${imageIndex + 1}`}
								className="object-contain"
								style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto" }}
							/>
						</motion.div>
					</AnimatePresence>

					{/* Navigation arrows */}
					{images.length > 1 && (
						<>
							<button
								onClick={() => setImageIndex((i) => Math.max(0, i - 1))}
								disabled={imageIndex === 0}
								className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 disabled:opacity-20 flex items-center justify-center text-white transition-all"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<button
								onClick={() => setImageIndex((i) => Math.min(images.length - 1, i + 1))}
								disabled={imageIndex === images.length - 1}
								className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 disabled:opacity-20 flex items-center justify-center text-white transition-all"
							>
								<ChevronRight className="w-5 h-5" />
							</button>

							{/* Dot indicators */}
							<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
								{images.map((_, i) => (
									<button
										key={i}
										onClick={() => setImageIndex(i)}
										className={`rounded-full transition-all ${
											i === imageIndex
												? "w-4 h-1.5 bg-white"
												: "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
										}`}
									/>
								))}
							</div>

							{/* Label badge */}
							<div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full font-medium">
								{imageIndex === 0 ? "Reference" : "Drawing"}
							</div>
						</>
					)}
				</div>

				{/* ── RIGHT: Comments panel — fills remaining width ── */}
				<div className="flex flex-col flex-1 min-w-0 border-l border-muted">
					{/* Post author header */}
					<div className="px-4 py-3.5 border-b border-muted flex items-center gap-3 flex-shrink-0">
						<div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
							<User className="w-4 h-4 text-text/60" />
						</div>
						<div className="min-w-0">
							<p className="text-text font-semibold text-sm truncate">{drawing.username}</p>
							<p className="text-text/50 text-xs truncate">{drawing.category}</p>
						</div>
					</div>

					{/* Like summary */}
					<div className="px-4 py-2.5 border-b border-muted flex items-center gap-4 flex-shrink-0">
						<motion.button
							onClick={() => toggleLike(drawing.id)}
							className="flex items-center gap-1.5 transition-colors"
							whileTap={{ scale: 0.88 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Heart
								className={`w-4 h-4 text-[#C24A48] transition-all ${
									likedDrawings.has(drawing.id) ? "fill-current scale-110" : ""
								}`}
							/>
							<span className="text-text text-sm">
								{drawing.likes + (likedDrawings.has(drawing.id) ? 1 : 0)} likes
							</span>
						</motion.button>
						<span className="text-text/40 text-xs">·</span>
						<span className="text-text/50 text-sm">{comments.length} comments</span>
					</div>

					{/* Comments list — scrollable */}
					<div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 min-h-0">
						{comments.length === 0 && (
							<p className="text-text/30 text-sm text-center pt-8">
								No comments yet. Be the first!
							</p>
						)}
						{comments.map((comment) => (
							<motion.div
								key={comment.id}
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.2 }}
								className="flex gap-2.5"
							>
								<div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
									<User className="w-3.5 h-3.5 text-text/50" />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-baseline gap-2 flex-wrap">
										<span className="text-text font-semibold text-sm">{comment.username}</span>
										<span className="text-text/35 text-xs">{formatDate(comment.createdAt)}</span>
									</div>
									<p className="text-text/80 text-sm mt-0.5 leading-relaxed break-words">
										{comment.text}
									</p>
								</div>
							</motion.div>
						))}
						<div ref={commentsEndRef} />
					</div>

					{/* Comment input — pinned to bottom */}
					<div className="px-4 py-3 border-t border-muted flex-shrink-0">
						<div className="flex items-center gap-2 bg-background rounded-xl px-3 py-2.5 border border-muted focus-within:border-primary transition-colors">
							<input
								type="text"
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								onKeyDown={handleKeyDown}
								placeholder="Add a comment…"
								className="flex-1 bg-transparent text-text text-sm placeholder-text/35 focus:outline-none"
							/>
							<motion.button
								onClick={submitComment}
								disabled={!newComment.trim()}
								className="text-primary disabled:opacity-25 transition-opacity flex-shrink-0"
								whileTap={{ scale: 0.85 }}
							>
								<Send className="w-4 h-4" />
							</motion.button>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}