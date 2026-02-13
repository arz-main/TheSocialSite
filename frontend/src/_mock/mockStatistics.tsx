import { Brush, Clock, Layers, TrendingUp } from "lucide-react"

// Drawings created per month
const drawingsPerMonth = [
	{ name: "Jan", drawings: 12 },
	{ name: "Feb", drawings: 18 },
	{ name: "Mar", drawings: 22 },
	{ name: "Apr", drawings: 16 },
	{ name: "May", drawings: 25 },
	{ name: "Jun", drawings: 28 },
	{ name: "Jul", drawings: 30 },
];

// Average minutes spent per drawing each month
const speedData = [
	{ name: "Jan", minutes: 6 },
	{ name: "Feb", minutes: 5.5 },
	{ name: "Mar", minutes: 5 },
	{ name: "Apr", minutes: 4.8 },
	{ name: "May", minutes: 4.5 },
	{ name: "Jun", minutes: 4.2 },
	{ name: "Jul", minutes: 4 },
];

// Category distribution
const categoryData = [
	{ name: "Portrait", value: 40, fill: "#8884d8" },
	{ name: "Landscape", value: 25, fill: "#82ca9d" },
	{ name: "Character Design", value: 20, fill: "#ffc658" },
	{ name: "Concept Art", value: 15, fill: "#ff7f7f" },
];

const totalDrawings = drawingsPerMonth.reduce(
	(acc, curr) => acc + curr.drawings,
	0
);

const avgSpeed = (
	speedData.reduce((acc, curr) => acc + curr.minutes, 0) /
	speedData.length
).toFixed(1);

const practiceInfoData = [
	{
		title: "Total Drawings",
		value: totalDrawings,
		icon: <Brush/>,
	},
	{
		title: "Avg Time per Drawing",
		value: `${avgSpeed} min`,
		icon: <Clock/>,
	},
	{
		title: "Most Used Category",
		value: "Portrait",
		icon: <Layers/>,
	},
	{
		title: "Productivity Growth",
		value: "+18%",
		icon: <TrendingUp/>,
	},
]

export {drawingsPerMonth, speedData, categoryData, practiceInfoData};