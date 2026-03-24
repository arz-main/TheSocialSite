import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
	Home,
	Image,
	BarChart3,
	User,
	Compass,
	MessageCircle,
	X,
	LogIn,
	CircleQuestionMark,
	UserPlus,
	Sun,
	Moon,
	Icon,
} from "lucide-react";
import { Button } from "../ui/BasicButton";
import paths from "../../routes/paths";
import switchTheme from "../../utils/ThemeUtil";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const location = useLocation();
	const themes = ["light", "dark"];
	const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

	// Initialize theme
	useEffect(() => {
		const storedTheme = localStorage.getItem("theme");
		if (storedTheme) {
			const index = themes.indexOf(storedTheme);
			if (index >= 0) {
				setCurrentThemeIndex(index);
				switchTheme(storedTheme);
				return;
			}
		}
		switchTheme(themes[0]);
	}, []);

	// Close sidebar on route change
	useEffect(() => {
		onClose();
	}, [location.pathname]);

	const handleToggle = () => {
		const nextIndex = (currentThemeIndex + 1) % themes.length;
		const nextTheme = themes[nextIndex];

		setCurrentThemeIndex(nextIndex);
		switchTheme(nextTheme);
		localStorage.setItem("theme", nextTheme);
	};

	const navItems = [
		{ path: paths.home, label: "Home", icon: Home },
		{ path: paths.practice, label: "Practice", icon: Image },
		{ path: paths.explore.page, label: "Explore", icon: Compass },
		{ path: paths.artist.messages, label: "Messages", icon: MessageCircle },
		{ path: paths.artist.statistics, label: "Statistics", icon: BarChart3 },
		{ path: paths.artist.profile, label: "Profile", icon: User },
		{ path: paths.about, label: "About", icon: CircleQuestionMark },
	];

	const authItems = [
		{ path: paths.login, label: "Log In", icon: LogIn },
		{ path: paths.signup, label: "Sign Up", icon: UserPlus },
	];

	return (
		<>
			{/* Backdrop */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 bg-background-opposite/30 backdrop-blur-sm z-40"
						onClick={onClose}
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<AnimatePresence>
				{isOpen && (
					<motion.aside
						initial={{ x: -300 }}
						animate={{ x: 0 }}
						exit={{ x: -300 }}
						transition={{ type: "spring", stiffness: 300, damping: 30 }}
						className="fixed left-0 top-0 bottom-0 w-72 bg-card border-r border-border z-50 flex flex-col"
					>
						{/* Navigation */}
						<nav className="flex-1 p-4 pt-18 overflow-y-auto">
							<div className="space-y-2">
								{navItems.map((item) => {
									const isActive = item.path === paths.home
										? location.pathname === paths.home
										: location.pathname.startsWith(item.path);
									const Icon = item.icon;

									return (
										<Link
											className="text-text"
											key={item.path}
											to={item.path}
											onClick={onClose}
										>
											<motion.div
												className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
													? "bg-button text-text-opposite"
													: "text-text hover:bg-primary/10 hover:text-primary"
													}`}
												whileTap={{ scale: 0.98 }}
												transition={{ type: "spring", stiffness: 400, damping: 17 }}
											>
												<Icon className="w-5 h-5" />
												<span>{item.label}</span>
											</motion.div>
										</Link>
									);
								})}
							</div>
						</nav>

						{/* Theme */}
						<div className="p-4 border-t border-border">
							<div className="mb-2 text-sm text-text-opaque px-1">
								Theme
							</div>

							<motion.div
								onClick={handleToggle}
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button
									variant="outline"
									className="w-full justify-start gap-3"
								>
									{currentThemeIndex === 0 ? (
										<Moon className="w-4 h-4" />
									) : (
										<Sun className="w-4 h-4" />
									)}
									Change Theme
								</Button>
							</motion.div>
						</div>

						{/* Auth */}
						<div className="p-4 border-t border-border">
							<div className="mb-2 text-sm text-text-opaque px-1">
								Account
							</div>
							<div className="flex flex-col space-y-1">
								{authItems.map((item) => {
									const Icon = item.icon;

									return (
										<Link
											className="text-text"
											key={item.path}
											to={item.path}
											onClick={onClose}
										>
											<motion.div
												whileTap={{ scale: 0.98 }}
												transition={{ type: "spring", stiffness: 400, damping: 17 }}
											>
												<Button
													variant="outline"
													className="w-full justify-start gap-3"
												>
													<Icon className="w-4 h-4" />
													{item.label}
												</Button>
											</motion.div>
										</Link>
									);
								})}
							</div>
						</div>
					</motion.aside>
				)}
			</AnimatePresence>
		</>
	);
} 