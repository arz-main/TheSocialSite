import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ChatView, EmptyState, ConversationItem } from "../components/MessagesPageComponents";
import { useUsers } from "../hooks/useUsers";
import { SignalRContext } from "../providers/SignalRProvider";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/UserTypes";
import type { Conversation, ChatMessage } from "../types/MessagesPageTypes";

function buildConversationId(userIdA: string, userIdB: string): string {
	return [userIdA, userIdB].sort().join("_");
}

export default function MessagesPage() {
	const { connection } = useContext(SignalRContext)!;
	const { getAllUsers } = useUsers();
	const { user: currentUser } = useAuth();

	const [users, setUsers] = useState<User[]>([]);
	const [conversations, setConversations] = useState<{ [userId: string]: Conversation }>({});
	const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (!currentUser) return;
		const fetchUsers = async () => {
			const allUsers = await getAllUsers();
			setUsers(allUsers.filter(u => u.id !== currentUser.id));
		};
		fetchUsers();
	}, [currentUser?.id, getAllUsers]);

	useEffect(() => {
		if (!connection || !currentUser) return;
		const handler = (
			conversationId: string,
			senderId: string,
			message: string,
			messageId: string
		) => {
			if (senderId === currentUser.id) return;
			const otherUserId = conversationId.split("_").find(id => id !== currentUser.id)!;
			const participant = users.find(u => u.id === otherUserId);
			if (!participant) return;
			const newMessage: ChatMessage = {
				id: messageId,
				senderId,
				text: message,
				createdAt: new Date().toISOString(),
			};
			setConversations(prev => {
				const prevConvo = prev[otherUserId];
				return {
					...prev,
					[otherUserId]: {
						conversationId,
						participant,
						messages: [...(prevConvo?.messages || []), newMessage],
						lastMessage: message,
						lastMessageAt: newMessage.createdAt,
						unreadCount: selectedUserId === otherUserId ? 0 : (prevConvo?.unreadCount || 0) + 1,
					},
				};
			});
		};
		connection.on("ReceiveMessage", handler);
		return () => connection.off("ReceiveMessage", handler);
	}, [connection, currentUser, users, selectedUserId]);

	const handleSelectUser = (userId: string) => {
		setSelectedUserId(userId);
		setConversations(prev => {
			if (!prev[userId]) return prev;
			return { ...prev, [userId]: { ...prev[userId], unreadCount: 0 } };
		});
	};

	const handleMessageSent = (message: ChatMessage) => {
		if (!selectedUserId || !currentUser) return;
		setConversations(prev => {
			const prevConvo = prev[selectedUserId];
			const participant = users.find(u => u.id === selectedUserId)!;
			return {
				...prev,
				[selectedUserId]: {
					conversationId: prevConvo?.conversationId || buildConversationId(currentUser.id, selectedUserId),
					participant: prevConvo?.participant || participant,
					messages: [...(prevConvo?.messages || []), message],
					lastMessage: message.text,
					lastMessageAt: message.createdAt,
					unreadCount: prevConvo?.unreadCount || 0,
				},
			};
		});
	};

	const filteredUsers = users.filter(u =>
		u.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<section
			className="flex flex-col w-full overflow-hidden bg-background"
			style={{ height: "calc(100vh - 4rem)" }}
		>
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.2 }}
				className="flex-1 flex flex-col p-4 min-h-0"
			>
				{/* Outer card */}
				<div
					className="flex-1 grid min-h-0 overflow-hidden rounded-2xl"
					style={{
						gridTemplateColumns: "288px 1fr",
						border: "1px solid var(--border)",
						background: "var(--card)",
						boxShadow: "0 1px 3px 0 rgba(0,0,0,0.06)",
					}}
				>
					{/* Sidebar */}
					<div
						className="flex flex-col min-h-0 border-r"
						style={{ borderColor: "var(--border)", background: "var(--card)" }}
					>
						{/* Search header */}
						<div
							className="p-3 shrink-0 border-b"
							style={{ borderColor: "var(--border)" }}
						>
							<p className="text-sm font-medium mb-2.5 px-1" style={{ color: "var(--text)" }}>
								Messages
							</p>
							<div className="relative">
								<Search
									className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5"
									style={{ color: "var(--text-opaque)" }}
								/>
								<input
									type="text"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									placeholder="Search conversations…"
									className="w-full rounded-full pl-8 pr-4 py-1.5 text-xs outline-none transition-colors duration-150"
									style={{
										background: "var(--background)",
										color: "var(--text)",
										border: "1px solid var(--border)",
									}}
									onFocus={e => (e.target.style.borderColor = "var(--primary)")}
									onBlur={e => (e.target.style.borderColor = "var(--border)")}
								/>
							</div>
						</div>

						{/* User list */}
						<div className="flex-1 overflow-y-auto min-h-0 p-1.5 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
							{filteredUsers.length === 0 ? (
								<p className="text-center text-xs mt-6" style={{ color: "var(--text-opaque)" }}>
									No users found
								</p>
							) : (
								filteredUsers.map((user, i) => {
									const convo: Conversation = conversations[user.id] || {
										conversationId: buildConversationId(currentUser!.id, user.id),
										participant: user,
										messages: [],
										lastMessage: "",
										lastMessageAt: "",
										unreadCount: 0,
									};
									return (
										<ConversationItem
											key={user.id}
											conversation={convo}
											index={i}
											isSelected={selectedUserId === user.id}
											onClick={() => handleSelectUser(user.id)}
										/>
									);
								})
							)}
						</div>
					</div>

					{/* Chat panel */}
					<div className="flex flex-col flex-1 min-h-0" style={{ background: "var(--background)" }}>
						<AnimatePresence mode="wait">
							{selectedUserId ? (
								<ChatView
									key={selectedUserId}
									connection={connection}
									currentUserId={currentUser!.id}
									conversation={
										conversations[selectedUserId] || {
											conversationId: buildConversationId(currentUser!.id, selectedUserId),
											participant: users.find(u => u.id === selectedUserId)!,
											messages: [],
											lastMessage: "",
											lastMessageAt: "",
											unreadCount: 0,
										}
									}
									onMessageSent={handleMessageSent}
								/>
							) : (
								<EmptyState key="empty" />
							)}
						</AnimatePresence>
					</div>
				</div>
			</motion.div>
		</section>
	);
}