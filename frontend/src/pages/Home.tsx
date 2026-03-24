
import { HomeCard } from "../components/ui/HomePageComponents";
import paths from "../routes/paths";
import MockCards from "../_mock/mockHomeCards";
import { LinkButton } from "../components/ui/LinkButton";

import SketchCircle from "../assets/Sketches/CoolFace.svg?react";
import SketchNameArt from "../assets/Sketches/NameArt.svg?react";
import SwordDude from "../assets/Sketches/SwordDude.svg?react";


/* ─── Background texture helpers ──────────────────────────────────────────── */

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

/* ─── Floating sketch placement configuration ────────────────────────────────
   Positions are relative to the full page height.
   left/right values push the sketch into the side gutter.
   Adjust these freely once you see how they look on your actual layout.
────────────────────────────────────────────────────────────────────────────── */

const FLOAT_SLOTS = [
	{ top: "5%", left: "30%", right: "auto", size: 200, rotate: -14, opacity: 0.18, delay: "0s", duration: "8s", sketch: "coolface" },
	{ top: "10%", left: "auto", right: "15%", size: 170, rotate: 10, opacity: 0.16, delay: "1.5s", duration: "10s", sketch: "appname" },
] as const;

const SKETCH_OPTIONS = [SketchCircle, SketchNameArt, SwordDude];
const FloatingSketch = ({
	top, left, right, size, rotate, opacity, delay, duration, index // Added index prop
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
};/* ─── Hero brush strokes ─────────────────────────────────────────────────── */
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

/* ─── Marquee strip ─────────────────────────────────────────────────────────── */
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

/* ─── Main page ─────────────────────────────────────────────────────────────── */
const Home = () => {
	return (
		<>
			<style>{`
				@keyframes drawIn { to { stroke-dashoffset: 0; } }
				@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
				@keyframes floatY {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50%       { transform: translateY(-14px) rotate(3deg); }
				}
				@keyframes fadeUp {
					from { opacity: 0; transform: translateY(24px); }
					to   { opacity: 1; transform: translateY(0); }
				}
				@keyframes floatSketch {
					0% { transform: translateY(0px); }
				    100% { transform: translateY(-16px); }
}
				.hero-word { animation: fadeUp 0.7s ease both; }
				.hero-word:nth-child(1) { animation-delay: 0.1s; }
				.hero-word:nth-child(2) { animation-delay: 0.25s; }
				.hero-word:nth-child(3) { animation-delay: 0.4s; }
				.hero-sub  { animation: fadeUp 0.7s 0.55s ease both; }
				.hero-btns { animation: fadeUp 0.7s 0.7s ease both; }
				.card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; }
				.card-hover:hover {
					transform: translateY(-6px) rotate(-0.5deg);
					box-shadow: 6px 10px 0 0 var(--color-primary, #6c63ff);
				}
			`}</style>

			{/* Outer wrapper — position:relative so absolute sketches are scoped here */}
			<div className="relative flex flex-col flex-1 bg-background text-primary overflow-x-hidden">

				{/* Floating sketches rendered behind all content */}
				{FLOAT_SLOTS.map((slot, i) => <FloatingSketch key={i} {...slot} index={i} />)}

				{/* ── HERO ──────────────────────────────────────────────── */}
				<section className="relative w-full flex flex-col items-center gap-3 p-6 pb-20 bg-background overflow-hidden min-h-[520px] justify-center">
					<DotGrid className="text-primary opacity-[0.06]" />
					<HeroStrokes />
					<span aria-hidden="true" className="absolute -bottom-10 -left-6 text-[22vw] font-black text-primary opacity-[0.04] leading-none select-none pointer-events-none">SF</span>
					<InkAccent size={340} className="bg-primary opacity-[0.06] -top-20 -right-28 blur-3xl" />
					<InkAccent size={200} className="bg-primary opacity-[0.08] bottom-10 left-0 blur-2xl" />

					<div className="relative z-10 mb-2" style={{ animation: "floatY 4s ease-in-out infinite" }}>
						<div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg rotate-6">
							<svg viewBox="0 0 24 24" className="w-7 h-7 text-white fill-none stroke-white stroke-2 stroke-linecap-round stroke-linejoin-round">
								<path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
							</svg>
						</div>
					</div>

					<div className="relative z-10 text-center flex flex-col items-center">
						<h1 className="hero-word text-text text-5xl md:text-6xl font-black tracking-tight leading-tight mb-1">Master Your Art</h1>
						<h1 className="hero-word text-text text-5xl md:text-6xl font-black tracking-tight leading-tight mb-1">Through</h1>
						<div className="hero-word relative inline-block">
							<h1 className="text-primary text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">Daily Practice</h1>
							<svg viewBox="0 0 280 12" className="absolute -bottom-1 left-0 w-full" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M4 8 Q40 2 80 8 Q120 14 160 8 Q200 2 240 8 Q260 11 276 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
							</svg>
						</div>
					</div>

					<p className="hero-sub relative z-10 text-text-opaque text-center text-lg max-w-lg leading-relaxed mt-2">
						SketchFlow helps you develop your drawing skills with timed reference practice, progress tracking, and a supportive community of artists
					</p>

					<div className="hero-btns relative z-10 flex gap-4 pt-4 flex-wrap justify-center">
						<LinkButton to={paths.practice} variant="primary" size="lg">Start Practicing</LinkButton>
						<LinkButton to={paths.explore.page} variant="primary" size="lg">Explore Gallery</LinkButton>
					</div>
				</section>

				{/* ── MARQUEE ─────────────────────────────────────────────── */}
				<MarqueeStrip />

				{/* ── FEATURES ────────────────────────────────────────────── */}
				<section className="relative w-full flex flex-col items-center gap-3 pb-20 p-6 bg-background overflow-hidden">
					<Crosshatch className="text-primary opacity-[0.04]" />
					<InkAccent size={280} className="bg-primary opacity-[0.05] -top-16 right-0 blur-3xl" />
					<SwordDude
						className="absolute -bottom-10 -right-80 h-[720px] w-auto pointer-events-none text-primary opacity-[0.30]"
						aria-hidden="true"
						
					/>

					<div className="relative z-10 mt-10 flex items-center gap-2 border border-primary border-opacity-30 rounded-full px-4 py-1">
						<span className="w-2 h-2 rounded-full bg-primary" />
						<span className="text-xs font-bold tracking-widest text-primary uppercase">Features</span>
					</div>

					<div className="relative z-10 text-center flex flex-col items-center mt-3">
						<h2 className="text-text text-4xl font-black tracking-tight mb-2">
							Everything You Need<br /><span className="text-primary">to Improve</span>
						</h2>
						<p className="text-text-opaque">Comprehensive tools designed for artists at every level</p>
					</div>

					<div className="relative z-10 flex items-center gap-3 w-full max-w-6xl my-2">
						<div className="flex-1 h-px bg-primary opacity-20" />
						{[...Array(5)].map((_, i) => <div key={i} className="w-1 h-3 bg-primary opacity-30 rounded-full" />)}
						<div className="flex-1 h-px bg-primary opacity-20" />
					</div>

					<div className="relative z-10 grid gap-6 w-full max-w-6xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
						{MockCards.map(card => (
							<div key={card.id} className="card-hover">
								<HomeCard {...card} />
							</div>
						))}
					</div>
				</section>

				{/* ── CTA ─────────────────────────────────────────────────── */}
				<section className="relative bg-primary w-full flex flex-col items-center gap-3 pt-8 pb-16 overflow-hidden">
					<DiagonalLines className="text-white opacity-[0.06]" />
					<svg className="absolute top-5 left-5 text-white opacity-30 w-12 h-12" viewBox="0 0 48 48" fill="none">
						<path d="M4 20 L4 4 L20 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					<svg className="absolute bottom-5 right-5 text-white opacity-30 w-12 h-12" viewBox="0 0 48 48" fill="none">
						<path d="M44 28 L44 44 L28 44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
					</svg>
					{[[14, 50], [86, 40], [50, 75], [30, 20], [70, 85]].map(([x, y], i) => (
						<span key={i} className="absolute w-2 h-2 rounded-full bg-white opacity-20 pointer-events-none" style={{ left: `${x}%`, top: `${y}%` }} />
					))}

					<div className="relative z-10 text-white text-center flex flex-col items-center pt-10 px-4">
						<p className="text-sm font-bold tracking-[0.3em] uppercase opacity-70 mb-4">Join the community</p>
						<h2 className="text-4xl font-black tracking-tight mb-4 leading-tight">Ready to Level Up<br />Your Art?</h2>
						<p className="text-xl mb-6 opacity-80">Join thousands of artists improving their skills every day</p>
					</div>

					<LinkButton to={paths.practice} variant="primary" size="xl" className="relative z-10 border-2 border-white border-opacity-80 bg-transparent text-white hover:bg-white hover:text-primary transition-colors">
						Begin Your Journey →
					</LinkButton>
				</section>

			</div>
		</>
	);
};

export default Home;