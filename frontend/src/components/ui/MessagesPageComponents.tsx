import type { ChatViewProps, ConversationItemProps } from "../../types/MessagesPageTypes";
import { motion } from "framer-motion";
import { formatRelativeTime } from "../../utils/MessagePageUtils";
import { Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { AvatarWithFallback } from "./AvatarWithFallback";

export function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 p-8 text-center h-full">
			<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
				<Send className="w-7 h-7" />
			</div>
			<p className="m-0 font-semibold text-lg text-text">Your Messages</p>
			<p className="m-0 text-sm text-text-opaque max-w-[220px]">
				Select a conversation to start chatting with other users.
			</p>
		</div>
	);
}
export function ConversationItem({ conversation, index, isSelected, onClick }: ConversationItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.05 * index, duration: 0.3 }}
			className="mb-1"
		>
			<button
				onClick={onClick}
				className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isSelected ? "bg-background" : "hover:bg-background-opposite/10"
					}`}
			>
				<div className="flex-shrink-0">
					<div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
						<AvatarWithFallback
							src={conversation.participant.avatar || ""}
							alt={conversation.participant.username}
							className="w-full h-full object-cover"
						/>
					</div>
				</div>

				<div className="flex-1 min-w-0 text-left">
					<span className="block font-semibold text-text truncate">
						{conversation.participant.username}
					</span>
					<span className="block text-xs text-text-opaque truncate">
						{conversation.lastMessage || "No messages yet"}
					</span>
				</div>
			</button>
		</motion.div>
	);
}

export function ChatView({ connection, currentUserId, conversation, onMessageSent }: ChatViewProps) {
	const [draft, setDraft] = useState("");
	const [isSending, setIsSending] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null); // new
	const { conversationId, participant, messages } = conversation;

	useEffect(() => {
		if (!connection || !conversationId) return;
		connection.invoke("JoinConversation", conversationId)
			.catch(err => console.error("JoinConversation failed:", err));
		return () => {
			connection.invoke("LeaveConversation", conversationId)
				.catch(err => console.error("LeaveConversation failed:", err));
		};
	}, [connection, conversationId]);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async () => {
		const text = draft.trim();
		if (!text || !connection || isSending) return;

		setIsSending(true);
		setDraft("");

		onMessageSent({
			id: crypto.randomUUID(),
			senderId: currentUserId,
			text,
			createdAt: new Date().toISOString(),
		});

		try {
			await connection.invoke("SendMessageActionExecution", {
				conversationId,
				user: currentUserId,
				message: text,
			});
		} catch (err) {
			console.error("SendMessage failed:", err);
			setDraft(text);
		} finally {
			setIsSending(false);
			// Wait for React to re-render with disabled=false before focusing
			setTimeout(() => inputRef.current?.focus(), 0);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<div className="flex flex-col h-full overflow-hidden"> {/* overflow-hidden here */}
			{/* Header */}
			<div className="flex-shrink-0 px-5 py-4 border-b border-border flex items-center gap-3">
				<div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
					{participant?.username?.[0]?.toUpperCase()}
				</div>
				<span className="font-medium text-text">{participant?.username}</span>
			</div>

			{/* Messages — this is the only scrollable part */}
			<div className="flex-1 overflow-y-auto min-h-0 px-5 py-4 flex flex-col gap-2">
				{messages.length === 0 ? (
					<p className="text-center text-muted text-sm mt-8">No messages yet. Say hello!</p>
				) : (
					messages.map(msg => {
						const isMine = msg.senderId === currentUserId;
						return (
							<div key={msg.id} className={`flex min-w-0 ${isMine ? "justify-end" : "justify-start"}`}>
								<div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm break-words min-w-0 ${isMine
										? "bg-primary text-white rounded-br-sm"
										: "bg-card border border-border text-text rounded-bl-sm"
									}`}>
									{msg.text}
								</div>
							</div>
						);
					})
				)}
				<div ref={bottomRef} />
			</div>

			{/* Input */}
			<div className="flex-shrink-0 px-4 py-3 border-t border-border flex gap-2 items-center">
				<input
					ref={inputRef}
					type="text"
					value={draft}
					onChange={e => setDraft(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={`Message ${participant?.username}...`}
					disabled={isSending}
					className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm text-text placeholder:text-text-opaque outline-none focus:border-primary transition-colors disabled:opacity-50"
				/>
				<button
					onClick={sendMessage}
					disabled={!draft.trim() || isSending}
					className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white transition-opacity disabled:opacity-40 hover:opacity-90"
				>
					<Send className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
}