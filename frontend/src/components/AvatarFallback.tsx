import { useState } from "react";

interface AvatarFallbackProps {
	src?: string;
	alt: string;
	size?: number;
	className?: string;
}

export function AvatarFallback({ src, alt, size = 48, className = "" }: AvatarFallbackProps) {
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState(false);
	const initial = alt.charAt(0).toUpperCase();
	const fontSize = Math.max(10, Math.round(size * 0.38));

	return (
		<div
			className={`relative rounded-full overflow-hidden bg-accent-soft text-accent font-semibold shrink-0 ${className}`}
			style={{ width: size, height: size, minWidth: size, minHeight: size }}
		>
			<span
				style={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -52%)", // -52% instead of -50% corrects cap height
					fontSize,
					lineHeight: 1,
					userSelect: "none",
					display: "block",
				}}
			>
				{initial}
			</span>

			{src && !error && (
				<img
					src={src}
					alt={alt}
					className={`absolute inset-0 w-full h-full object-cover rounded-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
					onLoad={() => setLoaded(true)}
					onError={() => setError(true)}
				/>
			)}
		</div>
	);
}