import {useState} from "react"
import { Link } from "react-router-dom";
import Paths from "../../routes/paths";
import SiteLogo from  "../../assets/world_logo.svg";
import { Menu } from "lucide-react";
import { motion } from "motion/react";
import { Sidebar } from "../../pages/SidePanel"


const Navbar = () => {
	  const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
	  <nav className="shadow fixed top-0 left-0 w-full h-16 bg-primary flex items-center justify-between px-8 z-50">
		{/* Left: hamburger + logo */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-background/20 rounded-lg transition-colors"
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5 text-background" />
          </motion.button>

          <Link to={Paths.home} className="flex items-center">
            <img src={SiteLogo} alt="Site Logo" className="h-10 w-10" />
          </Link>
        </div>
			<div className="flex gap-4">
				<Link to={Paths.home} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Home</Link>
				<Link to={Paths.artist.practice} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Practice</Link>
				<Link to={Paths.explore} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Explore</Link>
				<Link to={Paths.artist.statistics} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Stats</Link>
				<Link to={Paths.profile} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Profile</Link>
			</div>
		</nav>
				</>
	);
	
};

export default Navbar;