import { Link } from "react-router-dom";
import Paths from "../../routes/paths";
import SiteLogo from  "../../assets/world_logo.svg";

const Navbar = () => {
	return (
		<nav className="shadow fixed top-0 left-0 w-full h-16 bg-primary flex items-center justify-between px-8 z-50">
			<img src={SiteLogo} alt="React Logo" className="h-10 w-10" />
			<div className="flex gap-4">
				<Link to={Paths.home} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Home</Link>
				<Link to={Paths.practice} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Practice</Link>
				<Link to={Paths.explore} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Explore</Link>
				<Link to={Paths.statistics} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Stats</Link>
				<Link to={Paths.about} className="text-background hover:text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">About</Link>
			</div>
		</nav>
	);
};

export default Navbar;