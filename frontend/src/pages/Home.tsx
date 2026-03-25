import { HomeCard } from "../components/ui/HomePageComponents";
import paths from "../routes/paths";
import MockCards from "../_mock/mockHomeCards";
import { LinkButton } from "../components/ui/LinkButton";

import SketchCircle from "../assets/Sketches/CoolFace.svg?react";
import SketchNameArt from "../assets/Sketches/NameArt.svg?react";
import SwordDude from "../assets/Sketches/SwordDude.svg?react";


// Background texture helpers
function DotGrid({ className = "" }: { className?: string; }) {
	return (
		<svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
					<circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#dots)" />
		</svg>
	);
}

const DiagonalLines = ({ className = "" }: { className?: string }) => (
	<svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="diag" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)">
				<line x1="0" y1="0" x2="0" y2="40" stroke="currentColor" strokeWidth="1" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#diag)" />
	</svg>
);

const Crosshatch = ({ className = "" }: { className?: string }) => (
	<svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
		<defs>
			<pattern id="cross" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
				<path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.6" />
			</pattern>
		</defs>
		<rect width="100%" height="100%" fill="url(#cross)" />
	</svg>
);

const InkAccent = ({ size, className = "" }: { size: number; className?: string }) => (
	<span className={`absolute rounded-full pointer-events-none ${className}`} style={{ width: size, height: size }} />
);

// Floating sketch placement configuration

const FLOAT_SLOTS = [
	{ top: "5%", left: "30%", right: "auto", size: 200, rotate: -14, opacity: 0.18, delay: "0s", duration: "8s", sketch: "coolface" },
	{ top: "10%", left: "auto", right: "15%", size: 170, rotate: 10, opacity: 0.16, delay: "1.5s", duration: "10s", sketch: "appname" },
] as const;

const SKETCH_OPTIONS = [SketchCircle, SketchNameArt, SwordDude];
const FloatingSketch = ({
	top, left, right, size, rotate, opacity, delay, duration, index 
}: (typeof FLOAT_SLOTS)[number] & { index: number }) => {

	const sketch = SKETCH_OPTIONS[index % SKETCH_OPTIONS.length];
	const Sketch = sketch;
	return (
		<div
			className="absolute pointer-events-none z-10"
			style={{
				top,
				left,
				right,
				width: size,
				height: size,
				opacity,
				transform: `rotate(${rotate}deg)`,
				animation: `floatSketch ${duration} ease-in-out ${delay} infinite alternate`,
			}}
		>
			<Sketch className="w-full h-full text-primary" />
		</div>
	);
};
//Hero brush strokes
function HeroStrokes() {
	return (
		<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M -20 80 Q 120 20 260 110" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary opacity-20" style={{ animation: "drawIn 1.8s ease forwards", strokeDasharray: 400, strokeDashoffset: 400 }} />
			<path d="M 600 510 Q 750 360 950 540" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-primary opacity-15" style={{ animation: "drawIn 2.2s 0.4s ease forwards", strokeDasharray: 300, strokeDashoffset: 300 }} />
			{[
				{ x: 180, y: 180, r: -20 },
				{ x: 780, y: 108, r: 15 },
				{ x: 880, y: 330, r: -10 },
				{ x: 100, y: 420, r: 30 },
			].map(({ x, y, r }, i) => (
				<g key={i} transform={`translate(${x}, ${y}) rotate(${r})`} className="text-primary opacity-20">
					<line x1="-12" y1="0" x2="12" y2="0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
					<line x1="0" y1="-12" x2="0" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
				</g>
			))}
			<path d="M 940 20 L 980 20 L 980 60" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary opacity-30" />
			<path d="M 20 540 L 20 580 L 60 580" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary opacity-30" />
		</svg>
	);
}

// Marquee strip
const words = ["SKETCH", "DRAW", "PRACTICE", "CREATE", "IMPROVE", "EXPLORE", "MASTER", "FLOW"];
const MarqueeStrip = () => (
	<div className="w-full overflow-hidden bg-primary py-3 select-none">
		<div className="flex gap-10 whitespace-nowrap" style={{ animation: "marquee 18s linear infinite", width: "max-content" }}>
			{[...words, ...words].map((w, i) => (
				<span key={i} className="text-white font-black tracking-[0.3em] text-sm flex items-center gap-10">
					{w}
					<span className="inline-block w-2 h-2 rounded-full bg-white opacity-60 mx-[-1.5rem]" />
				</span>
			))}
		</div>
	</div>
);

// Main page
const Home = () => {
	return (
		<div className="flex flex-col flex-1 bg-background text-primary">
			<section className="mx-screen w-full flex flex-col items-center gap-3 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-5xl mb-4">Master Your Art Through</h1>
					<h1 className="text-primary text-5xl mb-4">Daily Practice</h1>
				</div>
				<h1 className="text-text-opaque text-center text-lg">
					SketchFlow helps you develop your drawing skills with timed reference practice, progress tracking, and a supportive community of artists
				</h1>
				<div className="flex gap-4 pt-4">
					<LinkButton to={paths.practice} variant="primary" size="lg">
						Start Practicing
					</LinkButton>
					<LinkButton to={paths.explore.page} variant="primary" size="lg">
						Explore Gallery
					</LinkButton>
				</div>
			</section>
			<section className="mx-screen w-full flex flex-col items-center gap-3 pb-20 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-4xl mb-4">Everything You Need to Improve</h1>
					<h1 className="text-text-opaque text-gray-600 mb-4">Comprehensive tools designed for artists at every level</h1>
				</div>
				<div className="grid gap-6 w-full max-w-6xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{/* Itereaza prin mock data si pune carduri pe pagina */}
					{MockCards.map(card => <HomeCard key={card.id} {...card} />)}
				</div>
			</section>
			<section className="mx-screen bg-primary w-full flex flex-col items-center gap-3 pt-8 pb-16">
				<div className="text-white text-center flex flex-col items-center pt-10">
					<h1 className="text-4xl mb-6">Ready to Level Up Your Art?</h1>
					<h1 className="text-xl mb-4">Join thousands of artists improving their skills every day</h1>
				</div>
				<LinkButton
					to={paths.practice}
					variant="primary"
					size="xl"
					className="border-2 border-background"
				>
					Begin Your Journey
				</LinkButton>
			</section>
		</div>
	);
};

export default Home;