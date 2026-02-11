import { Link } from "react-router-dom";
import SiteLogo from  "../../assets/world_logo.svg";
import Paths from "../../routes/paths";

const Navbar = () => {
	return (
		<nav className="shadow fixed top-0 left-0 w-full h-16 bg-primary flex items-center justify-between px-8">
			<img src={SiteLogo} alt="React Logo" className="h-10 w-10" />
			<div className="flex gap-4">
				<Link to={Paths.home} className="text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Home</Link>
				<Link to={Paths.practice} className="text-text hover:bg-background  py-2 px-4 rounded-xl border-none font-semibold">Practice</Link>
				<Link to={Paths.explore} className="text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">Explore</Link>
				<Link to={Paths.about} className="text-text hover:bg-background py-2 px-4 rounded-xl border-none font-semibold">About</Link>
			</div>
		</nav>
	);
};

export default Navbar;