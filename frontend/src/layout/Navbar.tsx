import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import paths from "../routes/paths";
import WebsiteLogo from "../components/SiteLogo";
import { Menu, Home, Image, Compass, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "./SidePanel";
import { useAuth } from "../hooks/useAuth";

const Navbar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { currentUser } = useAuth();

	const isActive = (path: string) => {
		return (
			location.pathname === path ||
			location.pathname.startsWith(path + "/")
		);
	};

	const navItems = [
		{ path: paths.home, label: "Home", icon: Home },
		{ path: paths.practice, label: "Practice", icon: Image },
		{ path: paths.roadmap.page, label: "Roadmap", icon: Map },
		{ path: paths.explore.page, label: "Explore", icon: Compass },
	];

	return (
		<>
			<Sidebar
				isOpen={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
			/>

			<nav className="fixed top-0 left-0 w-full h-16 bg-card shadow-sm flex items-center justify-between px-4 md:px-8 z-50 border-b border-border">
				{/* Left */}
				<div className="flex items-center gap-4">
					<motion.button
						onClick={() => setSidebarOpen((prev) => !prev)}
						className="group flex justify-center items-center w-10 h-10 rounded-lg transition-colors hover:bg-primary"
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
					>
						<Menu className="text-text group-hover:text-white" />
					</motion.button>

					<WebsiteLogo />
				</div>

				{/* Right — nav + avatar/login */}
				<div className="flex items-center gap-2">
					{/* Desktop nav (text) */}
					<div className="hidden md:flex gap-2">
						{navItems.map((item) => (
							<Link
								key={item.path}
								to={item.path}
								className={`py-2 px-4 rounded-xl font-semibold transition-all ${
									isActive(item.path)
										? "bg-primary text-white"
										: "text-text hover:text-white hover:bg-primary"
								}`}
							>
								{item.label}
							</Link>
						))}
					</div>

					{/* Mobile nav (icons) */}
					<div className="flex md:hidden gap-1">
						{navItems.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.path}
									to={item.path}
									className={`p-2 rounded-lg transition-all ${
										isActive(item.path)
											? "bg-primary text-white"
											: "text-text hover:bg-primary hover:text-white"
									}`}
								>
									<Icon className="w-5 h-5" />
								</Link>
							);
						})}
					</div>

					{/* Avatar or login */}
					{currentUser ? (
						<motion.button
							onClick={() => navigate(paths.artist.profile)}
							className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-border hover:ring-primary transition-all shrink-0"
							whileTap={{ scale: 0.9 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							{currentUser.avatarUrl ? (
								<img src={currentUser.avatarUrl} alt={currentUser.username} className="w-full h-full object-cover" />
							) : (
								<div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-white">
									{currentUser.username?.charAt(0)?.toUpperCase()}
								</div>
							)}
						</motion.button>
					) : (
						<motion.button
							onClick={() => navigate(paths.login)}
							className="px-4 py-1.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
							whileTap={{ scale: 0.95 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							Log in
						</motion.button>
					)}
				</div>
			</nav>
		</>
	);
};

export default Navbar;