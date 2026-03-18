import type { LucideIcon } from "lucide-react";
import type { MockDrawing } from "../_mock/mockPracticePage";

export type SessionState = "idle" | "active" | "paused" | "done";

export type TimerBarProps = {
    timeLeft: number;
    total: number;
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