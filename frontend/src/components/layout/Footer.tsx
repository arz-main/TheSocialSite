import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="w-full bg-gray-800 text-white mt-12">
            <div className="flex justify-center space-x-6 py-2">
                <Link to="/" className="hover:underline text-xs text-gray-300">Home</Link>
                <Link to="/about" className="hover:underline text-xs text-gray-300">About</Link>
                <Link to="/contact" className="hover:underline text-xs text-gray-300">Contact</Link>
            </div>
            <div className="text-center text-gray-400 text-[10px] pb-2">
                &copy; {new Date().getFullYear()} TheSocialSite
            </div>
        </footer>
    );
};

export default Footer;
