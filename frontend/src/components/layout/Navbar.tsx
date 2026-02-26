import { useState } from "react"
import { Link } from "react-router-dom";
import Paths from "../../routes/paths";
import WebsiteLogo from "../ui/SiteLogo";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { Sidebar } from "../../pages/SidePanel"


const Navbar = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
			<Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<nav className="fixed top-0 left-0 w-full h-16 bg-primary flex items-center justify-between px-8 z-50">
				{/* Left: hamburger + logo */}
				<div className="flex items-center gap-4">
					<motion.button
						onClick={() => setSidebarOpen(true)}
						className="hover:bg-text/20 rounded-lg transition-colors w-10 h-10 flex justify-center items-center"
						whileTap={{ scale: 0.9 }}
						transition={{ type: "spring", stiffness: 400, damping: 17 }}
						aria-label="Open sidebar"
					>
						<Menu className="w-6 h-6 text-background" />
					</motion.button>

					<WebsiteLogo />
				</div>
				<div className="flex gap-4">
					<Link to={Paths.home} className="text-white hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Home</Link>
					<Link to={Paths.practice} className="text-white hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Practice</Link>
					<Link to={Paths.explore} className="text-white hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Explore</Link>
					<Link to={Paths.about} className="text-white hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">About</Link>
				</div>
			</nav>
		</>
	);

};

export default Navbar;