import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ThemeToggle from "./components/layout/ThemeToggle";

import Home from "./pages/Home";
import Practice from "./pages/Practice";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Admin from "./pages/Admin";

import Paths from "./routes/paths";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Unauthorized from "./pages/Unauthorised";

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
						<Route path={Paths.artist.practice} element={<Practice />} />
						<Route path={Paths.explore} element={<Explore />} />
						<Route path={Paths.artist.statistics} element={
							<ProtectedRoute allowedRoles={["artist", "admin"]}>
								<Statistics />
							</ProtectedRoute>
						} />
						<Route path={Paths.login} element={<Login />} />
						<Route path={Paths.signup} element={<SignUp />} />
						<Route path={Paths.admin.dashboard} element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<Admin />
							</ProtectedRoute>
						} 
	/>
						<Route path={Paths.unauthorized} element={<Unauthorized />} />
					</Routes>
				</main>
			</div>
			<Footer />
		</Router>
	);
};

export default App;
