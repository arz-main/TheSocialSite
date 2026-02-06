// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import About from "./pages/About";

const App = () => {
	return (
		<Router>
			{/* Navbar fixed at top */}
			<Navbar />

			{/* Main layout: full screen height */}
			<div className="pt-16 min-h-screen flex flex-col">
				{/* This section grows to fill space */}
				<main className="flex-1">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/about" element={<About />} />
					</Routes>
				</main>

				{/* Footer always at bottom */}
				<Footer />
			</div>
		</Router>
	);
};

export default App;
