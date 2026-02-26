import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MessageCircle, User, Search, X, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../components/ui/ImageWithFallBack";
import { Card } from "../components/ui/Card";
import { exploreDrawings } from "../_mock/mockPosts";
import { exploreImages } from "../_mock/mockExploreImages";
import { mockUsers, getUserById } from "../_mock/mockUsers";
import { CommentsModal, generateMockComments } from "../components/ui/CommentsPopup";
import type { Drawing } from "../components/ui/CommentsPopup";
import {
	filterDrawings,
	sortDrawings,
	getSearchPlaceholder,
	searchByOptions,
	sortByOptions,
	type SearchByOption,
	type SortByOption,
} from "../utils/ExploreSearchLogic";
import Paths from "../routes/paths";

const PAGE_SIZE = 9;

// Pre-generate mock comments once at module level
const mockComments = generateMockComments(exploreDrawings);

// --- PostCard with single/double click and like flash ---
function PostCard({
	drawing,
	index,
	isLiked,
	onToggleLike,
	onOpenComments,
	formatDate,
	formatDuration,
	onUserClick,
}: {
	drawing: Drawing;
	index: number;
	isLiked: boolean;
	onToggleLike: (id: string) => void;
	onOpenComments: (drawing: Drawing) => void;
	formatDate: (d: string) => string;
	formatDuration: (s: number) => string;
	onUserClick: (userId: string) => void;
}) {
	const [likeFlash, setLikeFlash] = useState(false);
	const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const clickCount = useRef(0);

	// Find user from mockUsers based on username
	const user = mockUsers.find(u => u.name === drawing.username);

	const handleImageClick = useCallback(() => {
		clickCount.current += 1;

		if (clickTimer.current) clearTimeout(clickTimer.current);

		clickTimer.current = setTimeout(() => {
			const count = clickCount.current;
			clickCount.current = 0;

			if (count === 1) {
				// Single click → open comments
				onOpenComments(drawing);
			} else if (count >= 2) {
				// Double click → like + flash
				onToggleLike(drawing.id);
				setLikeFlash(true);
				setTimeout(() => setLikeFlash(false), 800);
			}
		}, 220);
	}, [drawing, onToggleLike, onOpenComments]);

	const imageCount = drawing.showWithReference && drawing.referenceUrl ? 2 : 1;

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ delay: 0.04 * (index % PAGE_SIZE), duration: 0.3 }}
		>
			<Card className="bg-card overflow-hidden hover:shadow-xl transition-shadow">
				{/* User Info */}
				<div className="p-4 flex items-center gap-3">
					<div
						className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary transition-all"
						onClick={(e) => {
							e.stopPropagation();
							user && onUserClick(user.id);
						}}
					>
						{user?.avatar ? (
							<img
								src={user.avatar}
								alt={drawing.username}
								className="w-full h-full object-cover"
							/>
						) : (
							<User className="w-5 h-5 text-text" />
						)}
					</div>
					<div className="flex-1">
						<div className="text-text flex items-center gap-2">
							<span
								className="cursor-pointer hover:underline"
								onClick={(e) => {
									e.stopPropagation();
									user && onUserClick(user.id);
								}}
							>
								{drawing.username}
							</span>
							<span className="text-sm text-text/50">{formatDate(drawing.createdAt)}</span>
						</div>
					</div>
				</div>

				{/* Image — click to open, double-click to like */}
				<div className="relative cursor-pointer select-none" onClick={handleImageClick}>
					<div className="aspect-square bg-muted overflow-hidden">
						<ImageWithFallback
							src={exploreImages[drawing.id]}
							alt={`Drawing by ${drawing.username}`}
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Double-click like flash */}
					<AnimatePresence>
						{likeFlash && (
							<motion.div
								className="absolute inset-0 flex items-center justify-center pointer-events-none"
								initial={{ opacity: 0, scale: 0.5 }}
								animate={{ opacity: 1, scale: 1.1 }}
								exit={{ opacity: 0, scale: 1.4 }}
								transition={{ duration: 0.15 }}
							>
								<Heart className="w-16 h-16 text-[#C24A48] fill-current drop-shadow-lg" />
							</motion.div>
						)}
					</AnimatePresence>

					{/* Dots — multiple attachments indicator */}
					{imageCount > 1 && (
						<div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
							{Array.from({ length: imageCount }).map((_, i) => (
								<span
									key={i}
									className={`rounded-full transition-all ${i === 0
										? "w-1.5 h-1.5 bg-white shadow-sm"
										: "w-1.5 h-1.5 bg-white/45 shadow-sm"
										}`}
								/>
							))}
						</div>
					)}
				</div>

				{/* Actions and Info */}
				<div className="p-4">
					<div className="flex items-center gap-4 mb-3">
						<motion.button
							onClick={() => onToggleLike(drawing.id)}
							className="flex items-center gap-1 transition-colors"
							whileTap={{ scale: 0.85 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Heart
								className={`w-5 h-5 text-[#C24A48] transition-all ${isLiked ? "fill-current scale-110" : ""
									}`}
							/>
							<span className="text-text">
								{drawing.likes + (isLiked ? 1 : 0)}
							</span>
						</motion.button>

						<button
							onClick={() => onOpenComments(drawing)}
							className="flex items-center gap-1 text-foreground hover:text-primary transition-colors"
						>
							<MessageCircle className="text-text w-5 h-5" />
							<span className="text-text">{drawing.comments}</span>
						</button>
					</div>

					<div className="flex items-center justify-between gap-2">
						<span className="text-text text-sm">{drawing.category}</span>
						<span className="text-sm text-text">{formatDuration(drawing.duration)}</span>
					</div>
				</div>
			</Card>
		</motion.div>
	);
}

// --- Dropdown Component ---
function Dropdown({
	label,
	value,
	options,
	onChange,
}: {
	label: string;
	value: string;
	options: { value: string; label: string }[];
	onChange: (value: string) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useState(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	});

	const selectedOption = options.find((opt) => opt.value === value);

	return (
		<div ref={dropdownRef} className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="flex items-center gap-2 bg-card text-text border border-muted rounded-lg py-2.5 px-4 hover:bg-muted/50 transition-colors"
			>
				<span className="text-sm text-text/70">{label}:</span>
				<span className="text-sm font-medium">{selectedOption?.label}</span>
				<ChevronDown className={`w-4 h-4 text-text/50 transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.15 }}
						className="absolute top-full mt-2 left-0 bg-card border border-muted rounded-lg shadow-lg overflow-hidden z-10 min-w-[200px]"
					>
						{options.map((option) => (
							<button
								key={option.value}
								onClick={() => {
									onChange(option.value);
									setIsOpen(false);
								}}
								className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${option.value === value
									? "bg-primary/10 text-primary font-medium"
									: "text-text hover:bg-muted/50"
									}`}
							>
								{option.label}
							</button>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

// --- User Banner Component ---
function UserBanner({
	user,
	onUserClick,
	onFollow,
	isFollowing,
}: {
	user: typeof mockUsers[0];
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
					{/* Avatar */}
					<div
						className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
						onClick={() => onUserClick(user.id)}
					>
						{user.avatar ? (
							<img
								src={user.avatar}
								alt={user.name}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl">
								{user.name.charAt(0)}
							</div>
						)}
					</div>

					{/* User Info */}
					<div className="flex-1 min-w-0">
						<h3
							className="text-lg font-semibold text-text mb-1 cursor-pointer hover:text-primary transition-colors truncate"
							onClick={() => onUserClick(user.id)}
						>
							{user.name}
						</h3>
						{user.bio && (
							<p className="text-sm text-muted-foreground mb-2 line-clamp-2">
								{user.bio}
							</p>
						)}
						<div className="flex gap-3 text-xs text-muted-foreground">
							<span>{user.postsCount} posts</span>
							<span>{user.followers.length} followers</span>
							<span>{user.following.length} following</span>
						</div>
					</div>

					{/* Follow Button */}
					<motion.div
						whileTap={{ scale: 0.95 }}
						whileHover={{ scale: 1.05 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Button
							variant={isFollowing ? "outline" : "default"}
							size="sm"
							onClick={() => onFollow(user.id)}
						>
							<User className="w-4 h-4 mr-2" />
							{isFollowing ? "Following" : "Follow"}
						</Button>
					</motion.div>
				</div>
			</Card>
		</motion.div>
	);
}

// --- Main Page ---
export default function ExplorePage() {
	const navigate = useNavigate();
	const [likedDrawings, setLikedDrawings] = useState<Set<string>>(new Set());
	const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());
	const [searchQuery, setSearchQuery] = useState("");
	const [searchBy, setSearchBy] = useState<SearchByOption>("creator");
	const [sortBy, setSortBy] = useState<SortByOption>("relevance");
	const [openedDrawing, setOpenedDrawing] = useState<Drawing | null>(null);
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [isSearchExpanded, setIsSearchExpanded] = useState(false);

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

	const toggleLike = useCallback((drawingId: string) => {
		setLikedDrawings((prev) => {
			const next = new Set(prev);
			if (next.has(drawingId)) next.delete(drawingId);
			else next.add(drawingId);
			return next;
		});
	}, []);

	const toggleFollow = useCallback((userId: string) => {
		setFollowedUsers((prev) => {
			const next = new Set(prev);
			if (next.has(userId)) next.delete(userId);
			else next.add(userId);
			return next;
		});
	}, []);

	const handleUserClick = (userId: string) => {
		navigate(`${Paths.explore}/user/${userId}`);
	};

	const filteredDrawings = useMemo(() => {
		return filterDrawings(exploreDrawings, searchQuery, searchBy);
	}, [searchQuery, searchBy]);

	const sortedDrawings = useMemo(() => {
		return sortDrawings(filteredDrawings, sortBy);
	}, [filteredDrawings, sortBy]);

	const visibleDrawings = useMemo(
		() => sortedDrawings.slice(0, visibleCount),
		[sortedDrawings, visibleCount]
	);

	// Filter users for user search
	const filteredUsers = useMemo(() => {
		if (searchBy !== "users" || !searchQuery.trim()) return [];
		const query = searchQuery.trim().toLowerCase();
		return mockUsers.filter(user =>
			user.name.toLowerCase().includes(query) ||
			user.bio?.toLowerCase().includes(query)
		);
	}, [searchQuery, searchBy]);

	const hasMore = !searchQuery && visibleCount < sortedDrawings.length;

	const handleLoadMore = () => {
		setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, sortedDrawings.length));
	};

	// Reset pagination when search changes
	const handleSearch = (val: string) => {
		setSearchQuery(val);
		setVisibleCount(PAGE_SIZE);
	};

	const isSearching = searchQuery.trim().length > 0;
	const isUserSearch = searchBy === "users";

	return (
		<>
			<section className="flex flex-col flex-1 w-full p-6 bg-background">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{/* Search and Filter Bar */}
					<div className="flex items-center gap-4 mb-8">
						{/* Mobile Search Toggle Button */}
						<button
							onClick={() => setIsSearchExpanded(!isSearchExpanded)}
							className="md:hidden flex items-center justify-center w-10 h-10 bg-card text-text border border-muted rounded-lg hover:bg-muted/50 transition-colors"
						>
							<Search className="w-5 h-5" />
						</button>

						{/* Search Bar - Full width on mobile when expanded, always visible on desktop */}
						<div
							className={`${isSearchExpanded ? "flex" : "hidden"
								} md:flex relative flex-1 max-w-2xl`}
						>
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text opacity-50 pointer-events-none" />
							<input
								type="text"
								value={searchQuery}
								onChange={(e) => handleSearch(e.target.value)}
								placeholder={getSearchPlaceholder(searchBy)}
								className="w-full bg-card text-text placeholder-text/50 border border-muted rounded-lg py-2.5 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
							/>
							{searchQuery && (
								<button
									onClick={() => handleSearch("")}
									className="absolute right-3 top-1/2 -translate-y-1/2 text-text opacity-50 hover:opacity-100 transition-opacity"
								>
									<X className="w-4 h-4" />
								</button>
							)}
						</div>

						{/* Filter Dropdowns - Always show */}
						{/* Search By Dropdown */}
						<div className="hidden md:block">
							<Dropdown
								label="Search by"
								value={searchBy}
								options={searchByOptions}
								onChange={(val) => setSearchBy(val as SearchByOption)}
							/>
						</div>

						{/* Sort By Dropdown - Hide for user search */}
						{!isUserSearch && (
							<Dropdown
								label="Sort by"
								value={sortBy}
								options={sortByOptions}
								onChange={(val) => setSortBy(val as SortByOption)}
							/>
						)}
					</div>

					{/* User Search Results */}
					{isUserSearch && isSearching ? (
						<div className="space-y-4">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<UserBanner
										key={user.id}
										user={user}
										onUserClick={handleUserClick}
										onFollow={toggleFollow}
										isFollowing={followedUsers.has(user.id)}
									/>
								))
							) : (
								<div className="text-center py-16 text-text opacity-50">
									No users found matching "{searchQuery}"
								</div>
							)}
						</div>
					) : (
						<>
							{/* Cards Grid */}
							<div className="bg-background grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{visibleDrawings.length > 0 ? (
									visibleDrawings.map((drawing: Drawing, index: number) => (
										<PostCard
											key={drawing.id}
											drawing={drawing}
											index={index}
											isLiked={likedDrawings.has(drawing.id)}
											onToggleLike={toggleLike}
											onOpenComments={setOpenedDrawing}
											formatDate={formatDate}
											formatDuration={formatDuration}
											onUserClick={handleUserClick}
										/>
									))
								) : (
									<div className="col-span-3 text-center py-16 text-text opacity-50">
										{searchBy === "reference" ? (
											<>No reference search available yet</>
										) : (
											<>No results found matching "{searchQuery}"</>
										)}
									</div>
								)}
							</div>

							{/* Load More */}
							{hasMore && (
								<div className="mt-12 text-center">
									<motion.button
										onClick={handleLoadMore}
										className="cursor-pointer text-text inline-block bg-button hover:bg-primary border rounded-lg py-2.5 px-8 transition-colors"
										whileTap={{ scale: 0.96 }}
									>
										Load More
									</motion.button>
								</div>
							)}
						</>
					)}
				</motion.div>
			</section>

			{/* Comments Modal */}
			<AnimatePresence>
				{openedDrawing && (
					<CommentsModal
						drawing={openedDrawing}
						mockComments={mockComments}
						onClose={() => setOpenedDrawing(null)}
						likedDrawings={likedDrawings}
						toggleLike={toggleLike}
						initialImageIndex={0}
						onUserClick={handleUserClick}
					/>
				)}
			</AnimatePresence>
		</>
	);
}