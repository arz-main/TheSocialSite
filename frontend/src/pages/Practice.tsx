import { useState, useEffect, useRef, useCallback } from "react";
import { Brush, RotateCcw, Pause, Play, SkipForward } from "lucide-react"
import { mockDrawings, mockCategories } from "../_mock/mockPracticePage";
import { TimerBar } from "../components/ui/PracticePageComponents";
import { PracticeCard } from "../components/ui/PracticePageComponents"
import { formatTime } from "../utils/PracticePageUtils";
import { Button } from "../components/ui/BasicButton";
import type { ActiveSessionPanelProps, SessionState } from "../types/PracticePageTypes";

const Practice = () => {
	const [numDrawings, setNumDrawings] = useState(5);
	const [timePerDrawing, setTimePerDrawing] = useState(60);
	const [sessionState, setSessionState] = useState<SessionState>("idle");
	const [drawingIndex, setDrawingIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [sessionDrawings, setSessionDrawings] = useState<typeof mockDrawings>([]);
	const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);

	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const timerDrawingRef = useRef<number>(-1);
	// Ref to the right panel — used to scroll it into view on mobile when a session starts
	const rightPanelRef = useRef<HTMLDivElement>(null);

	const toggleCategory = (id: number) => {
		setSelectedCategoryIds(prev =>
			prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
		);
	};

	const buildSession = useCallback(() => {
		const pool =
			selectedCategoryIds.length === 0
				? mockDrawings
				: mockDrawings.filter(d => selectedCategoryIds.includes(d.categoryId));

		const shuffled = [...pool].sort(() => Math.random() - 0.5);
		return shuffled.slice(0, numDrawings);
	}, [numDrawings, selectedCategoryIds]);

	useEffect(() => {
		if (sessionState !== "active") {
			if (intervalRef.current) clearInterval(intervalRef.current);
			return;
		}

		if (timerDrawingRef.current !== drawingIndex) {
			timerDrawingRef.current = drawingIndex;
			setTimeLeft(timePerDrawing);
		}

		intervalRef.current = setInterval(() => {
			setTimeLeft(prev => {
				if (prev <= 1) {
					clearInterval(intervalRef.current!);
					setDrawingIndex(idx => {
						const nextIdx = idx + 1;
						if (nextIdx >= sessionDrawings.length) {
							setSessionState("done");
							return 0;
						}
						return nextIdx;
					});
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
	}, [sessionState, drawingIndex, sessionDrawings.length, timePerDrawing]);

	const handleStart = () => {
		const drawings = buildSession();
		setSessionDrawings(drawings);
		setDrawingIndex(0);
		setTimeLeft(timePerDrawing);
		setSessionState("active");

		// On mobile, scroll the right panel into view so the user
		// doesn't have to manually scroll down after hitting Start
		setTimeout(() => {
			rightPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
		}, 50);
	};

	const handlePause = () => setSessionState("paused");
	const handleResume = () => setSessionState("active");

	const handleSkip = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		setDrawingIndex(idx => {
			const nextIdx = idx + 1;
			if (nextIdx >= sessionDrawings.length) {
				setSessionState("done");
				return 0;
			}
			setTimeLeft(timePerDrawing);
			setSessionState("active");
			return nextIdx;
		});
	};

	const handleStop = () => {
		if (intervalRef.current) clearInterval(intervalRef.current);
		setSessionState("idle");
		setDrawingIndex(0);
	};

	const handleRestart = () => {
		handleStart();
	};

	const isActive = sessionState === "active" || sessionState === "paused";
	const isDone = sessionState === "done";

	return (
		<div className="flex flex-col flex-1 bg-background text-primary">
			<section className="w-full p-6 bg-background">
				{/*
					On mobile  : single column, left panel first then right panel stacks below.
					On desktop : side-by-side, right panel takes up 2/3 and matches the left panel height.
					The key fix is that the grid rows use `items-stretch` so both cells are the same
					height, and the right panel itself fills that height with `h-full`.
				*/}
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
					{/* LEFT PANEL */}
					<div className="flex flex-col rounded-xl bg-card shadow p-6">
						<h1 className="text-text pb-4">Choose Category:</h1>

						<div className="grid grid-cols-2 gap-4">
							{mockCategories.map(category => (
								<PracticeCard
									key={category.id}
									{...category}
									selected={selectedCategoryIds.includes(category.id)}
									onToggle={() => toggleCategory(category.id)}
									disabled={isActive}
								/>
							))}
						</div>

						<div className="text-text flex flex-col py-6 gap-2">
							<div>
								<h1>Number of Drawings: {numDrawings}</h1>
								<input
									type="range"
									min={1}
									max={20}
									value={numDrawings}
									onChange={(e) => setNumDrawings(Number(e.target.value))}
									className="w-full accent-primary"
									disabled={isActive}
								/>
								<div className="flex justify-between">
									<small>1</small>
									<small>20</small>
								</div>
							</div>

							<div>
								<h1>Time per Drawing: {formatTime(timePerDrawing)}</h1>
								<input
									type="range"
									min={10}
									max={300}
									step={10}
									value={timePerDrawing}
									onChange={(e) => setTimePerDrawing(Number(e.target.value))}
									className="w-full accent-primary"
									disabled={isActive}
								/>
								<div className="flex justify-between">
									<small>10s</small>
									<small>5m</small>
								</div>
							</div>
						</div>

						<Button
							size={"xl"}
							variant={"primary"}
							onClick={handleStart}
							disabled={isActive}
						>
							{isActive ? "Session in Progress..." : "Start Session"}
						</Button>
					</div>

					{/* RIGHT PANEL — ref is used for mobile scroll-into-view */}
					<div ref={rightPanelRef} className="flex flex-col h-full">
						{isDone ? (
							<DonePanel
								totalDrawings={numDrawings}
								timePerDrawing={timePerDrawing}
								onRestart={handleRestart}
							/>
						) : isActive ? (
							<ActiveSessionPanel
								drawing={sessionDrawings[drawingIndex]}
								drawingIndex={drawingIndex}
								totalDrawings={sessionDrawings.length}
								timeLeft={timeLeft}
								timePerDrawing={timePerDrawing}
								sessionState={sessionState}
								onPause={handlePause}
								onResume={handleResume}
								onSkip={handleSkip}
								onStop={handleStop}
							/>
						) : (
							<div className="
								flex flex-col items-center justify-center rounded-xl text-text
								bg-card shadow p-6 aspect-square lg:aspect-auto lg:min-h-full
							">
								<Brush className="w-15 h-15" />
								<h1>Ready to Practice</h1>
								<small className="text-text-opaque">
									{numDrawings} drawings x {formatTime(timePerDrawing)}
								</small>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
};


const ActiveSessionPanel = ({
	drawing,
	drawingIndex,
	totalDrawings,
	timeLeft,
	timePerDrawing,
	sessionState,
	onPause,
	onResume,
	onSkip,
	onStop,
}: ActiveSessionPanelProps) => (
	/*
		Layout contract:
		- The outer div is a flex column that fills the height its parent gives it (h-full).
		- The image wrapper uses `flex-1 min-h-0` — this is the critical pair:
		    • flex-1  : take all remaining vertical space after the fixed top/bottom rows
		    • min-h-0 : override the default min-height:auto so flex can actually shrink it
		- Inside the image wrapper we use absolute positioning so the <img> never
		  influences the container's size — it just fills whatever space is available.
		- Controls are a fixed-height row at the bottom, so they never move.
		
		On mobile the panel has no enforced height from the grid, so it sizes naturally
		to the viewport using `min-h-[70vh]` — tall enough to show image + controls
		without the user needing to scroll.
	*/
	<div className="flex flex-col rounded-xl bg-card shadow p-6 gap-4 h-full min-h-[70vh]">
		{/* Top bar — fixed height */}
		<div className="flex items-center justify-between flex-shrink-0">
			<span className="text-text-opaque text-sm">
				Drawing <span className="text-text font-semibold">{drawingIndex + 1}</span> / {totalDrawings}
			</span>
			<button
				onClick={onStop}
				className="flex items-center gap-1.5 px-3 py-1.5 border border-2 hover:border-red-400 hover:text-red-400 text-text-opaque text-sm rounded-lg transition-colors"
			>
				End Session
			</button>
		</div>

		{/* Progress pills — fixed height */}
		<div className="flex gap-1 flex-shrink-0">
			{Array.from({ length: totalDrawings }).map((_, i) => (
				<div
					key={i}
					className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
						i < drawingIndex  ? "bg-primary opacity-60" :
						i === drawingIndex ? "bg-primary" :
						"bg-card-border opacity-20"
					}`}
				/>
			))}
		</div>

		{/*
			Image wrapper — grows to fill remaining space, never influences its own height.
			`relative` + `overflow-hidden` clip the absolutely-positioned img.
		*/}
		<div className="relative flex-1 min-h-0 rounded-lg bg-black overflow-hidden">
			<img
				key={drawing.id}
				src={drawing.src}
				alt={drawing.label}
				/*
					`absolute inset-0` makes the image fill the container exactly.
					`object-contain` keeps the aspect ratio; the image never overflows.
					This completely decouples the image dimensions from the layout.
				*/
				className="absolute inset-0 w-full h-full object-contain"
			/>

			{sessionState === "paused" && (
				<div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
					<span className="text-white text-xl font-semibold tracking-wide">Paused</span>
				</div>
			)}

			<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
				<p className="text-white text-sm font-medium">{drawing.label}</p>
			</div>
		</div>

		{/* Controls — fixed height, always pinned at bottom */}
		<div className="flex items-center justify-between gap-4 flex-shrink-0">
			<TimerBar timeLeft={timeLeft} total={timePerDrawing} />

			<div className="flex gap-3">
				{sessionState === "paused" ? (
					<Button variant={"primary"} onClick={onResume}>
						<Play className="w-4 h-4" /> Resume
					</Button>
				) : (
					<Button variant={"primary"} onClick={onPause}>
						<Pause className="w-4 h-4" /> Pause
					</Button>
				)}
				<Button variant={"primary"} onClick={onSkip}>
					<SkipForward className="w-4 h-4" /> Skip
				</Button>
			</div>
		</div>
	</div>
);

const DonePanel = ({
	totalDrawings,
	timePerDrawing,
	onRestart,
}: {
	totalDrawings: number;
	timePerDrawing: number;
	onRestart: () => void;
}) => (
	<div className="flex flex-col items-center justify-center h-full rounded-xl bg-card shadow p-6 gap-6 text-text">
		<div className="text-5xl">🎉</div>
		<h2 className="text-2xl font-bold">Session Complete!</h2>
		<p className="text-text-opaque text-center text-sm">
			You completed <span className="text-text font-semibold">{totalDrawings}</span> drawings
			at <span className="text-text font-semibold">{formatTime(timePerDrawing)}</span> each.
			Great work!
		</p>
		<Button variant={"primary"} onClick={onRestart}>
			<RotateCcw className="w-4 h-4" /> Start Another Session
		</Button>
	</div>
);

export default Practice;