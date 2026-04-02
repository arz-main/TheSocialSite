import { motion } from "motion/react";

interface LoadingScreenProps {
	message?: string;
}

export default function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
	return (
		<div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-background text-text">
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
				className="flex flex-col items-center gap-6"
			>
				{/* Spinner */}
				<div className="relative w-12 h-12">
					{/* Track ring */}
					<div className="absolute inset-0 rounded-full border-2 border-border opacity-40" />

					{/* Spinning arc */}
					<motion.div
						className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary"
						animate={{ rotate: 360 }}
						transition={{
							duration: 0.9,
							repeat: Infinity,
							ease: "linear",
						}}
					/>

					{/* Inner pulse dot */}
					<motion.div
						className="absolute inset-0 flex items-center justify-center"
						animate={{ opacity: [0.4, 1, 0.4] }}
						transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
					>
						<div className="w-1.5 h-1.5 rounded-full bg-primary" />
					</motion.div>
				</div>

				{/* Message */}
				<motion.p
					className="text-sm text-text-opaque tracking-wide"
					animate={{ opacity: [0.5, 1, 0.5] }}
					transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
				>
					{message}
				</motion.p>
			</motion.div>
		</div>
	);
}