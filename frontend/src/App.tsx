import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Practice from "./pages/Practice";
import About from "./pages/About";
import Paths from "./routes/paths";
import ThemeToggle from "./components/layout/ThemeToggle";

const App = () => {
  return (
    <Router>
      <Navbar />

      {/* Theme toggle button fixed at top-right */}
      <div className="fixed bottom-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="pt-16 min-h-screen flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path={Paths.home} element={<Home />} />
            <Route path={Paths.about} element={<About />} />
            <Route path={Paths.practice} element={<Practice />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
