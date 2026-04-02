import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
    noScroll?: boolean;
}

const Layout = ({ noScroll = false }: LayoutProps) => {
    return (
        <div className={`flex flex-col ${noScroll ? "h-dvh overflow-hidden" : "min-h-screen"}`}>
            <Navbar />
            <main className={`flex-1 min-h-0 pt-16 ${noScroll ? "overflow-hidden flex flex-col" : ""}`}>
                <Outlet />
            </main>
            {!noScroll && <Footer />}
        </div>
    );
};

export default Layout;