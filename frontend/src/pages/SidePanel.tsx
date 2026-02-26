import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
} from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import Paths from "../routes/paths";

interface SidebarProps {
	isOpen: boolean;
	onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
	const location = useLocation();

	const navItems = [
		{ path: Paths.home, label: "Home", icon: Home },
		{ path: Paths.practice, label: "Practice", icon: Image },
		{ path: Paths.explore, label: "Explore", icon: Compass },
		{ path: Paths.artist.messages, label: "Messages", icon: MessageCircle },
		{ path: Paths.artist.statistics, label: "Statistics", icon: BarChart3 },
		{ path: Paths.artist.profile, label: "Profile", icon: User },
		{ path: Paths.about, label: "About", icon: CircleQuestionMark },
	];

	const authItems = [
		{ path: Paths.login, label: "Log In", icon: LogIn },
		{ path: Paths.signup, label: "Sign Up", icon: UserPlus },
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
						className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
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
						{/* Header */}
						<div className="p-6 border-b border-border flex items-center justify-between pt-22">
							<Link to="/" onClick={onClose} className="flex items-center gap-2">
								<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
									<span className="text-primary-foreground">✏️</span>
								</div>
								<span className="text-text text-xl tracking-tight">SketchFlow</span>
							</Link>
							<motion.button
								onClick={onClose}
								className="p-2 hover:bg-muted rounded-lg transition-colors"
								whileTap={{ scale: 0.9 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<X className="text-text w-5 h-5" />
							</motion.button>
						</div>

						{/* Navigation Links */}
						<nav className="flex-1 p-4 overflow-y-auto">
							<div className="space-y-1 gap-2">
								{navItems.map((item) => {
									const isActive = location.pathname === item.path;
									const Icon = item.icon;

									return (
										<Link className="text-text" key={item.path} to={item.path} onClick={onClose}>
											<motion.div
												className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
														? "bg-button text-white"
														: "text-foreground hover:bg-muted"
													}`}
												whileTap={{ scale: 0.98 }}
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 17,
												}}
											>
												<Icon className="w-5 h-5" />
												<span>{item.label}</span>
											</motion.div>
										</Link>
									);
								})}
							</div>
						</nav>

						{/* Auth Section */}
						<div className="p-4 border-t border-border">
							<div className="mb-2 text-sm text-text px-">
								Account
							</div>
							<div className="flex flex-col space-y-1">
								{authItems.map((item) => {
									const Icon = item.icon;

									return (
										<Link className="text-text" key={item.path} to={item.path} onClick={onClose}>
											<motion.div
												whileTap={{ scale: 0.98 }}
												transition={{
													type: "spring",
													stiffness: 400,
													damping: 17,
												}}
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
