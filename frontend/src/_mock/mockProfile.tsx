type Badge = {
	id: string;
	name: string;
	description: string;
	icon: string;
	earned: boolean;
	earnedDate?: string;
}

type Drawing = {
	id: string;
	userId: string;
	username: string;
	imageUrl: string;
	referenceUrl?: string;
	category: string;
	duration: number;
	createdAt: string;
	likes: number;
	showWithReference: boolean;
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

export const currentUserDrawings: Drawing[] = [
	{
		id: "1",
		userId: "current",
		username: "You",
		imageUrl: "figure-sketch-practice",
		referenceUrl: "figure-reference-pose",
		category: "Figure Drawing",
		duration: 300,
		createdAt: "2026-02-09T10:30:00",
		likes: 24,
		showWithReference: true,
	},
	{
		id: "2",
		userId: "current",
		username: "You",
		imageUrl: "hand-study-sketch",
		category: "Hands",
		duration: 120,
		createdAt: "2026-02-09T09:15:00",
		likes: 18,
		showWithReference: false,
	},
	{
		id: "3",
		userId: "current",
		username: "You",
		imageUrl: "still-life-drawing",
		referenceUrl: "still-life-objects",
		category: "Still Life",
		duration: 600,
		createdAt: "2026-02-08T14:20:00",
		likes: 31,
		showWithReference: true,
	},
];