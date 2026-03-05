import { motion } from "framer-motion";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/InputComponent";
import { Label } from "../components/ui/LabelComponent";
import { Button } from "../components/ui/BasicButton";
import { Lock } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [success, setSuccess] = useState(false);

	const [searchParams] = useSearchParams();
	const token = searchParams.get("token");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		console.log({
			token,
			password,
		});

		// TODO: call API
		// POST /auth/reset-password

		setSuccess(true);
	}

	return (
		<section className="flex flex-1 bg-background py-8 px-4 justify-center text-text">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold mb-2">
						Reset Password
					</h1>
					<p className="text-sm text-text-opaque">
						Enter your new password below
					</p>
				</div>

				<Card className="p-8">
					{success ? (
						<p className="text-center text-sm">
							Password successfully reset. You can now log in.
						</p>
					) : (
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* New Password */}
							<div className="space-y-2">
								<Label htmlFor="password">
									New Password
								</Label>

								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />

									<Input
										id="password"
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										className="pl-10 bg-background"
										required
									/>
								</div>
							</div>

							{/* Confirm Password */}
							<div className="space-y-2">
								<Label htmlFor="confirmPassword">
									Confirm Password
								</Label>

								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" />

									<Input
										id="confirmPassword"
										type="password"
										value={confirmPassword}
										onChange={(e) =>
											setConfirmPassword(e.target.value)
										}
										className="pl-10 bg-background"
										required
									/>
								</div>
							</div>

							<motion.div
								whileTap={{ scale: 0.98 }}
								transition={{
									type: "spring",
									stiffness: 400,
									damping: 17,
								}}
							>
								<Button
									type="submit"
									className="w-full h-11"
								>
									Reset Password
								</Button>
							</motion.div>
						</form>
					)}
				</Card>
			</motion.div>
		</section>
	);
}