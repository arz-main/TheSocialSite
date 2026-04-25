import type { PracticeCardProp, TimerBarProps } from "../types/PracticePageTypes";

export function TimerBar({ timeLeft, total }: TimerBarProps) {
    const pct = Math.max(0, (timeLeft / total) * 100);
    const danger = pct < 20;
    return (
        <div className="w-full h-2.5 bg-border/40 rounded-full overflow-hidden">
            <div
                className={`h-full rounded-full transition-all duration-200 ${danger ? "bg-red-400" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
            />
        </div>
    );
}

export function PracticeCard({ title, previewImage, selected, onToggle, disabled }: PracticeCardProp) {
    return (
        <div
            className={`
                relative overflow-hidden rounded-xl border-2 cursor-pointer select-none
                transition-all duration-200 aspect-[4/2]
                ${selected ? "border-primary" : "border-transparent hover:border-primary/50"}
                ${disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : ""}
            `}
            onClick={!disabled ? onToggle : undefined}
        >
            {/* Blurred background image */}
            <img
                src={previewImage}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "blur(3px) brightness(0.55)", transform: "scale(1.08)" }}
            />
            {/* Selection overlay */}
            <div className={`absolute inset-0 transition-all duration-200 ${selected ? "bg-primary/30" : "bg-black/10 hover:bg-black/0"}`} />
            {/* Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                <span className="text-white font-black text-sm text-center leading-tight drop-shadow-md">
                    {title}
                </span>
            </div>
            {/* Selected check */}
            {selected && (
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center shadow">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export function TimerRing({ timeLeft, total }: { timeLeft: number; total: number }) {
    const progress = total > 0 ? timeLeft / total : 0;
    const r = 54;
    const circ = 2 * Math.PI * r;
    const dash = `${circ * progress} ${circ}`;
    const danger = progress < 0.2;
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const display = mins > 0 ? `${mins}:${String(secs).padStart(2, "0")}` : `${timeLeft}`;
    return (
        <div className="relative flex items-center justify-center w-32 h-32">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="currentColor"
                    className="text-border opacity-30" strokeWidth="8" />
                <circle cx="60" cy="60" r={r} fill="none"
                    stroke={danger ? "#ef4444" : "var(--color-primary,#6c63ff)"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={dash}
                    strokeDashoffset="0"
                    style={{ transition: "stroke-dasharray 0.9s linear, stroke 0.3s" }}
                />
            </svg>
            <span className={`text-2xl font-mono font-bold z-10 ${danger ? "text-red-400" : "text-text"}`}>
                {display}
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
                <input type="checkbox" className="sr-only"
                    checked={checked}
                    onChange={e => !disabled && onChange(e.target.checked)}
                    disabled={disabled} />
                <div className={`w-11 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-primary" : "bg-border"}`} />
                <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-5" : ""}`} />
            </div>
            <span className="text-sm font-semibold text-text">Use Canvas</span>
        </label>
    );
}

export function ProgressPills({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex gap-1">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                        i < current ? "bg-primary opacity-60"
                        : i === current ? "bg-primary"
                        : "bg-border opacity-30"
                    }`}
                />
            ))}
        </div>
    );
}
