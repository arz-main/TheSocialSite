import { Link } from "react-router-dom";
import ReactLogo from '../../assets/world_logo.svg';

const Navbar = () => {
	return (
		<nav className="fixed top-0 left-0 w-full h-16 bg-gray-800 text-white flex items-center px-6 z-50">
			<div className="flex space-x-6">
				<img src={ReactLogo} alt="React Logo" className="h-10 w-10" />
				<Link to="/" className="hover:underline font-semibold">Home</Link>
				<Link to="/about" className="hover:underline font-semibold">About</Link>
				<Link to="/contact" className="hover:underline font-semibold">Contact</Link>
			</div>
		</nav>
	);
};

export default Navbar;