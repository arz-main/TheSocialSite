import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import paths from "../routes/paths";
import WebsiteLogo from "../components/SiteLogo";
import { Menu, Home, Image, Compass, Map } from "lucide-react";
import { motion } from "framer-motion";
import { Sidebar } from "./SidePanel";

const Navbar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();

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

				{/* ✅ Desktop nav (text) */}
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

				{/* ✅ Mobile nav (icons) */}
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
			</nav>
		</>
	);
};

export default Navbar;