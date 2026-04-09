import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
    noScroll?: boolean;
}

const Layout = ({ noScroll = false }: LayoutProps) => {
    return (
        <div className={`flex flex-col ${noScroll ? "h-screen overflow-hidden" : "min-h-screen"}`}>
            <Navbar />
            <main className={`flex-1 pt-16 flex flex-col ${noScroll ? "overflow-auto" : ""}`}>
                <Outlet />
            </main>
            {!noScroll && <Footer />}
        </div>
    );
};

export default Layout;