import { useEffect, useState } from "react";
import { UsersTable, PostsTable, StatCard } from "../components/AdminPageComponents";
import { usePosts } from "../hooks/usePosts";
import { useAdmin } from "../hooks/useAdmin";
import { useUsers } from "../hooks/useUsers";
import { useFilteredData } from "../hooks/useFilteredData";
import { useAuth } from "../hooks/useAuth";
import { demoteRole, promoteRole } from "../utils/AdminDashboardPageUtil";
import type { User } from "../types/UserTypes";
import type { Post } from "../types/PostTypes";
import type { PostConfirm, UserConfirm } from "../types/AdminPageTypes";

// ─── ROOT ─────────────────────────────────────────────
export default function AdminDashboard() {
	// data
	const [posts, setPosts] = useState<Post[]>([]);
	const [users, setUsers] = useState<User[]>([]);
	const postCount = posts.length;
	const userCount = users.length;

	// search
	const [postSearch, setPostSearch] = useState("");
	const [userSearch, setUserSearch] = useState("");

	// confirm
	const [postConfirm, setPostConfirm] = useState<PostConfirm>(null);
	const [userConfirm, setUserConfirm] = useState<UserConfirm>(null);

	// hooks
	const { getAllPosts, loading: loadingPosts, error: errorPosts } = usePosts();
	const { getAllUsers, loading: loadingUsers, error: errorUsers } = useUsers();
	const { adminDeletePost, adminDeleteUser, adminUpdateUser } = useAdmin();
	const { currentUser, refreshToken } = useAuth();

	// fetch
	useEffect(() => {
		const fetch = async () => {
			const data = await getAllPosts();
			setPosts(data || []);
		};
		fetch();
	}, [getAllPosts]);

	useEffect(() => {
		const fetch = async () => {
			const data = await getAllUsers();
			setUsers(data || []);
		};
		fetch();
	}, [getAllUsers]);

	// handlers
	const handleDeletePost = async () => {
		if (!postConfirm) return;
		await adminDeletePost(postConfirm.id);
		setPosts(prev => prev.filter(p => p.id !== postConfirm.id));
		setPostConfirm(null);
	};

	const handleDeleteUser = async () => {
		if (!userConfirm) return;
		await adminDeleteUser(userConfirm.id);
		setUsers(prev => prev.filter(u => u.id !== userConfirm.id));
		setUserConfirm(null);
	};

	const handlePromoteUser = async () => {
		if (!userConfirm) return;
		const target = users.find(u => u.id === userConfirm.id);
		if (!target) return;
		const newRole = promoteRole(target.role);
		await adminUpdateUser(userConfirm.id, { role: newRole });
		setUsers(prev => prev.map(u => u.id === userConfirm.id ? { ...u, role: newRole } : u));
		if (currentUser?.id === target.id) await refreshToken();
		setUserConfirm(null);
	};

	const handleDemoteUser = async () => {
		if (!userConfirm) return;
		const target = users.find(u => u.id === userConfirm.id);
		if (!target) return;
		const newRole = demoteRole(target.role);
		await adminUpdateUser(userConfirm.id, { role: newRole });
		setUsers(prev => prev.map(u => u.id === userConfirm.id ? { ...u, role: newRole } : u));
		if (currentUser?.id === target.id) await refreshToken();
		setUserConfirm(null);
	};

	// use the handlers above to execute the admin's actions
	const handleUserOption = async () => {
		if (!userConfirm) return;
		if (userConfirm.type === "delete") await handleDeleteUser();
		else if (userConfirm.type === "promote") await handlePromoteUser();
		else await handleDemoteUser();
	};

	const handlePostOption = async () => {
		if (!postConfirm) return;
		if (postConfirm.type === "delete") await handleDeletePost();
	};

	// derived 
	const filteredPosts = useFilteredData(posts, postSearch, ["title", "author", "status", "category"]);
	const filteredUsers = useFilteredData(users, userSearch, ["username", "email", "role"]);
	const targetPost = postConfirm ? (posts.find(p => p.id === postConfirm.id) ?? null) : null;
	const targetUser = userConfirm ? (users.find(u => u.id === userConfirm.id) ?? null) : null;

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

				<UsersTable
					filteredData={filteredUsers}
					loading={loadingUsers}
					error={errorUsers}
					search={userSearch}
					onSearch={setUserSearch}
					confirm={userConfirm}
					setConfirm={setUserConfirm}
					executeConfirm={handleUserOption}
					targetUser={targetUser}
				/>
				<PostsTable
					filteredData={filteredPosts}
					loading={loadingPosts}
					error={errorPosts}
					search={postSearch}
					onSearch={setPostSearch}
					confirm={postConfirm}
					setConfirm={setPostConfirm}
					executeConfirm={handlePostOption}
					targetPost={targetPost}
				/>
			</div>
		</div>
	);
}