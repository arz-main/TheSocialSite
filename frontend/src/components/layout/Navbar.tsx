import { useState } from "react"
import { Link, useLocation } from "react-router-dom";
import Paths from "../../routes/paths";
import WebsiteLogo from "../ui/SiteLogo";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { Sidebar } from "../../pages/SidePanel"


const Navbar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();

	// Helper function to check if link is active
	const isActive = (path: string) => {
		return location.pathname === path || location.pathname.startsWith(path + '/');
	};

	return (
		<>
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<nav className="fixed top-0 left-0 w-full h-16 bg-card shadow-sm flex items-center justify-between px-8 z-50 border-b border-border">
				{/* Left: hamburger + logo */}
				<div className="flex items-center gap-4">
					<motion.button
						onClick={() => setSidebarOpen(true)}
						className="group flex justify-center items-center w-10 h-10 rounded-lg transition-colors hover:bg-primary"
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
						aria-label="Open sidebar"
					>
						<Menu className="text-text transition-colors group-hover:text-white" />
					</motion.button>

					<WebsiteLogo />
				</div>
				<div className="flex gap-2">
					<Link
						to={Paths.home}
						className={`py-2 px-4 rounded-xl font-semibold transition-all ${isActive(Paths.home)
							? 'bg-primary text-white'
							: 'text-text hover:text-white hover:bg-primary'
							}`}
					>
						Home
					</Link>
					<Link
						to={Paths.practice}
						className={`py-2 px-4 rounded-xl font-semibold transition-all ${isActive(Paths.practice)
							? 'bg-primary text-white'
							: 'text-text hover:text-white hover:bg-primary'
							}`}
					>
						Practice
					</Link>
					<Link
						to={Paths.explore}
						className={`py-2 px-4 rounded-xl font-semibold transition-all ${isActive(Paths.explore)
							? 'bg-primary text-white'
							: 'text-text hover:text-white hover:bg-primary'
							}`}
					>
						Explore
					</Link>
					<Link
						to={Paths.about}
						className={`py-2 px-4 rounded-xl font-semibold transition-all ${isActive(Paths.about)
							? 'bg-primary text-white'
							: 'text-text hover:text-white hover:bg-primary'
							}`}
					>
						About
					</Link>
				</div>
			</nav>
		</>
	);

};

export default Navbar;