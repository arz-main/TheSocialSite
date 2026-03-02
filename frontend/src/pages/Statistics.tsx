import { Card, CardContent } from "../components/ui/Card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart,
	Pie,
} from "recharts";
import { motion } from "framer-motion";
import { categoryData, drawingsPerMonth, speedData, practiceInfoData } from "../_mock/mockStatistics"

export default function StatsPage() {
	return (
		<div className="flex flex-col flex-1 bg-background text-primary p-6 gap-6">
			{/* Stat Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{practiceInfoData.map((stat, index) => (
					<motion.div
						key={stat.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
					>
						<Card className="text-text rounded-2xl shadow-sm">
							<CardContent className="p-6 flex items-center justify-between">
								<div>
									<p className="text-sm">{stat.title}</p>
									<p className="text-2xl font-semibold mt-1">{stat.value}</p>
								</div>
								<div className="p-2 w-10 h-10 text-white bg-primary rounded-xl">{stat.icon}</div>
							</CardContent>
						</Card>
					</motion.div>
				))}
			</div>

			{/* Charts */}
			<div className="text-text grid grid-cols-1 lg:grid-cols-2 gap-6">
				<Card className="rounded-2xl shadow-sm">
					<CardContent className="p-6">
						<h2 className="text-lg font-semibold mb-4">Drawings per Month</h2>
						<div className="h-80 w-full" style={{ color: "var(--opposite)" }}>
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={drawingsPerMonth}>
									<CartesianGrid stroke="var(--muted)" strokeDasharray="3 3" />
									<XAxis
										dataKey="name"
										tick={{ fill: "currentColor", fontSize: 12 }}
										axisLine={{ stroke: "var(--primary)" }}
										tickLine={{ stroke: "var(--muted)" }}
									/>
									<YAxis
										tick={{ fill: "currentColor", fontSize: 12 }}
										axisLine={{ stroke: "var(--primary)" }}
										tickLine={{ stroke: "var(--background)" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--background)",
											border: "none",
											borderRadius: 8,
											color: "var(--text)",
										}}
										labelStyle={{ color: "var(--muted)" }}
									/>
									<Bar
										dataKey="drawings"
										fill="var(--primary)"
										radius={[8, 8, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				<Card className="rounded-2xl shadow-sm">
					<CardContent className="p-6">
						<h2 className="text-lg font-semibold mb-4">Average Drawing Time (min)</h2>
						<div className="h-80">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={speedData}>
									<CartesianGrid stroke="var(--muted)" strokeDasharray="3 3" />
									<XAxis
										dataKey="name"
										tick={{ fill: "currentColor", fontSize: 12 }}
										axisLine={{ stroke: "var(--primary)" }}
										tickLine={{ stroke: "var(--muted)" }}
									/>
									<YAxis
										tick={{ fill: "currentColor", fontSize: 12 }}
										axisLine={{ stroke: "var(--primary)" }}
										tickLine={{ stroke: "var(--background)" }}
									/>
									<Tooltip
										contentStyle={{
											backgroundColor: "var(--background)",
											border: "none",
											borderRadius: 8,
											color: "var(--text)",
										}}
										labelStyle={{ color: "var(--muted)" }}
									/>
									<Line
										dataKey="minutes"
										fill="var(--primary)"
										dot
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Category Breakdown */}
			<Card className="text-text rounded-2xl shadow-sm">
				<CardContent className="p-6">
					<h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
					<div className="h-80 flex justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={categoryData}
									dataKey="value"
									nameKey="name"
									outerRadius={120}
									label
								/>
								<Tooltip />
							</PieChart>
						</ResponsiveContainer>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
