import { useState } from "react";
import { UsersTable, PostsTable, StatCard } from "../components/AdminPageComponents";

// ─── ROOT ─────────────────────────────────────────────
export default function AdminDashboard() {
	const [userCount, setUserCount] = useState<number>(0);
	const [postCount, setPostCount] = useState<number>(0);

	return (
		<div className="min-h-screen bg-background text-text">
			<div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">

				{/* Page header */}
				<div className="flex items-end justify-between">
					<div>
						<p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Control Panel</p>
						<h1 className="text-2xl font-bold text-text">Admin Dashboard</h1>
					</div>
					<div className="flex gap-3">
						<StatCard label="Total Users" value={userCount} accent="text-primary" />
						<StatCard label="Total Posts" value={postCount} accent="text-accent" />
					</div>
				</div>

				{/* Divider */}
				<div className="h-px bg-border" />

				<UsersTable totalUsers={setUserCount} />
				<PostsTable totalPosts={setPostCount} />
			</div>
		</div>
	);
}