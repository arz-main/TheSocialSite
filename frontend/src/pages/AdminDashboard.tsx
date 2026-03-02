import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/BasicButton";
import { AdminTable } from "../components/ui/AdminPageComponents";
import { mockUsers } from "../_mock/mockUsers";
import { mockPosts } from "../_mock/mockPosts";
import type { User } from "../types/UserTypes";
import type { Post } from "../types/PostTypes";
import type { Column } from "../types/AdminPageTypes";

const PAGE_SIZE = 5;

const AdminDashboard: React.FC = () => {
	const [allUsers, setAllUsers] = useState<User[]>(mockUsers);
	const [allPosts, setAllPosts] = useState<Post[]>(mockPosts);

	// --- Users table state ---
	const [userPage, setUserPage] = useState(1);
	const [userSortField, setUserSortField] = useState<keyof User>("name");
	const [userSortAsc, setUserSortAsc] = useState(true);

	// --- Posts table state ---
	const [postPage, setPostPage] = useState(1);
	const [postSortField, setPostSortField] = useState<keyof Post>("createdAt");
	const [postSortAsc, setPostSortAsc] = useState(true);

	// --- Sorting helpers ---
	const sortedUsers = useMemo(() => {
		return [...allUsers].sort((a, b) => {
			const aVal = a[userSortField];
			const bVal = b[userSortField];

			if (aVal === undefined) return 1;
			if (bVal === undefined) return -1;

			if (typeof aVal === "string" && typeof bVal === "string") {
				return userSortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			}

			if (typeof aVal === "number" && typeof bVal === "number") {
				return userSortAsc ? aVal - bVal : bVal - aVal;
			}

			return 0;
		});
	}, [allUsers, userSortField, userSortAsc]);

	const sortedPosts = useMemo(() => {
		return [...allPosts].sort((a, b) => {
			const aVal = a[postSortField];
			const bVal = b[postSortField];

			if (aVal === undefined) return 1;
			if (bVal === undefined) return -1;

			if (typeof aVal === "string" && typeof bVal === "string") {
				return postSortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
			}

			if (typeof aVal === "number" && typeof bVal === "number") {
				return postSortAsc ? aVal - bVal : bVal - aVal;
			}

			return 0;
		});
	}, [allPosts, postSortField, postSortAsc]);

	// --- Pagination ---
	const paginatedUsers = sortedUsers.slice((userPage - 1) * PAGE_SIZE, userPage * PAGE_SIZE);
	const paginatedPosts = sortedPosts.slice((postPage - 1) * PAGE_SIZE, postPage * PAGE_SIZE);

	const totalUserPages = Math.ceil(allUsers.length / PAGE_SIZE);
	const totalPostPages = Math.ceil(allPosts.length / PAGE_SIZE);

	// --- Sort toggles ---
	const toggleUserSort = (field: keyof User) => {
		if (userSortField === field) setUserSortAsc(!userSortAsc);
		else {
			setUserSortField(field);
			setUserSortAsc(true);
		}
	};

	const togglePostSort = (field: keyof Post) => {
		if (postSortField === field) setPostSortAsc(!postSortAsc);
		else {
			setPostSortField(field);
			setPostSortAsc(true);
		}
	};

	// --- Actions ---
	const handleDeleteUser = (userId: string) => {
		if (!window.confirm("Are you sure you want to delete this user?")) return;

		setAllUsers(prev => prev.filter(u => u.id !== userId));
		setAllPosts(prev => prev.filter(p => p.userId !== userId));
	};

	const handleToggleRole = (userId: string) => {
		setAllUsers(prev =>
			prev.map(u =>
				u.id === userId ? { ...u, role: u.role === "admin" ? "artist" : "admin" } : u
			)
		);
	};

	const handleDeletePost = (postId: string) => {
		if (!window.confirm("Delete this post?")) return;
		setAllPosts(prev => prev.filter(p => p.id !== postId));
	};

	// --- Columns ---
	const userColumns: Column<User>[] = [
		{ label: "Name", field: "name", sortable: true },
		{ label: "Email", field: "email", sortable: true },
		{ label: "Role", field: "role", sortable: true },
		{ label: "Posts", field: "postsCount", sortable: true },
	];

	const postColumns: Column<Post>[] = [
		{ label: "ID", field: "id", sortable: true },
		{ label: "Username", field: "username", sortable: true },
		{ label: "Category", field: "category", sortable: true },
		{ label: "Duration", field: "duration", sortable: true },
		{ label: "Likes", field: "likes", sortable: true },
		{ label: "Comments", field: "comments", sortable: true },
		{ label: "Created At", field: "createdAt", sortable: true },
	];

	return (
		<div className="flex flex-col flex-1 items-center justify-start bg-background text-text py-12 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-6xl"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
					<p className="text-text-opaque">Manage users and posts from here</p>
				</div>

				{/* Users Table */}
				<section className="mb-12">
					<div className="flex justify-between items-center py-2">
						<h2 className="text-xl font-semibold">Users</h2>
						<div className="flex gap-2">
							<Button onClick={() => setUserPage(p => Math.max(p - 1, 1))} disabled={userPage === 1}>Prev</Button>
							<span className="px-2 py-1">{userPage}</span>
							<Button onClick={() => setUserPage(p => Math.min(p + 1, totalUserPages))} disabled={userPage >= totalUserPages}>Next</Button>
						</div>
					</div>

					<AdminTable
						data={paginatedUsers}
						columns={userColumns}
						actions={user => (
							<div className="flex gap-2">
								<Button
									onClick={() => handleToggleRole(user.id)}
									className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded-md"
								>
									{user.role === "admin" ? "Demote" : "Promote"}
								</Button>
								<Button
									onClick={() => handleDeleteUser(user.id)}
									className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-md"
									disabled={user.role === "artist"}
								>
									Delete
								</Button>
							</div>
						)}
						sortField={userSortField}
						sortAsc={userSortAsc}
						onSort={toggleUserSort}
					/>
				</section>

				{/* Posts Table */}
				<section className="mb-12">
					<div className="flex justify-between items-center py-2">
						<h2 className="text-xl font-semibold">Posts</h2>
						<div className="flex gap-2">
							<Button onClick={() => setPostPage(p => Math.max(p - 1, 1))} disabled={postPage === 1}>Prev</Button>
							<span className="px-2 py-1">{postPage}</span>
							<Button onClick={() => setPostPage(p => Math.min(p + 1, totalPostPages))} disabled={postPage >= totalPostPages}>Next</Button>
						</div>
					</div>

					<AdminTable
						data={paginatedPosts}
						columns={postColumns}
						actions={post => (
							<Button
								onClick={() => handleDeletePost(post.id)}
								className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded-md"
							>
								Delete
							</Button>
						)}
						sortField={postSortField}
						sortAsc={postSortAsc}
						onSort={togglePostSort}
					/>
				</section>
			</motion.div>
		</div>
	);
};

export default AdminDashboard;