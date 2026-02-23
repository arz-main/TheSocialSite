import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ThemeToggle from "./components/layout/ThemeToggle";

import Home from "./pages/Home";
import Profile from "./pages/Profile"
import EditProfile from "./pages/EditProfile";
import Practice from "./pages/Practice";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AdminLogin from "./pages/AdminLogin";
import Forbidden from "./pages/Forbidden";
import Unauthorized from "./pages/Unauthorised";
import InternalServerError from "./pages/InternalServerError";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages"

import Paths from "./routes/paths";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AdminDashboard from "./pages/AdminDashboard";

const App = () => {
	return (
		<Router>
			<div className="flex flex-col min-h-screen">
				<Navbar />
				{/* Theme toggle button fixed at top-right */}
				<div className="fixed bottom-4 right-4 z-50">
					<ThemeToggle />
				</div>
				<main className="flex flex-col flex-1 pt-16">
					<Routes>
						{/* access to all users */}
						<Route path={Paths.home} element={<Home />} />
						<Route path={Paths.about} element={<About />} />
						<Route path={Paths.explore} element={<Explore />} />
						<Route path={Paths.practice} element={<Practice />} />
						<Route path={Paths.login} element={<Login />} />
						<Route path={Paths.signup} element={<SignUp />} />
						<Route path={Paths.admin_login} element={<AdminLogin />} />

						{/* access to authenticated users */}
						<Route path={Paths.artist.statistics} element={
							<ProtectedRoute allowedRoles={["artist", "admin"]}>
								<Statistics />
							</ProtectedRoute>
						} />
						<Route path={Paths.artist.messages} element={
							<ProtectedRoute allowedRoles={["artist", "admin"]}>
								<Messages />
							</ProtectedRoute>
						} />
						<Route path={Paths.artist.edit_profile} element={
							<ProtectedRoute allowedRoles={["artist", "admin"]}>
								<EditProfile />
							</ProtectedRoute>
						} />
						<Route path={Paths.artist.profile} element={
							<ProtectedRoute allowedRoles={["artist", "admin"]}>
								<Profile />
							</ProtectedRoute>
						} />

						{/* admin only */}
						<Route path={Paths.admin.dashboard} element={
							<ProtectedRoute allowedRoles={["admin"]}>
								<AdminDashboard />
							</ProtectedRoute>
						} />
						{/* urmeaza sa fie adaugate toate rutele cand paginile sunt gata */}

						{/* error pages */}
						<Route path={Paths.error.unauthorized} element={<Unauthorized />} />
						<Route path={Paths.error.forbidden} element={<Forbidden />} />
						<Route path={Paths.error.internal_server_error} element={<InternalServerError />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</main>
				<Footer />
			</div>
		</Router>

	);
};

export default App;
