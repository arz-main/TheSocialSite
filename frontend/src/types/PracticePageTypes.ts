import type { LucideIcon } from "lucide-react";
import type { mockDrawings } from "../_mock/mockDrawings";

export type SessionState = "idle" | "active" | "paused" | "done";

export type TimerBarProps = {
  timeLeft: number;       // seconds remaining
  total: number;          // total seconds
};

export type PracticeCardProp = {
	id: number
	icon: LucideIcon,
	title: string
	selected?: boolean;
	onToggle?: () => void;
	disabled?: boolean;
}

export interface ActiveSessionPanelProps {
	drawing: typeof mockDrawings[0];
	drawingIndex: number;
	totalDrawings: number;
	timeLeft: number;
	timePerDrawing: number;
	sessionState: SessionState;
	onPause: () => void;
	onResume: () => void;
	onSkip: () => void;
	onStop: () => void;
}