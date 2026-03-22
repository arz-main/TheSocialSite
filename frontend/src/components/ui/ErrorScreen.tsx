import { motion } from "motion/react";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "./BasicButton";
import { Card } from "./Card";

interface ErrorPageProps {
	title?: string;
	message?: string;
	onRetry?: () => void;
	onBack?: () => void;
}

export default function ErrorScreen({
	title = "Failed to execute operation",
	message = "Something went wrong with data processing. Please check your connection and try again.",
	onRetry,
	onBack,
}: ErrorPageProps) {
	return (
		<div className="flex flex-col flex-1 items-center justify-center min-h-screen py-8 px-4 bg-background text-text">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md"
			>
				<Card className="p-8 flex flex-col items-center text-center gap-6">
					{/* Icon */}
					<motion.div
						initial={{ scale: 0.8, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.15, duration: 0.4, type: "spring", stiffness: 200 }}
						className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
					>
						<AlertTriangle className="w-7 h-7 text-red-500" />
					</motion.div>

					{/* Text */}
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.25, duration: 0.4 }}
						className="space-y-2"
					>
						<h1 className="text-xl font-semibold">{title}</h1>
						<p className="text-sm text-text-opaque leading-relaxed">{message}</p>
					</motion.div>

					{/* Divider */}
					<div className="w-full border-t border-border" />

					{/* Actions */}
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35, duration: 0.4 }}
						className="flex flex-col sm:flex-row gap-3 w-full"
					>
						{onRetry && (
							<motion.div
								className="flex-1"
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button onClick={onRetry} className="w-full h-11 gap-2">
									<RefreshCw className="w-4 h-4" />
									Try Again
								</Button>
							</motion.div>
						)}
						{onBack && (
							<motion.div
								className="flex-1"
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button variant="outline" onClick={onBack} className="w-full h-11 gap-2">
									<ArrowLeft className="w-4 h-4" />
									Go Back
								</Button>
							</motion.div>
						)}
					</motion.div>
				</Card>

				{/* Footer hint */}
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 0.4 }}
					className="text-center text-xs text-text-opaque mt-4"
				>
					If this keeps happening, please contact support.
				</motion.p>
			</motion.div>
		</div>
	);
}