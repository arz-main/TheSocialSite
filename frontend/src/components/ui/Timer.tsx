import { getCircleDash, formatTime } from "../../utils/practiceUtils";


export const TimerRing = ({ timeLeft, total }: { timeLeft: number; total: number }) => {
	const progress = total > 0 ? timeLeft / total : 0;
	const r = 54;
	const danger = progress < 0.2;

	return (
		<div className="relative flex items-center justify-center w-32 h-32">
			<svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
				{/* Track */}
				<circle cx="60" cy="60" r={r} fill="none" stroke="currentColor"
					className="text-card-border opacity-20" strokeWidth="8" />
				{/* Progress */}
				<circle cx="60" cy="60" r={r} fill="none"
					stroke={danger ? "#ef4444" : "#6366f1"}
					strokeWidth="8"
					strokeLinecap="round"
					strokeDasharray={getCircleDash(progress, r)}
					strokeDashoffset="0"
					style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s" }}
				/>
			</svg>
			<span className={`text-2xl font-mono font-bold z-10 ${danger ? "text-red-400" : "text-text"}`}>
				{formatTime(timeLeft)}
			</span>
		</div>
	);
};