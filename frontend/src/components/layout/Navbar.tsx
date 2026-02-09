import { Link } from "react-router-dom";
import ReactLogo from '../../assets/world_logo.svg';

const Navbar = () => {
	return (
		<nav className="shadow fixed top-0 left-0 w-full h-16 bg-white text-text flex items-center justify-between px-8">
			<img src={ReactLogo} alt="React Logo" className="h-10 w-10" />
			<div className="flex gap-4">
				<Link to="/" className="hover:bg-[#fdf5e2] py-2 px-3 rounded-xl border-none font-semibold">Home</Link>
				<Link to="/about" className="hover:bg-[#fdf5e2]  py-2 px-3 rounded-xl border-none font-semibold">About</Link>
				<Link to="/contact" className="hover:bg-[#fdf5e2]  py-2 px-3 rounded-xl border-none font-semibold">Contact</Link>
			</div>
		</nav>
	);
};

export default Navbar;