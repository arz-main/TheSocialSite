import { useState, useEffect, useRef, useCallback } from "react";
import { Brush, RotateCcw, Pause, Play, SkipForward } from "lucide-react"
import mockCategories from "../_mock/mockCategories";
import { mockDrawings } from "../_mock/mockDrawings";
import { TimerRing } from "../components/ui/Timer";
import { PracticeCard } from "../components/ui/Card"
import { formatTime } from "../utils/practiceUtils";

type SessionState = "idle" | "active" | "paused" | "done";

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


	// Helper: toggle a category on/off
	const toggleCategory = (id: number) => {
		setSelectedCategoryIds(prev =>
			prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
		);
	};


	const buildSession = useCallback(() => {
		// If nothing selected, use all drawings; otherwise filter by chosen categories
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
		<>
			<section className="mx-screen w-full p-6 bg-background">
				<h1 className="text-text text-3xl font-bold mb-8">
					Practice Session
				</h1>
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
					{/* LEFT PANEL */}
					<div className="flex flex-col rounded-xl bg-card shadow p-6">
						<h1 className="text-text-opaque text-md pb-4">
							Choose Category
						</h1>

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

						<div className="text-text flex flex-col py-14 gap-10">
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

						<button
							className="border-2 border-background hover:border-primary text-center text-text bg-button rounded-xl p-4"
							onClick={handleStart}
							disabled={isActive}
						>
							{isActive ? "Session in Progress..." : "Start Session"}
						</button>
					</div>

					{/* RIGHT PANEL */}
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
							<Brush className="w-15 h-15"></Brush>
							<h1>Ready to Practice</h1>
							<small className="text-text-opaque">
								{numDrawings} drawings x {formatTime(timePerDrawing)}
							</small>
						</div>
					)}
				</div>
			</section>
		</>
	)
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
}: {
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
}) => (
	<div className="flex flex-col h-full rounded-xl bg-card shadow p-6 gap-4 max-h-screen overflow-hidden">
		{/* Top bar */}
		<div className="flex items-center justify-between">
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

		{/* Progress pills */}
		<div className="flex gap-1">
			{Array.from({ length: totalDrawings }).map((_, i) => (
				<div
					key={i}
					className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i < drawingIndex ? "bg-primary opacity-60" :
						i === drawingIndex ? "bg-primary" :
							"bg-card-border opacity-20"
						}`}
				/>
			))}
		</div>

		{/* Reference image */}
		<div className="relative flex-1 rounded-lg overflow-hidden bg-black min-h-0 max-h-[100vh]">
			<img
				key={drawing.id}
				src={drawing.src}
				alt={drawing.label}
				className="w-full h-full object-cover opacity-90 animate-fadeIn"
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

		{/* Controls */}
		<div className="flex items-center justify-between gap-4">
			<TimerRing timeLeft={timeLeft} total={timePerDrawing} />

			<div className="flex gap-3">
				{sessionState === "paused" ? (
					<button
						onClick={onResume}
						className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
					>
						<Play className="w-4 h-4" /> Resume
					</button>
				) : (
					<button
						onClick={onPause}
						className="flex items-center gap-2 px-5 py-2.5 border-2 border-primary text-primary rounded-xl font-medium hover:bg-primary/10 transition-colors"
					>
						<Pause className="w-4 h-4" /> Pause
					</button>
				)}
				<button
					onClick={onSkip}
					className="flex items-center gap-2 px-5 py-2.5 border-2 border-background text-text-opaque rounded-xl font-medium hover:border-primary hover:text-primary transition-colors"
				>
					<SkipForward className="w-4 h-4" /> Skip
				</button>
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
		<button
			onClick={onRestart}
			className="flex items-center gap-2 px-6 py-3 bg-button border-2 border-background hover:border-primary text-text rounded-xl font-medium transition-colors"
		>
			<RotateCcw className="w-4 h-4" /> Start Another Session
		</button>
	</div>
);

export default Practice