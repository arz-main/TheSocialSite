import { Link } from "react-router-dom";
import Paths from "../../routes/paths";

const Footer = () => {
	return (
		<footer className="w-full bg-gray-800 text-white">
			<div className="flex justify-center space-x-6 py-2">
				<Link to={Paths.home} className="hover:underline text-xs text-gray-300">Home</Link>
				<Link to={Paths.practice} className="hover:underline text-xs text-gray-300">Practice</Link>
				<Link to={Paths.explore} className="hover:underline text-xs text-gray-300">Explore</Link>
				<Link to={Paths.statistics} className="hover:underline text-xs text-gray-300">Stats</Link>
				<Link to={Paths.about} className="hover:underline text-xs text-gray-300">About</Link>
			</div>
			<div className="text-center text-gray-400 text-[10px] pb-2">
				&copy; {new Date().getFullYear()} TheSocialSite
			</div>
		</footer>
	);
};

export default Footer;
