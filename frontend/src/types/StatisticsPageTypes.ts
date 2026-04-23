import type { LucideIcon } from "lucide-react";
import type { MockDrawing } from "../_mock/mockPracticePage";

export type SessionState = "idle" | "active" | "paused" | "done";


// -----------------------------
// TYPES
// -----------------------------

export type Badge = {
    id: string;
    icon: string;
    name: string;
    description: string;
    earned: boolean;
    earnedDate?: string;
};

export type FollowersData = {
    date: string;
    followers: number;
};

export type PostsData = {
    date: string;
    posts: number;
};

export type SpeedData = {
    name: string;
    minutes: number;
};

export type TimerBarProps = {
    timeLeft: number;
    total: number;
};

export type StatisticsCardProp = {
    icon: LucideIcon;
    value: string | number;
    title: string;
    trend?: string;
    trendUp?: boolean;
    tooltip?: string; // <-- New optional tooltip prop
};

export type CategoryItem = {
    name: string;
    value: number;
    fill: string;
    icon: string;
};

export type DailyContribution = {
    date: string;   // e.g. "2026-04-02"
    count: number;  // number of drawings that day
    level?: number;
};

export type PracticeCardProp = {
    id: number;
    icon: LucideIcon;
    title: string;
    selected?: boolean;
    onToggle?: () => void;
    disabled?: boolean;
}

export interface ActiveSessionPanelProps {
    drawing: MockDrawing;
    drawingIndex: number;
    totalDrawings: number;
    timeLeft: number;
    timePerDrawing: number;
    sessionState: SessionState;
    useCanvas: boolean;
    clearSignal: number;        // increments on each new drawing → canvas clears
    onPause: () => void;
    onResume: () => void;
    onSkip: () => void;
    onStop: () => void;
    onCanvasCapture: (drawingId: number, dataUrl: string) => void;
}

export interface SessionResult {
    drawing: MockDrawing;
    canvasDataUrl: string | null;
}

export interface PostDrawingPanelProps {
    result: SessionResult;
    onClose: () => void;
    onUploadToProfile: (withRef: boolean) => void;
    onSendToFriend: () => void;
    onDownload: () => void;
}

export interface DrawingReviewGridProps {
    results: SessionResult[];
    useCanvas: boolean;
    onSelectResult: (result: SessionResult) => void;
    onRestart: () => void;
}