import { useRef, useEffect, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	Heart,
	User as UserIcon,
	X,
	MessageCircle,
	ChevronDown,
	Send,
	Check,
} from "lucide-react";
import { Card } from "./Card";
import { Button } from "./BasicButton";
import { ImageFallback } from "../components/ImageFallback";
import { useNavigate } from "react-router-dom";
import paths from "../routes/paths";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/UserTypes";
import type { Post } from "../types/PostTypes";
import type { Comment } from "../types/CommentTypes";

// --- User Banner Component ---
export function UserBanner({
	user,
	onUserClick,
	onFollow,
	isFollowing,
}: {
	user: User;
	onUserClick: (userId: string) => void;
	onFollow: (userId: string) => void;
	isFollowing: boolean;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Card className="p-6 hover:shadow-lg transition-shadow">
				<div className="flex items-center gap-4">
					<div
						className="w-16 h-16 rounded-full overflow-hidden shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
						onClick={() => onUserClick(user.id)}
					>
						{user.avatar ? (
							<img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-2xl">
								{user.username.charAt(0)}
							</div>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<h3
							className="text-lg font-semibold text-text mb-1 cursor-pointer hover:text-primary transition-colors truncate"
							onClick={() => onUserClick(user.id)}
						>
							{user.username}
						</h3>
						{user.bio && (
							<p className="text-sm text-muted-foreground mb-2 line-clamp-2">{user.bio}</p>
						)}
						<div className="flex gap-3 text-xs text-muted-foreground">
							<span>{user.postsCount} posts</span>
							<span>{user.followers?.length ?? 0} followers</span>
							<span>{user.following?.length ?? 0} following</span>
						</div>
					</div>
					<motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 17 }}>
						<Button variant={isFollowing ? "outline" : "default"} size="sm" onClick={() => onFollow(user.id)}>
							<UserIcon className="w-4 h-4 mr-2" />
							{isFollowing ? "Following" : "Follow"}
						</Button>
					</motion.div>
				</div>
			</Card>
		</motion.div>
	);
}

// --- Comments Modal ---
interface CommentsModalProps {
	post: Post;
	comments: Comment[];
	likedDrawings: Set<string>;
	imageIndex: number;
	newComment: string;
	onChangeImageIndex: (index: number) => void;
	onChangeNewComment: (text: string) => void;
	onSubmitComment?: (postId: string, content: string) => Promise<Comment>;
	toggleLike: (postId: string) => void;
	onClose: () => void;
}

export function CommentsModal({
	post,
	comments,
	likedDrawings,
	imageIndex,
	newComment,
	onChangeNewComment,
	onSubmitComment,
	toggleLike,
	onClose,
}: CommentsModalProps) {
	const commentsEndRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	
	const handleUserClick = (userId: string) => {
		if (userId === currentUser?.id) navigate(paths.artist.profile);
		else navigate(paths.explore.toUser(userId));
	};

	const formatDate = (dateString: string) => {
		const diff = Date.now() - new Date(dateString).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		if (hours < 1) return "just now";
		if (hours < 24) return `${hours}h ago`;
		return `${Math.floor(hours / 24)}d ago`;
	};

	const submitComment = async () => {
		const text = newComment.trim();
		if (!text) return;
		await onSubmitComment?.(post.id, text);
		onChangeNewComment("");
	};

	useEffect(() => {
		commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [comments.length]);

	useEffect(() => {
		const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	return (<motion.div
		className="fixed inset-0 z-50 flex items-center justify-center p-4"
		style={{ backgroundColor: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
		onClick={(e) => e.target === e.currentTarget && onClose()}
	>
		<motion.div
			className="relative bg-card rounded-2xl overflow-hidden shadow-2xl flex w-full"
			style={{ maxWidth: "1100px", height: "min(860px, 90vh)" }}
			initial={{ scale: 0.95, opacity: 0, y: 20 }}
			animate={{ scale: 1, opacity: 1, y: 0 }}
			exit={{ scale: 0.95, opacity: 0, y: 20 }}
			transition={{ type: "spring", stiffness: 340, damping: 30 }}
			onClick={(e) => e.stopPropagation()}
		>
			{/* Close button */}
			<button
				onClick={onClose}
				className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
			>
				<X className="w-4 h-4" />
			</button>

			{/* Image panel */}
			<div className="relative shrink-0 bg-card flex items-center justify-center" style={{ width: "58%" }}>
				<AnimatePresence mode="wait">
					<motion.div
						key={imageIndex}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="w-full h-full flex items-center justify-center"
					>
						<ImageFallback
							src={post.imageUrl}
							alt={`Image by ${post.author.username}`}
							className="object-contain w-full h-full"
						/>
					</motion.div>
				</AnimatePresence>

				{/* Image overlay — post info */}
				<div className="absolute bottom-0 left-0 right-0 p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)" }}>
					<p className="text-white font-semibold text-sm truncate">{post.title}</p>
					{post.description && (
						<p className="text-white/50 text-xs mt-1 line-clamp-2 leading-relaxed">{post.description}</p>
					)}
				</div>
			</div>

			{/* Right panel */}
			<div className="flex flex-col flex-1 min-w-0 border-l border-border">

				{/* Post author header */}
				<div className="flex items-center gap-3 px-4 py-3 border-b border-border shrink-0">
					<div
						className="w-8 h-8 rounded-full overflow-hidden shrink-0 cursor-pointer ring-1 ring-border hover:ring-primary transition-all"
						onClick={() => handleUserClick(post.author.id)}
					>
						{post.author.avatar ? (
							<img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-white">
								{post.author.username?.charAt(0)?.toUpperCase()}
							</div>
						)}
					</div>
					<div className="flex-1 min-w-0">
						<span
							className="text-text font-semibold text-sm cursor-pointer hover:underline block truncate"
							onClick={() => handleUserClick(post.author.id)}
						>
							{post.author.username}
						</span>
						<span className="text-muted text-xs">{formatDate(post.createdAt)}</span>
					</div>
				</div>

				{/* Comments list */}
				<div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">
					{comments.length === 0 ? (
						<div className="flex flex-col items-center justify-center h-full gap-2">
							<MessageCircle className="w-8 h-8 text-muted/40" />
							<p className="text-muted text-sm">No comments yet. Be the first!</p>
						</div>
					) : comments.map((comment) => (
						<motion.div
							key={comment.id}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
							className="flex gap-2.5 group"
						>
							<div
								className="w-7 h-7 rounded-full bg-card border border-border flex items-center justify-center shrink-0 mt-0.5 cursor-pointer overflow-hidden group-hover:ring-2 group-hover:ring-primary/30 transition-all"
								onClick={() => handleUserClick(comment.authorId)}
							>
								{comment.authorAvatar ? (
									<img src={comment.authorAvatar} alt={comment.authorUsername} className="w-full h-full object-cover" />
								) : (
									<span className="text-xs font-semibold text-muted">
										{comment.authorUsername?.charAt(0)?.toUpperCase()}
									</span>
								)}
							</div>
							<div className="flex-1 min-w-0">
								<div className="flex items-baseline gap-2">
									<span
										className="text-text font-semibold text-xs cursor-pointer hover:underline"
										onClick={() => handleUserClick(comment.authorId)}
									>
										{comment.authorUsername}
									</span>
									<span className="text-muted text-xs">{formatDate(comment.createdAt)}</span>
								</div>
								<p className="text-text/80 text-sm mt-0.5 leading-relaxed break-words">{comment.content}</p>
							</div>
						</motion.div>
					))}
					<div ref={commentsEndRef} />
				</div>

				{/* Comment count */}
				{comments.length > 0 && (
					<div className="px-4 py-2 border-t border-border shrink-0">
						<span className="text-muted text-xs">{comments.length} comment{comments.length !== 1 ? "s" : ""}</span>
					</div>
				)}

				{/* Input */}
				<div className="px-4 py-3 border-t border-border shrink-0">
					<div className="flex items-center gap-2.5 rounded-xl px-3 py-2 border border-border bg-background focus-within:border-primary focus-within:ring-3 focus-within:ring-primary/20 transition-all">
						<div className="w-6 h-6 rounded-full overflow-hidden shrink-0 bg-card border border-border flex items-center justify-center">
							{currentUser?.avatar ? (
								<img src={currentUser.avatar} alt={currentUser.username} className="w-full h-full object-cover" />
							) : (
								<span className="text-xs font-semibold text-muted">
									{currentUser?.username?.charAt(0)?.toUpperCase()}
								</span>
							)}
						</div>
						<input
							type="text"
							value={newComment}
							onChange={(e) => onChangeNewComment(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && submitComment()}
							placeholder="Add a comment…"
							className="flex-1 bg-transparent text-text text-sm placeholder:text-muted focus:outline-none"
						/>
						<motion.button
							onClick={submitComment}
							disabled={!newComment.trim()}
							className="text-primary disabled:opacity-20 transition-opacity shrink-0"
							whileTap={{ scale: 0.85 }}
						>
							<Send className="w-4 h-4" />
						</motion.button>
					</div>
				</div>
			</div>
		</motion.div>
	</motion.div>
	)
};

export function Dropdown({ label, value, options, isOpen, onToggle, onChange }: any) {
	const dropdownRef = useRef<HTMLDivElement>(null);
	const selectedOption = options.find((opt: any) => opt.value === value);

	useEffect(() => {
		if (!isOpen) return;
		const handler = (e: MouseEvent) => {
			if (!dropdownRef.current?.contains(e.target as Node)) onToggle();
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [isOpen, onToggle]);

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={onToggle}
				className={`flex items-center gap-2 bg-card text-text border rounded-md h-9 px-3 text-sm shadow-sm transition-colors
        			${isOpen
						? "border-primary ring-3 ring-primary/20"
						: "border-border hover:border-primary/50"
					}`}
			>
				<span className="text-muted text-xs font-medium uppercase tracking-wide">{label}</span>
				<span className="w-px h-3.5 bg-border" />
				<span className="font-medium text-text">{selectedOption?.label}</span>
				<ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -4, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -4, scale: 0.97 }}
						transition={{ duration: 0.12 }}
						className="absolute top-full mt-1.5 left-0 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-10 min-w-40"
					>
						{options.map((option: any) => (
							<button
								key={option.value}
								onClick={() => { onChange(option.value); onToggle(); }}
								className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center justify-between gap-4
                                    ${option.value === value
										? "bg-primary/10 text-primary font-medium"
										: "text-text hover:bg-border/40"
									}`}
							>
								{option.label}
								{option.value === value && (
									<Check className="w-3.5 h-3.5 text-primary shrink-0" />
								)}
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

export function PostCardSkeleton() {
	return (
		<div className="rounded-2xl overflow-hidden bg-card border border-muted/60 animate-pulse">
			<div className="bg-muted/40" style={{ aspectRatio: "4/3" }} />
			<div className="px-3 py-2.5 flex items-center gap-2.5">
				<div className="w-7 h-7 rounded-full bg-muted/40 shrink-0" />
				<div className="flex-1 space-y-1.5">
					<div className="h-2.5 bg-muted/40 rounded-full w-24" />
					<div className="h-2 bg-muted/40 rounded-full w-16" />
				</div>
				<div className="flex items-center gap-3">
					<div className="h-3 w-8 bg-muted/40 rounded-full" />
					<div className="h-3 w-8 bg-muted/40 rounded-full" />
				</div>
			</div>
		</div>
	);
}

// --- Post Card ---
export function PostCard({
	post,
	index,
	isLiked,
	onToggleLike,
	onOpenComments,
	commentCount,
	formatDate,
}: any) {
	const [likeFlash, setLikeFlash] = useState(false);
	const [hovered, setHovered] = useState(false);
	const navigate = useNavigate();
	const { currentUser } = useAuth();
	const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clickCount = useRef(0);

	const handleUserClick = useCallback((e: React.MouseEvent, userId: string) => {
		e.stopPropagation();
		if (!userId) return;
		currentUser?.id == userId ?
			navigate(paths.artist.profile) :
			navigate(paths.explore.toUser(userId));
	}, [navigate]);

	const handleImageClick = useCallback(() => {
		clickCount.current += 1;
		if (clickTimer.current) clearTimeout(clickTimer.current);

		clickTimer.current = setTimeout(() => {
			const count = clickCount.current;
			clickCount.current = 0;
			if (count === 1) onOpenComments(post);
			else if (count >= 2) {
				onToggleLike(post.id);
				setLikeFlash(true);
				setTimeout(() => setLikeFlash(false), 700);
			}
		}, 220);
	}, [post, onToggleLike, onOpenComments]);

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.04 * index, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
			onHoverStart={() => setHovered(true)}
			onHoverEnd={() => setHovered(false)}
		>
			<div className="rounded-2xl overflow-hidden bg-card border border-muted/60 hover:border-muted transition-all hover:shadow-lg">
				{/* Image */}
				<div
					className="relative cursor-pointer bg-background select-none overflow-hidden"
					onClick={handleImageClick}
					style={{ aspectRatio: "4/3" }}
				>
					<motion.div
						className="w-full h-full"
						animate={{ scale: hovered ? 1.03 : 1 }}
						transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
					>
						<ImageFallback
							src={post.imageUrl}
							alt={`Drawing by ${post.author.username}`}
							className="w-full h-full object-cover"
						/>
					</motion.div>

					{/* Category badge */}
					{post.category && (
						<div className="absolute top-2.5 left-2.5">
							<span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", color: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)" }}>
								{post.category}
							</span>
						</div>
					)}

					{/* Double-tap like flash */}
					<AnimatePresence>
						{likeFlash && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center pointer-events-none"
								initial={{ opacity: 0, scale: 0.4 }}
								animate={{ opacity: 1, scale: 1 }}
								exit={{ opacity: 0, scale: 1.5 }}
								transition={{ duration: 0.35 }}
							>
								<div className="rounded-full p-4" style={{ background: "rgba(0,0,0,0.3)", backdropFilter: "blur(4px)" }}>
									<Heart className="w-10 h-10 fill-current" style={{ color: "#C24A48" }} />
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				{/* Card footer */}
				<div className="px-3 py-2.5 flex items-center gap-2.5">
					{/* Author avatar */}
					<div
						className="w-7 h-7 rounded-full overflow-hidden shrink-0 cursor-pointer ring-1 ring-muted hover:ring-primary transition-all"
						onClick={(e) => handleUserClick(e, post.author.id)}
					>
						{post.author.avatar ? (
							<img src={post.author.avatar} alt={post.author.username} className="w-full h-full object-cover" />
						) : (
							<div className="w-full h-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold text-white">
								{post.author.username?.charAt(0)?.toUpperCase()}
							</div>
						)}
					</div>

					{/* Author + date */}
					<div className="flex-1 min-w-0">
						<span
							className="text-text text-xs font-semibold truncate block cursor-pointer hover:underline"
							onClick={(e) => handleUserClick(e, post.author.id)}
						>
							{post.author.username}
						</span>
						<span className="text-text/40 text-xs">{formatDate(post.createdAt)}</span>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-3 shrink-0">
						<motion.button
							onClick={() => onToggleLike(post.id)}
							className="flex items-center gap-1 transition-colors"
							whileTap={{ scale: 0.8 }}
						>
							<Heart
								className={`w-4 h-4 transition-all ${isLiked ? "fill-current scale-110" : "text-text/40 hover:text-[#C24A48]"}`}
								style={{ color: isLiked ? "#C24A48" : undefined }}
							/>
							<span className="text-xs text-text/60">{post.likes + (isLiked ? 1 : 0)}</span>
						</motion.button>

						<button
							onClick={() => onOpenComments(post)}
							className="flex items-center gap-1 transition-colors group/comment"
						>
							<MessageCircle className="w-4 h-4 text-text/40 group-hover/comment:text-primary transition-colors" />
							<span className="text-xs text-text/60">
								{commentCount !== undefined ? commentCount : "···"}
							</span>
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}