import { Link } from "react-router-dom";
import paths from "../../routes/paths";
import Logo from "../../assets/3dicons-pencil.png";

const WebsiteLogo = () => {
  return (
    <Link
      to={paths.home}
      className="border-none rounded-lg flex items-center gap-2 px-2 py-1"
    >
      <img
        src={Logo}
        alt="Site Logo"
        className="w-8 h-8"
      />
      <span className="font-bold text-lg text-primary">SketchFlow</span>
    </Link>
  );
};

export default WebsiteLogo;