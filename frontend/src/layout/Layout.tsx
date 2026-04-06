import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
    noScroll?: boolean;
}

const Layout = ({ noScroll = false }: LayoutProps) => {
    return (
        <div className={`flex flex-col min-h-screen ${noScroll ? "overflow-hidden" : ""}`}>
            <Navbar />

            <main className={`flex-1 pt-16 ${noScroll ? "overflow-hidden" : ""}`}>
                <Outlet />
            </main>

            {!noScroll && <Footer />}
        </div>
    );
};

export default Layout;