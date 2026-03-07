type Badge = {
	id: string;
	name: string;
	description: string;
	icon: string;
	earned: boolean;
	earnedDate?: string;
}

export const badges: Badge[] = [
	{
		id: "1",
		name: "First Steps",
		description: "Complete your first drawing session",
		icon: "🎨",
		earned: true,
		earnedDate: "2026-01-15",
	},
	{
		id: "2",
		name: "Dedicated Artist",
		description: "Maintain a 7-day streak",
		icon: "🔥",
		earned: true,
		earnedDate: "2026-01-22",
	},
	{
		id: "3",
		name: "Speed Sketcher",
		description: "Complete 50 quick sketches (under 2 minutes)",
		icon: "⚡",
		earned: true,
		earnedDate: "2026-02-01",
	},
	{
		id: "4",
		name: "Master of Hands",
		description: "Complete 100 hand studies",
		icon: "✋",
		earned: false,
	},
	{
		id: "5",
		name: "Century Club",
		description: "Complete 100 drawing sessions",
		icon: "💯",
		earned: true,
		earnedDate: "2026-02-05",
	},
	{
		id: "6",
		name: "Marathon Artist",
		description: "Draw for 3 hours in a single day",
		icon: "🏃",
		earned: false,
	},
];