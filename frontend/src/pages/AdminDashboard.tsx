import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/BasicButton";
import {
	AdminTable,
	TableSection,
	StatCard,
	userColumns,
	postColumns,
	ActionToggleButton,
} from "../components/ui/AdminPageComponents";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { mockUsers } from "../_mock/mockUsers";
import { mockPosts } from "../_mock/mockPosts";
import type { User } from "../types/UserTypes";
import type { Post } from "../types/PostTypes";

type UserAction = "delete" | "promote" | null;
type PostAction = "delete" | null;

const AdminDashboard: React.FC = () => {
	const [allUsers, setAllUsers] = React.useState<User[]>(mockUsers);
	const [allPosts, setAllPosts] = React.useState<Post[]>(mockPosts);

	const [activeUserAction, setActiveUserAction] = React.useState<UserAction>(null);
	const [activePostAction, setActivePostAction] = React.useState<PostAction>(null);

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
				u.id === userId
					? { ...u, role: u.role === "admin" ? "artist" : "admin" }
					: u
			)
		);
	};

	const handleDeletePost = (postId: string) => {
		if (!window.confirm("Delete this post?")) return;
		setAllPosts(prev => prev.filter(p => p.id !== postId));
	};

	const adminCount = allUsers.filter(u => u.role === "admin").length;

	// Build action column for users based on active mode
	const userActionColumn = React.useMemo(() => {
		if (!activeUserAction) return [];

		return [
			{
				label: "Action",
				field: "actions" as keyof User,
				render: (user: User) => (
					<AnimatePresence mode="wait">
						<motion.div
							key={activeUserAction}
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 6 }}
							transition={{ duration: 0.15 }}
						>
							{activeUserAction === "delete" && (
								<Button
									onClick={() => handleDeleteUser(user.id)}
									variant="danger"
								>
									Delete
								</Button>
							)}
							{activeUserAction === "promote" && (
								<Button
									onClick={() => handleToggleRole(user.id)}
									variant="warning"
								>
									{user.role === "admin" ? "Demote" : "Promote"}
								</Button>
							)}
						</motion.div>
					</AnimatePresence>
				),
			},
		];
	}, [activeUserAction, allUsers]);

	// Build action column for posts based on active mode
	const postActionColumn = React.useMemo(() => {
		if (!activePostAction) return [];

		return [
			{
				label: "Action",
				field: "actions" as keyof Post,
				render: (post: Post) => (
					<AnimatePresence mode="wait">
						<motion.div
							key={activePostAction}
							initial={{ opacity: 0, x: -6 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 6 }}
							transition={{ duration: 0.15 }}
						>
							{activePostAction === "delete" && (
								<Button
									onClick={() => handleDeletePost(post.id)}
									variant="danger"
								>
									Delete
								</Button>
							)}
						</motion.div>
					</AnimatePresence>
				),
			},
		];
	}, [activePostAction]);

	const userColumnsWithActions = [...userColumns, ...userActionColumn];
	const postColumnsWithActions = [...postColumns, ...postActionColumn];

	// Action toolbar rendered next to each table's title
	const UserActionToolbar = (
		<div className="flex gap-2 items-center">
			<ActionToggleButton
				label="Delete"
				variant="danger"
				active={activeUserAction === "delete"}
				onClick={() =>
					setActiveUserAction(prev => (prev === "delete" ? null : "delete"))
				}
			/>
			<ActionToggleButton
				label="Promote / Demote"
				variant="warning"
				active={activeUserAction === "promote"}
				onClick={() =>
					setActiveUserAction(prev => (prev === "promote" ? null : "promote"))
				}
			/>
			{activeUserAction && (
				<motion.button
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					onClick={() => setActiveUserAction(null)}
					className="text-xs text-muted-foreground underline underline-offset-2 hover:text-text transition-colors ml-1"
				>
					Cancel
				</motion.button>
			)}
		</div>
	);

	const PostActionToolbar = (
		<div className="flex gap-2 items-center">
			<ActionToggleButton
				label="Delete"
				variant="danger"
				active={activePostAction === "delete"}
				onClick={() =>
					setActivePostAction(prev => (prev === "delete" ? null : "delete"))
				}
			/>
			{activePostAction && (
				<motion.button
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.9 }}
					onClick={() => setActivePostAction(null)}
					className="text-xs text-muted-foreground underline underline-offset-2 hover:text-text transition-colors ml-1"
				>
					Cancel
				</motion.button>
			)}
		</div>
	);

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
							value={
								allUsers.length
									? (allPosts.length / allUsers.length).toFixed(1)
									: 0
							}
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
						actionToolbar={UserActionToolbar}
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
						actionToolbar={PostActionToolbar}
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