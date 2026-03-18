import type { PracticeCardProp, TimerBarProps } from "../../types/PracticePageTypes";
import { getCircleDash, formatTime } from "../../utils/PracticePageUtils";

export function TimerBar({ timeLeft, total }: TimerBarProps) {
    const percentage = Math.max(0, (timeLeft / total) * 100);
    const danger = percentage < 20;
    return (
        <div className="w-full h-2 bg-gray-300 rounded overflow-hidden">
            <div
                className={`h-full transition-all duration-200 ${danger ? "bg-red-400" : "bg-primary"}`}
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
}

export function PracticeCard({ title, icon: Icon, selected, onToggle, disabled }: PracticeCardProp) {
    return (
        <div
            className={`
                flex flex-col w-full rounded-xl border-2 p-3 shadow items-center
                justify-center gap-1 transition-colors duration-150
                ${selected ? "border-primary bg-primary/10" : "border-transparent bg-card hover:border-primary"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
            onClick={!disabled ? onToggle : undefined}
        >
            <Icon className={`w-5 h-5 ${selected ? "text-primary" : "text-text-opaque"}`} />
            <span className={`text-sm font-semibold text-center leading-tight ${selected ? "text-primary" : "text-text"}`}>
                {title}
            </span>
        </div>
    );
}

export function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
    const progress = total > 0 ? timeLeft / total : 0;
    const r = 54;
    const danger = progress < 0.2;
    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor"
                    className="text-card-border opacity-20" strokeWidth="8" />
                <circle cx="60" cy="60" r={r} fill="none"
                    stroke={danger ? "#ef4444" : "var(--primary)"}
                    strokeWidth="8" strokeLinecap="round"
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
}

export function CanvasToggle({ checked, onChange, disabled }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    disabled?: boolean;
}) {
    return (
        <label className={`flex items-center gap-3 cursor-pointer select-none ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={e => !disabled && onChange(e.target.checked)}
                    disabled={disabled}
                />
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-gray-300"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-medium text-text">Use Canvas</span>
        </label>
    );
}

export function ProgressPills({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < current ? "bg-primary opacity-60"
                            : i === current ? "bg-primary"
                                : "bg-card-border opacity-20"
                        }`}
                />
            ))}
        </div>
    );
}