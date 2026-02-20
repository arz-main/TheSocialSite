import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "../components/ui/BasicButton";
import { Card } from "../components/ui/Card";
import { Input } from "../utils/input";
import { Label } from "../utils/label";
import Paths from "../routes/paths";
import { findUser } from "../_mock/mockUsers";


export default function Login() {
	const [showPassword, setShowPassword] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const navigate = useNavigate();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const user = findUser(email, password);

		if (!user) {
			alert("Invalid email or password");
			return;
		}

		localStorage.setItem("currentUser", JSON.stringify(user));

		// redirect based on role
		switch (user.role) {
			case "admin":
				navigate(Paths.admin.dashboard);
				break;
			case "artist":
			default:
				navigate(Paths.home);
				break;
		}
	};
	return (
		<div className="flex items-center justify-center py-12 px-4 bg-background text-text min-h-screen">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<Link to={Paths.home} className="inline-flex items-center gap-2 mb-6">
						<div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
							<span className="text-2xl">✏️</span>
						</div>
					</Link>
					<h1 className="mb-2">Welcome Back</h1>
				</div>

				<Card className="p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
								<Input
									id="email"
									type="email"
									placeholder="your@email.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
                  					className="pl-10 bg-background"
									required
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />
								<Input
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="••••••••"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
                 					className="px-10 bg-background"
									required
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-foreground transition-colors"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<label className="flex items-center gap-2 text-sm">
								<input
									type="checkbox"
									className="rounded border-border text-primary focus:ring-primary"
								/>
								<span>Remember me</span>
							</label>
							<Link
								to={Paths.forgot_password}
								className="text-sm text-primary hover:underline"
							>
								Forgot password?
							</Link>
						</div>

						<motion.div
							whileTap={{ scale: 0.98 }}
							transition={{ type: "spring", stiffness: 400, damping: 17 }}
						>
							<Button type="submit" className="w-full h-11">
								Log In
							</Button>
						</motion.div>

						<div className="relative my-6">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-border"></div>
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-card px-4">
									Or continue with
								</span>
							</div>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<motion.div
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button variant="outline" className="w-full" type="button">
									<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
										<path
											fill="currentColor"
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										/>
										<path
											fill="currentColor"
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										/>
										<path
											fill="currentColor"
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
										/>
										<path
											fill="currentColor"
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
										/>
									</svg>
									Google
								</Button>
							</motion.div>
							<motion.div
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button variant="outline" className="w-full" type="button">
									<svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
										<path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
									</svg>
									GitHub
								</Button>
							</motion.div>
						</div>
					</form>

					<div className="mt-6 text-center text-sm">
						<span className="text-muted-foreground">Don't have an account? </span>
						<Link to={Paths.signup} className="text-primary hover:underline">
							Sign up
						</Link>
					</div>
				</Card>
			</motion.div>
		</div>
	);
}