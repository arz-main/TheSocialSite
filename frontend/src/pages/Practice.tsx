import Category from "../components/ui/Category"
import Logo from "../assets/react.svg"
import { useState } from "react";

const Practice = () => {
	const [numDrawings, setNumDrawings] = useState(5);
	const [timePerDrawing, setTimePerDrawing] = useState(60);

	return (
		<>
			<section className="mx-screen w-full p-6 bg-gradient-to-br from-[#fdf5e2] to-[#f7ecd9]">
				<h1 className="text-2xl pt-4 pb-8">
					Practice Session
				</h1>
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]  gap-6">
					{/* LEFT PANEL */}
					<div className="flex flex-col rounded-xl bg-white shadow p-6">
						<h1 className="text-black text-lg">Session Settings</h1>

						<h1 className="text-gray-600 text-md pt-10 pb-4">
							Choose Category
						</h1>

						<div className="grid grid-cols-2 gap-4">
							<Category img={Logo} title="Figure Drawing" />
							<Category img={Logo} title="Figure Drawing" />
							<Category img={Logo} title="Figure Drawing" />
							<Category img={Logo} title="Figure Drawing" />
							<Category img={Logo} title="Figure Drawing" />
							<Category img={Logo} title="Figure Drawing" />
						</div>

						<div className="flex flex-col py-14 gap-10">
							<div>
								<h1>Number of Drawings: {numDrawings}</h1>
								<input
									type="range"
									min={1}
									max={20}
									value={numDrawings}
									onChange={(e) => setNumDrawings(Number(e.target.value))}
									className="w-full accent-[#C24A48]"
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
									className="w-full accent-[#C24A48]"
								/>
								<div className="flex justify-between">
									<small>10s</small>
									<small>5m</small>
								</div>
							</div>
						</div>

						<button className="border hover:border-black text-center text-white bg-[#C24A48] rounded-xl p-4">
							Start Session
						</button>
					</div>

					{/* RIGHT PANEL */}
					<div className="
					flex flex-col items-center justify-center rounded-xl 
					bg-white shadow p-6 aspect-square lg:aspect-auto lg:min-h-full
					">
						<img className="w-15 h-15" src={Logo} alt="" />
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