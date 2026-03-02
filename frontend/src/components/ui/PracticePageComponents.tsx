import type { PracticeCardProp, TimerBarProps } from "../../types/PracticePageTypes";
import { getCircleDash, formatTime } from "../../utils/PracticePageUtils";

export function TimerBar({ timeLeft, total }: TimerBarProps) {
  const percentage = Math.max(0, (timeLeft / total) * 100);

  return (
    <div className="w-full h-2 bg-gray-300 rounded overflow-hidden">
      <div
        className="h-full bg-primary transition-all duration-200"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function PracticeCard({ title, selected, onToggle, disabled }: PracticeCardProp) {
	return (
		<div
			className={`
				flex flex-col w-full h-15 rounded-xl border-2 p-4 shadow items-center
				justify-center transition-colors duration-150
				${selected
					? "border-primary bg-primary/10"
					: "border-transparent bg-card hover:border-primary"
				}
				${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
			`}
			onClick={!disabled ? onToggle : undefined}
		>
			<h1 className={`text-lg font-semibold ${selected ? "text-primary" : "text-text"}`}>
				{title}
			</h1>
		</div>
	)
}

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