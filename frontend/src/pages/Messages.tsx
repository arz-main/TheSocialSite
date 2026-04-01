import { useState, useEffect, useContext } from "react";
import { AnimatePresence } from "framer-motion";
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
	const { currentUser } = useAuth();

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

		const handler = (conversationId: string, senderId: string, message: string, messageId: string) => {
			const otherUserId = conversationId.split("_").find(id => id !== currentUser.id)!;
			const participant = users.find(u => u.id === otherUserId);
			if (!participant) return;

			setConversations(prev => {
				const prevConvo = prev[otherUserId] || {
					conversationId,
					participant,
					messages: [],
					lastMessage: "",
					lastMessageAt: "",
					unreadCount: 0,
				};

				if (prevConvo.messages.some(m => m.id === messageId)) return prev;

				const newMessage: ChatMessage = {
					id: messageId,
					senderId,
					text: message,
					createdAt: new Date().toISOString(),
				};

				return {
					...prev,
					[otherUserId]: {
						...prevConvo,
						messages: [...prevConvo.messages, newMessage],
						lastMessage: message,
						lastMessageAt: newMessage.createdAt,
						unreadCount: selectedUserId === otherUserId ? 0 : (prevConvo.unreadCount ?? 0) + 1,
					},
				};
			});
		};

		connection.on("ReceiveMessage", handler);
		return () => connection.off("ReceiveMessage", handler);
	}, [connection, currentUser, users, selectedUserId]);

	const handleSelectUser = async (userId: string) => {
		setSelectedUserId(userId);
		setConversations(prev => {
			if (!prev[userId]) return prev;
			return { ...prev, [userId]: { ...prev[userId], unreadCount: 0 } };
		});

		if (!connection || !currentUser) return;
		const conversationId = buildConversationId(currentUser.id, userId);
		try {
			await connection.invoke("JoinConversation", conversationId);
		} catch (err) {
			console.error("Failed to join conversation:", err);
		}
	};

	const handleMessageSent = (msg: ChatMessage) => {
		console.log("Message sent:", msg.text);
	};

	const filteredUsers = users.filter(u =>
		u.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<section className="flex flex-col w-full h-screen overflow-hidden bg-background">
			<div className="flex-1 flex p-4 min-h-0">
				<div className="flex-1 grid grid-cols-[288px_1fr] min-h-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">

					{/* Sidebar */}
					<div className="flex flex-col min-h-0 border-r border-border">

						{/* Search header */}
						<div className="p-3 shrink-0 border-b border-border">
							<p className="text-sm font-medium mb-2.5 px-1 text-text">Messages</p>
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
								<input
									type="text"
									value={searchQuery}
									onChange={e => setSearchQuery(e.target.value)}
									placeholder="Search conversations…"
									className="w-full rounded-full pl-10 pr-4 py-1.5 text-xs border border-border bg-background text-text placeholder:text-muted outline-none focus:border-primary transition-colors"
								/>
							</div>
						</div>

						{/* User list */}
						<div className="flex-1 overflow-y-auto min-h-0 p-1.5 scrollbar-hide bg-card">
							{filteredUsers.length === 0 ? (
								<p className="text-center text-xs mt-6 text-muted">No users found</p>
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
											index={i}
											conversation={convo}
											isSelected={selectedUserId === user.id}
											onClick={() => handleSelectUser(user.id)}
										/>
									);
								})
							)}
						</div>
					</div>

					{/* Chat panel */}
					<div className="flex flex-col flex-1 min-h-0 bg-background">
						<AnimatePresence mode="wait">
							{selectedUserId ? (
								<ChatView
									key={selectedUserId}
									connection={connection}
									currentUserId={currentUser!.id}
									conversation={conversations[selectedUserId] || {
										conversationId: buildConversationId(currentUser!.id, selectedUserId),
										participant: users.find(u => u.id === selectedUserId)!,
										messages: [],
										lastMessage: "",
										lastMessageAt: "",
										unreadCount: 0,
									}}
									onMessageSent={handleMessageSent}
								/>
							) : (
								<EmptyState key="empty" />
							)}
						</AnimatePresence>
					</div>

				</div>
			</div>
		</section>
	);
}