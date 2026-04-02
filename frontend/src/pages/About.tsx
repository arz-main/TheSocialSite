import { useEffect, useRef, useState } from "react";

function DotGrid({ className = "" }: { className?: string }) {
	return (
		<svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
			<defs>
				<pattern id="dots-about" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
					<circle cx="1.5" cy="1.5" r="1.5" fill="currentColor" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#dots-about)" />
		</svg>
	);
}

function CornerBrackets() {
	return (
		<svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
			<polyline points="0,12 0,0 12,0" fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="text-primary opacity-40" />
			<polyline points="88,0 100,0 100,12" fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="text-primary opacity-40" />
			<polyline points="0,88 0,100 12,100" fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="text-primary opacity-40" />
			<polyline points="88,100 100,100 100,88" fill="none" stroke="currentColor" strokeWidth="0.8" vectorEffect="non-scaling-stroke" className="text-primary opacity-40" />
		</svg>
	);
}

interface PanelCardProps {
	number: string;
	label: string;
	title: string;
	children: React.ReactNode;
	panelRef?: React.Ref<HTMLDivElement>;
}

const PanelCard = ({ number, label, title, children, panelRef }: PanelCardProps) => (
	<div
		ref={panelRef}
		className="relative bg-background rounded-sm overflow-hidden"
		style={{
			border: "1px solid color-mix(in srgb, var(--color-primary) 30%, transparent)",
			borderLeft: "4px solid var(--color-primary)",
			boxShadow: "4px 4px 0 0 color-mix(in srgb, var(--color-primary) 18%, transparent)",
			transition: "transform 0.25s ease, box-shadow 0.25s ease",
		}}
		onMouseEnter={e => {
			(e.currentTarget as HTMLElement).style.transform = "translateY(-4px) rotate(-0.3deg)";
			(e.currentTarget as HTMLElement).style.boxShadow = "6px 10px 0 0 color-mix(in srgb, var(--color-primary) 28%, transparent)";
		}}
		onMouseLeave={e => {
			(e.currentTarget as HTMLElement).style.transform = "";
			(e.currentTarget as HTMLElement).style.boxShadow = "4px 4px 0 0 color-mix(in srgb, var(--color-primary) 18%, transparent)";
		}}
	>
		<CornerBrackets />
		<div className="flex items-center gap-3 px-8 pt-6 pb-0">
			<span className="text-xs font-black tracking-[0.25em] text-primary uppercase opacity-70">{number}</span>
			<div className="flex-1 h-px bg-primary opacity-20" />
			<span className="text-xs font-bold tracking-widest text-primary uppercase opacity-50">{label}</span>
		</div>
		<div className="px-8 pt-4 pb-8">
			<h2 className="text-text text-3xl font-black tracking-tight mb-4 leading-tight">{title}</h2>
			<div className="text-text-opaque text-lg leading-relaxed flex flex-col gap-3">
				{children}
			</div>
		</div>
	</div>
);

const PANELS = [
	{
		number: "01", label: "Origin", title: "Why SketchFlow?",
		content: [
			"This project was born out of a desire to improve the experience artists have when growing and perfecting their drawing skills. By creating a space dedicated exclusively to the artistic community, the platform aims to offer a structured and motivating environment for the continuous development of visual and creative abilities.",
		],
	},
	{
		number: "02", label: "Problem Space", title: "The Gap We Address",
		content: [
			"There is a clear lack of platforms dedicated to artistic development through fast, systematic training. Although many general social networks exist, the artist community has no specialized tool that combines professional socializing with structured training exercises and individual progress tracking.",
			"Existing platforms either focus exclusively on showcasing finished work, or offer rigid courses — without emphasizing interaction between users and the organic development of skills through daily practice.",
		],
	},
	{
		number: "03", label: "Features", title: "What the Platform Offers",
		content: [
			"SketchFlow gives artists, illustrators, painters, and other creators the ability to interact with people from the same field by sharing their own creations, sending text messages, and appreciating content posted by other users.",
			"The platform provides an efficient way for each user to self-evaluate their progress by viewing statistical diagrams, earning digital badges upon reaching certain goals, and comparing results with other artists in the community.",
			"Through quick drawing exercises, drawing challenges, and feedback from the community, users are encouraged to practice consistently and improve their technique in an interactive way.",
		],
	},
];

const About = () => {
	const containerRef = useRef<HTMLDivElement>(null);
	const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
	const [dotPositions, setDotPositions] = useState<number[]>([]);

	// Reveal on scroll
	const revealRef = (el: HTMLElement | null) => {
		if (!el) return;
		const obs = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					(entry.target as HTMLElement).style.opacity = "1";
					(entry.target as HTMLElement).style.transform = "translateY(0)";
					obs.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		obs.observe(el);
	};

	// Measure panel midpoints relative to the timeline container
	useEffect(() => {
		const measure = () => {
			if (!containerRef.current) return;
			const containerTop = containerRef.current.getBoundingClientRect().top;
			const positions = panelRefs.current.map(el => {
				if (!el) return 0;
				const rect = el.getBoundingClientRect();
				return rect.top - containerTop + rect.height / 2;
			});
			setDotPositions(positions);
		};

		measure();
		window.addEventListener("resize", measure);
		// Re-measure after reveal animations settle
		const t = setTimeout(measure, 800);
		return () => { window.removeEventListener("resize", measure); clearTimeout(t); };
	}, []);

	const lineTop = dotPositions[0] ?? 0;
	const lineBottom = dotPositions[dotPositions.length - 1] ?? 0;

	return (
		<>
			<style>{`
				@keyframes ab-fadeUp { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
				.ab-w1 { animation: ab-fadeUp 0.7s 0.1s  ease both; }
				.ab-w2 { animation: ab-fadeUp 0.7s 0.25s ease both; }
				.ab-reveal {
					opacity: 0;
					transform: translateY(24px);
					transition: opacity 0.65s ease, transform 0.65s ease;
				}
			`}</style>

			<div className="relative flex flex-col flex-1 bg-background text-primary overflow-x-hidden">

				{/* ── HERO ────────────────────────────────────────────────── */}
				<section className="relative w-full flex flex-col items-center gap-3 p-6 pb-16 bg-background overflow-hidden min-h-65 justify-center">
					<DotGrid className="text-primary opacity-[0.06]" />
					<div className="relative z-10 text-center flex flex-col items-center">
						<h1 className="ab-w1 text-text text-5xl md:text-6xl font-black tracking-tight leading-tight mb-1">About</h1>
						<div className="ab-w2 relative inline-block">
							<h1 className="text-primary text-5xl md:text-6xl font-black tracking-tight leading-tight mb-4">SketchFlow</h1>
							<svg viewBox="0 0 320 12" className="absolute -bottom-1 left-0 w-full" fill="none">
								<path d="M4 8 Q50 2 100 8 Q150 14 200 8 Q250 2 290 8 Q308 11 316 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary" />
							</svg>
						</div>
					</div>
				</section>

				{/* ── DIVIDER ─────────────────────────────────────────────── */}
				<div className="relative flex items-center gap-3 w-full px-6">
					<div className="flex-1 h-px bg-primary opacity-20" />
					{[...Array(5)].map((_, i) => <div key={i} className="w-1 h-3 bg-primary opacity-30 rounded-full" />)}
					<div className="flex-1 h-px bg-primary opacity-20" />
				</div>

				{/* ── PANELS ──────────────────────────────────────────────── */}
				<section className="relative w-full flex flex-col items-center p-6 pb-20 bg-background overflow-hidden">
					<DotGrid className="text-primary opacity-[0.04]" />

					<div className="relative z-10 w-full max-w-3xl mt-10">
						<div className="flex gap-6">

							{/* Timeline column — measured absolutely */}
							<div ref={containerRef} className="relative shrink-0" style={{ width: 24 }}>
								{dotPositions.length > 1 && (
									<>
										{/* Line from first dot to last dot */}
										<div
											className="absolute bg-primary opacity-25 rounded-full"
											style={{
												width: 2,
												left: "50%",
												transform: "translateX(-50%)",
												top: lineTop,
												height: lineBottom - lineTop,
											}}
										/>
										{/* Dots at each panel midpoint */}
										{dotPositions.map((y, i) => (
											<div
												key={i}
												className="absolute flex items-center justify-center"
												style={{
													width: 14,
													height: 14,
													left: "50%",
													top: y,
													transform: "translate(-50%, -50%)",
												}}
											>
												<div
													className="rounded-full border-2 border-primary bg-background flex items-center justify-center"
													style={{ width: 14, height: 14, opacity: 0.85 }}
												>
													<div className="rounded-full bg-primary" style={{ width: 5, height: 5 }} />
												</div>
											</div>
										))}
									</>
								)}
							</div>

							{/* Panels */}
							<div className="flex flex-col gap-6 flex-1">
								{PANELS.map((panel, i) => (
									<div
										key={i}
										ref={revealRef}
										className="ab-reveal"
										style={{ transitionDelay: `${i * 0.14}s` }}
									>
										<PanelCard
											number={panel.number}
											label={panel.label}
											title={panel.title}
											panelRef={el => { panelRefs.current[i] = el; }}
										>
											{panel.content.map((p, j) => <p key={j}>{p}</p>)}
										</PanelCard>
									</div>
								))}
							</div>

						</div>
					</div>
				</section>

			</div>
		</>
	);
};

export default About;