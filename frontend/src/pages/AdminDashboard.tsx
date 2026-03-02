import React from "react";
import { motion } from "framer-motion";
import { Button } from "../components/ui/BasicButton";
import {
	AdminTable,
	TableSection,
	StatCard,
	userColumns,
	postColumns,
} from "../components/ui/AdminPageComponents";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { mockUsers } from "../_mock/mockUsers";
import { mockPosts } from "../_mock/mockPosts";
import type { User } from "../types/UserTypes";
import type { Post } from "../types/PostTypes";

const AdminDashboard: React.FC = () => {
	const [allUsers, setAllUsers] = React.useState<User[]>(mockUsers);
	const [allPosts, setAllPosts] = React.useState<Post[]>(mockPosts);

	const userPagination = usePaginatedData(allUsers);
	const postPagination = usePaginatedData(allPosts);

	const handleDeleteUser = (userId: string) => {
		if (!window.confirm("Delete this user and all their posts?")) return;
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

	const adminCount = allUsers.filter(u => u.role === "admin").length;

	// Add action renderers directly into columns
	const userColumnsWithActions = [
		...userColumns,
		{
			label: "Actions",
			field: "actions" as keyof User,
			render: (user: User) => (
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
					>
						Delete
					</Button>
				</div>
			),
		},
	];

	const postColumnsWithActions = [
		...postColumns,
		{
			label: "Actions",
			field: "actions" as keyof Post,
			render: (post: Post) => (
				<Button
					onClick={() => handleDeletePost(post.id)}
					className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-md"
				>
					Delete
				</Button>
			),
		},
	];

	return (
		<div className="flex flex-col flex-1 bg-background text-text min-h-screen">
			<div className="w-full max-w-7xl mx-auto px-6 py-10">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					{/* Stats Cards */}
					<div className="flex flex-wrap gap-4 mb-10">
						<StatCard label="Total Users" value={allUsers.length} color="text-blue-500" />
						<StatCard label="Admins" value={adminCount} color="text-purple-500" />
						<StatCard label="Total Posts" value={allPosts.length} color="text-emerald-500" />
						<StatCard
							label="Avg. Posts / User"
							value={allUsers.length ? (allPosts.length / allUsers.length).toFixed(1) : 0}
							color="text-amber-500"
						/>
					</div>

					{/* Users Table */}
					<TableSection
						title="Users"
						count={allUsers.length}
						page={userPagination.page}
						totalPages={userPagination.totalPages}
						onPageChange={userPagination.setPage}
					>
						<AdminTable<User>
							columns={userColumnsWithActions}
							data={allUsers}
							paginatedData={userPagination.paginatedData}
							sortField={userPagination.sortField}
							sortAsc={userPagination.sortAsc}
							onSort={userPagination.handleSort}
							page={userPagination.page}
							totalPages={userPagination.totalPages}
							onPageChange={userPagination.setPage}
						/>
					</TableSection>

					{/* Posts Table */}
					<TableSection
						title="Posts"
						count={allPosts.length}
						page={postPagination.page}
						totalPages={postPagination.totalPages}
						onPageChange={postPagination.setPage}
					>
						<AdminTable<Post>
							columns={postColumnsWithActions}
							data={allPosts}
							paginatedData={postPagination.paginatedData}
							sortField={postPagination.sortField}
							sortAsc={postPagination.sortAsc}
							onSort={postPagination.handleSort}
							page={postPagination.page}
							totalPages={postPagination.totalPages}
							onPageChange={postPagination.setPage}
						/>
					</TableSection>
				</motion.div>
			</div>
		</div>
	);
};

export default AdminDashboard;