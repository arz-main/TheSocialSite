import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../utils/input";
import { Label } from "../utils/label";
import Paths from "../routes/paths";
import { findUser } from "../_mock/mockUsers";
import type { MockUser } from "../_mock/mockUsers";


export default function AdminLogin() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const navigate = useNavigate();

	const handleLogin = () => {
		const user: MockUser | null = findUser(email, password);
		if (!user) {
			setError("Invalid email or password");
			return;
		}
		if (user.role !== "admin") {
			setError("You are not authorized to access the admin dashboard");
			return;
		}
		// Store user info (optional)
		localStorage.setItem("currentUser", JSON.stringify(user));
		// Redirect to admin dashboard
		navigate(Paths.admin.dashboard);
	};

	return (
		<div className="flex flex-1 items-center justify-center py-12 px-4 bg-background text-text">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold mb-2">Admin Login</h1>
					<p className="text-text-opaque">Enter your admin credentials</p>
				</div>

				<Card className="p-8">
					<form className="space-y-6" onSubmit={(e) => {
						e.preventDefault(); // prevent default page reload
						handleLogin();
					}}>
						{/* Email */}
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5" />
								<Input
									id="email"
									type="email"
									placeholder="your@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pr-10 bg-background"
									required
								/>
							</div>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									className="pr-10 bg-background"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-text-opaque"
								>
									{showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
								</button>
							</div>
						</div>

						{/* Error message */}
						{error && <p className="text-red-500 text-sm">{error}</p>}

						{/* Login button */}
						<motion.div
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Button type="submit" className="w-full h-11">
								Log In
							</Button>
						</motion.div>

						<div className="mt-6 text-center text-sm">
							<Link to={Paths.home} className="text-primary hover:underline">
								Back to Home
							</Link>
						</div>
					</form>
				</Card>
			</motion.div>
		</div>
	);
}