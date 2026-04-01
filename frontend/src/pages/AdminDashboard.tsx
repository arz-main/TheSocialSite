import { useState, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { usePosts } from "../hooks/usePosts";
import { DataTable, SearchBar, ConfirmModal, TableSkeleton, ErrorRow } from "../components/AdminPageComponents";
import { useFilteredData } from "../hooks/useFilteredData";
import type { Role } from "../types/RolesTypes";
import type { Post, PostStatus } from "../types/PostTypes";
import type { UpdateUserPayload, User } from "../types/UserTypes";
import { useAuth } from "../hooks/useAuth";

// ─── Helpers ─────────────────────────────────────────
const roleOrder: Role[] = ["User", "Admin"];

function promoteRole(role: Role): Role {
	const idx = roleOrder.indexOf(role);
	return idx < roleOrder.length - 1 ? roleOrder[idx + 1] : role;
}

const roleBadge: Record<Role, string> = {
	Admin: "bg-primary-soft text-primary border border-primary/40 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
	User: "bg-secondary-soft text-secondary border border-secondary/40 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
};

const statusBadge: Record<PostStatus, string> = {
	Published: "bg-success/10 text-success border border-success/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
	Draft: "bg-muted/10 text-muted border border-muted/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
	Flagged: "bg-danger/10 text-danger border border-danger/30 px-2.5 py-0.5 rounded-md text-[11px] font-semibold tracking-wide uppercase",
};

// ─── Stat Card ────────────────────────────────────────
function StatCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
	return (
		<div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-1 min-w-[130px]">
			<span className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</span>
			<span className={`text-2xl font-bold ${accent}`}>{value}</span>
		</div>
	);
}

// ─── Section Header ───────────────────────────────────
function SectionHeader({ title, count, search, onSearch, placeholder }: {
	title: string;
	count: number;
	search: string;
	onSearch: (v: string) => void;
	placeholder: string;
}) {
	return (
		<div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
			<div className="flex items-center gap-3">
				<h2 className="text-sm font-semibold text-text">{title}</h2>
				<span className="text-[11px] font-semibold bg-border text-muted px-2 py-0.5 rounded-full">
					{count}
				</span>
			</div>
			<SearchBar value={search} onChange={onSearch} placeholder={placeholder} />
		</div>
	);
}

// ─── USERS TABLE ──────────────────────────────────────
function UsersTable({ totalUsers }: { totalUsers: (n: number) => void }) {
	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [confirm, setConfirm] = useState<{ type: "delete" | "promote"; id: string } | null>(null);

	const { getAllUsers, deleteUser, updateUser } = useUsers();
	const { currentUser, refreshToken } = useAuth();

	useEffect(() => {
		const fetch = async () => {
			try {
				setLoading(true);
				const data = await getAllUsers();
				const list = data || [];
				setUsers(list);
				totalUsers(list.length);
			} catch {
				setError("Failed to load users");
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, [getAllUsers]);

	const filtered = useFilteredData(users, search, ["username", "email", "role"]);

	const executeConfirm = async () => {
		if (!confirm) return;
		try {
			if (confirm.type === "delete") {
				await deleteUser(confirm.id);
				setUsers(prev => prev.filter(u => u.id !== confirm.id));
			} else {
				const target = users.find(u => u.id === confirm.id);
				if (!target) return;
				const newRole = promoteRole(target.role);
				const payload: UpdateUserPayload = {
					username: target.username,
					email: target.email,
					bio: target.bio,
					location: target.location,
					website: target.website,
					avatar: target.avatar,
					role: newRole,
				};
				await updateUser(confirm.id, payload);
				setUsers(prev => prev.map(u => u.id === confirm.id ? { ...u, role: newRole } : u));
				if (currentUser?.id === target.id) await refreshToken();
			}
		} finally {
			setConfirm(null);
		}
	};

	const targetUser = confirm ? users.find(u => u.id === confirm.id) : null;

	return (
		<section className="bg-card border border-border rounded-xl overflow-hidden">
			{confirm && targetUser && (
				<ConfirmModal
					message={confirm.type === "delete" ? `Delete "${targetUser.username}"?` : `Promote "${targetUser.username}"?`}
					onConfirm={executeConfirm}
					onCancel={() => setConfirm(null)}
				/>
			)}

			<SectionHeader
				title="Users"
				count={filtered.length}
				search={search}
				onSearch={setSearch}
				placeholder="Search users…"
			/>

			<DataTable headers={["User", "Email", "Role", "Actions"]}>
				{loading ? (
					<TableSkeleton cols={4} />
				) : error ? (
					<ErrorRow cols={4} message={error} />
				) : filtered.map((user, i) => (
					<tr
						key={user.id}
						className="border-b border-border last:border-0 hover:bg-border/30 transition-colors group"
					>
						{/* User */}
						<td className="px-5 py-3.5">
							<div className="flex items-center gap-3">
								<div
									className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 bg-secondary-soft text-secondary"
								>
									{user.username[0].toUpperCase()}
								</div>
								<span className="text-sm font-medium text-text">{user.username}</span>
							</div>
						</td>

						{/* Email */}
						<td className="px-5 py-3.5 text-sm text-muted">{user.email}</td>

						{/* Role */}
						<td className="px-5 py-3.5">
							<span className={roleBadge[user.role]}>{user.role}</span>
						</td>

						{/* Actions */}
						<td className="px-5 py-3.5">
							<div className="flex items-center gap-2">
								<button
									onClick={() => setConfirm({ type: "promote", id: user.id })}
									disabled={user.role === "Admin"}
									className="px-2.5 py-1 text-xs rounded-lg bg-secondary-soft text-secondary border border-secondary/30 hover:bg-secondary/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
								>
									↑ Promote
								</button>
								<button
									onClick={() => setConfirm({ type: "delete", id: user.id })}
									className="px-2.5 py-1 text-xs rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
								>
									Delete
								</button>
							</div>
						</td>
					</tr>
				))}
			</DataTable>
		</section>
	);
}

// ─── POSTS TABLE ──────────────────────────────────────
function PostsTable({ totalPosts }: { totalPosts: (n: number) => void }) {
	const [posts, setPosts] = useState<Post[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [search, setSearch] = useState("");
	const [confirm, setConfirm] = useState<string | null>(null);

	const { getAllPosts, deletePost } = usePosts();

	useEffect(() => {
		const fetch = async () => {
			try {
				setLoading(true);
				const data = await getAllPosts();
				const list = data || [];
				setPosts(list);
				totalPosts(list.length);
			} catch {
				setError("Failed to load posts");
			} finally {
				setLoading(false);
			}
		};
		fetch();
	}, [getAllPosts]);

	const filtered = useFilteredData(posts, search, ["title", "author", "status", "category"]);

	const handleDelete = async () => {
		if (!confirm) return;
		await deletePost(confirm);
		setPosts(prev => prev.filter(p => p.id !== confirm));
		setConfirm(null);
	};

	const targetPost = confirm ? posts.find(p => p.id === confirm) : null;

	return (
		<section className="bg-card border border-border rounded-xl overflow-hidden">
			{confirm && targetPost && (
				<ConfirmModal
					message={`Delete "${targetPost.title}"?`}
					onConfirm={handleDelete}
					onCancel={() => setConfirm(null)}
				/>
			)}

			<SectionHeader
				title="Posts"
				count={filtered.length}
				search={search}
				onSearch={setSearch}
				placeholder="Search posts…"
			/>

			<DataTable headers={["Title", "Author", "Status", "Actions"]}>
				{loading ? (
					<TableSkeleton cols={4} />
				) : error ? (
					<ErrorRow cols={4} message={error} />
				) : filtered.map((post) => (
					<tr
						key={post.id}
						className="border-b border-border last:border-0 hover:bg-border/30 transition-colors"
					>
						{/* Title */}
						<td className="px-5 py-3.5 text-sm font-medium text-text max-w-[260px] truncate">
							{post.title}
						</td>

						{/* Author */}
						<td className="px-5 py-3.5">
							<div className="flex items-center gap-2">
								<div className="w-6 h-6 rounded-full bg-accent-soft text-accent flex items-center justify-center text-[10px] font-bold shrink-0">
									{post.author[0].toUpperCase()}
								</div>
								<span className="text-sm text-muted">{post.author}</span>
							</div>
						</td>

						{/* Status */}
						<td className="px-5 py-3.5">
							<span className={statusBadge[post.status]}>{post.status}</span>
						</td>

						{/* Actions */}
						<td className="px-5 py-3.5">
							<button
								onClick={() => setConfirm(post.id)}
								className="px-2.5 py-1 text-xs rounded-lg bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20 transition-colors"
							>
								Delete
							</button>
						</td>
					</tr>
				))}
			</DataTable>
		</section>
	);
}

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