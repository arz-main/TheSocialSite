import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ChatView, EmptyState, ConversationItem } from "../components/ui/MessagesPageComponents";
import { Card } from "../components/ui/Card";
import { useUsers } from "../hooks/useUsers";
import { SignalRContext } from "../signalR/SignalRProvider";
import type { User } from "../types/UserTypes";
import type { Conversation, ChatMessage } from "../types/MessagesPageTypes";
import { useAuth } from "../hooks/useAuth";

// Deterministic conversation ID — same result regardless of who calls it
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
		const fetchUsers = async () => {
			const allUsers = await getAllUsers();
			setUsers(allUsers.filter(u => u.id !== currentUser?.id));
		};
		fetchUsers();
	}, [currentUser?.id, getAllUsers]);

	// Listen for incoming messages
	useEffect(() => {
		if (!connection || !currentUser) return;

		const handler = (
			conversationId: string,
			senderId: string,
			message: string,
			messageId: string
		) => {
			if (senderId === currentUser.id) return; // <-- add this line

			const otherUserId = conversationId.split("_").find(id => id !== currentUser.id)!;

			setConversations(prev => {
				const participant = users.find(u => u.id === otherUserId);
				if (!participant) return prev;

				const prevConvo = prev[otherUserId];
				const newMessage: ChatMessage = {
					id: messageId,
					senderId,
					text: message,
					createdAt: new Date().toISOString(),
				};

				return {
					...prev,
					[otherUserId]: {
						conversationId,
						participant,
						messages: [...(prevConvo?.messages || []), newMessage],
						lastMessage: message,
						lastMessageAt: newMessage.createdAt,
						unreadCount: (prevConvo?.unreadCount || 0) + 1,
					},
				};
			});
		};

		connection.on("ReceiveMessage", handler);
		return () => connection.off("ReceiveMessage", handler);
	}, [connection, currentUser, users]);

	// Clear unread count when selecting a conversation
	const handleSelectUser = (userId: string) => {
		setSelectedUserId(userId);
		setConversations(prev => {
			if (!prev[userId]) return prev;
			return {
				...prev,
				[userId]: { ...prev[userId], unreadCount: 0 },
			};
		});
	};

	const filteredUsers = users.filter(u =>
		u.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	// Append a locally-sent message directly into conversations state
	const handleMessageSent = (message: ChatMessage) => {
		if (!selectedUserId) return;
		setConversations(prev => {
			const prevConvo = prev[selectedUserId];
			const participant = users.find(u => u.id === selectedUserId)!;
			return {
				...prev,
				[selectedUserId]: {
					conversationId: prevConvo?.conversationId || buildConversationId(currentUser!.id, selectedUserId),
					participant: prevConvo?.participant || participant,
					messages: [...(prevConvo?.messages || []), message],
					lastMessage: message.text,
					lastMessageAt: message.createdAt,
					unreadCount: prevConvo?.unreadCount || 0,
				},
			};
		});
	};

	return (
		<section className="absolute inset-0 top-16 flex flex-col w-full bg-background text-foreground overflow-hidden">
			<motion.div className="flex-1 flex flex-col p-6 min-h-0 overflow-hidden">
				<Card className="overflow-hidden flex-1 grid grid-cols-[320px_1fr] min-h-0">
					{/* Sidebar */}
					<div className="border-r border-border grid grid-rows-[auto_1fr] min-h-0 overflow-hidden">
						<div className="p-4 border-b border-border flex-shrink-0">
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-opaque">
									<Search className="w-4 h-4" />
								</span>
								<input
									type="text"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									placeholder="Search users..."
									className="w-full bg-card text-text placeholder:text-text-opaque rounded-full pl-9 pr-4 py-2 text-sm outline-none border border-border focus:border-primary transition-colors"
								/>
							</div>
						</div>

						<div className="overflow-y-auto p-2 min-h-0">
							{filteredUsers.length === 0 ? (
								<p className="text-center text-muted text-sm mt-4">No users found</p>
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

					{/* Chat View */}
					<div className="min-h-0 overflow-hidden flex flex-col bg-card">
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
				</Card>
			</motion.div>
		</section>
	);
};