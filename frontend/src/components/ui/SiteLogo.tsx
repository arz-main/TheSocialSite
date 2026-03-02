import { Link } from "react-router-dom";
import Paths from "../../routes/paths";
import Logo from "../../assets/3dicons-pencil.png"

const WebsiteLogo = () => {
    return (
        <Link
            to={Paths.home}
            className="bg-background border border-none rounded-lg flex items-center justify-center w-10 h-10"
        >
            <img
                src={Logo}
                alt="Site Logo"
                className="w-full h-full"
            />
        </Link>
    )
};

export default WebsiteLogo;
