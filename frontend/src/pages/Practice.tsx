import Category from "../components/ui/Category"
import { Brush } from "lucide-react"
import { useState } from "react";
import MockCategories from "../_mock/mockCategories";

const Practice = () => {
	const [numDrawings, setNumDrawings] = useState(5);
	const [timePerDrawing, setTimePerDrawing] = useState(60);

	return (
		<>
			<section className="mx-screen w-full p-6 bg-background">
				<h1 className="text-text text-2xl pt-4 pb-8">
					Practice Session
				</h1>
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
					{/* LEFT PANEL */}
					<div className="flex flex-col rounded-xl bg-card shadow p-6">
						<h1 className="text-text text-lg">Session Settings</h1>

						<h1 className="text-text-opaque text-md pt-10 pb-4">
							Choose Category
						</h1>

						<div className="grid grid-cols-2 gap-4">
							{MockCategories.map(category => <Category key={category.id} {...category}></Category>)}
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
								/>
								<div className="flex justify-between">
									<small>10s</small>
									<small>5m</small>
								</div>
							</div>
						</div>

						<button className="border-2 border-background hover:border-primary text-center text-text bg-button rounded-xl p-4">
							Start Session
						</button>
					</div>

					{/* RIGHT PANEL */}
					<div className="
					flex flex-col items-center justify-center rounded-xl text-text
					bg-card shadow p-6 aspect-square lg:aspect-auto lg:min-h-full
					">
						<Brush className="w-15 h-15"></Brush>
						<h1>Ready to Practice</h1>
						<small>
							{numDrawings} drawings x {formatTime(timePerDrawing)}
						</small>
					</div>
				</div>
			</section>
		</>
	)
}

function formatTime(seconds: number) {
	if (seconds < 60) return `${seconds}s`;
	const min = `${Math.floor(seconds / 60)}m`;
	const sec = `${seconds % 60}s`;
	if (sec != "0s") {
		return min + " " + sec
	}
	return min
}

export default Practice