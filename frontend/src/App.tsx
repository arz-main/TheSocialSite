import { Routes, Route } from "react-router-dom";
import { } from "./providers/AxiosProvider";
import ProtectedRoute from "./layout/ProtectedRoute";
import LoadingScreen from "./components/LoadingScreen";

import Home from "./pages/Home";
import ArtistProfile from "./pages/ArtistProfile";
import OthersProfile from "./pages/OthersProfile";
import EditProfile from "./pages/EditProfile";
import Practice from "./pages/Practice";
import Roadmap from "./pages/Roadmap";
import About from "./pages/About";
import Explore from "./pages/Explore";
import Statistics from "./pages/Statistics";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Forbidden from "./pages/Forbidden";
import Unauthorized from "./pages/Unauthorised";
import InternalServerError from "./pages/InternalServerError";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages"
import ForgotPassword from "./pages/ForgotPassword";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import AdminDashboard from "./pages/AdminDashboard";
import ScrollToTop from "./components/ScrollToTop";

import CourseRoadmap from "./pages/CourseRoadmap";
import AdminCourseCreator from "./pages/AdminCourseCreator";
import LessonPage from "./pages/LessonPage";

import paths from "./routes/paths";
import { useAuth } from "./hooks/useAuth"
import Layout from "./layout/Layout";

const App = () => {
	const { initializing } = useAuth();
	if (initializing) return <LoadingScreen />;
	return (
		<>
			<ScrollToTop />
			<Routes>
				{/* Place pages that require scrolling here */}
				<Route element={<Layout />}>
					<Route path={paths.home} element={<Home />} />
					<Route path={paths.about} element={<About />} />
					<Route path={paths.explore.page} element={<Explore />} />
					<Route path={paths.explore.user} element={<OthersProfile />} />
					<Route path={paths.roadmap.page} element={<Roadmap />} />
					<Route path={paths.terms} element={<Terms />} />
					<Route path={paths.privacy} element={<Privacy />} />
					<Route path={paths.roadmap.course} element={<CourseRoadmap />} />
					<Route path={paths.roadmap.lesson} element={<LessonPage />} />
					<Route path={paths.artist.statistics} element={
						<ProtectedRoute allowedRoles={["User", "Admin"]}>
							<Statistics />
						</ProtectedRoute>
					} />
					<Route path={paths.artist.edit_profile} element={
						<ProtectedRoute allowedRoles={["User", "Admin"]}>
							<EditProfile />
						</ProtectedRoute>
					} />
					<Route path={paths.artist.profile} element={
						<ProtectedRoute allowedRoles={["User", "Admin"]}>
							<ArtistProfile />
						</ProtectedRoute>
					} />

					{/* admin only */}
					<Route path={paths.admin.dashboard} element={
						<ProtectedRoute allowedRoles={["Admin"]}>
							<AdminDashboard />
						</ProtectedRoute>
					} />

					<Route path={paths.admin.course_creator} element={
						<ProtectedRoute allowedRoles={["Admin"]}>
							<AdminCourseCreator />
						</ProtectedRoute>
					} />
				</Route>

				{/* Pages that dont require scrolling */}
				<Route element={<Layout noScroll />}>
					<Route path={paths.artist.messages} element={
						<ProtectedRoute allowedRoles={["User", "Admin"]}>
							<Messages />
						</ProtectedRoute>
					} />
					<Route path={paths.practice} element={<Practice />} />
					<Route path={paths.login} element={<Login />} />
					<Route path={paths.signup} element={<SignUp />} />
					<Route path={paths.forgot_password} element={<ForgotPassword />} />

					{/* error pages */}
					<Route path={paths.error.unauthorized} element={<Unauthorized />} />
					<Route path={paths.error.forbidden} element={<Forbidden />} />
					<Route path={paths.error.internal_server_error} element={<InternalServerError />} />
					<Route path={paths.error.not_found} element={<NotFound />} />
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</>
	);
};

export default App;			