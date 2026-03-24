import type { ChatMessage, ChatViewProps, ConversationItemProps } from "../../types/MessagesPageTypes";
import { motion } from "framer-motion";
import { formatRelativeTime, formatMessageTimestamp } from "../../utils/MessagePageUtils";
import { Send, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";
import { AvatarWithFallback } from "./AvatarWithFallback";

function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 p-8 text-center h-full">
			<div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white">
				<Send className="w-7 h-7" />
			</div>
			<p className="m-0 font-semibold text-lg text-text">Your Messages</p>
			<p className="m-0 text-sm text-text-opaque max-w-[220px]">
				Select a conversation to start chatting with other artists.
			</p>
		</div>
	);
}

function ChatView({ conversation, onBack, isMobile }: ChatViewProps) {
	const [inputValue, setInputValue] = useState<string>("");
	const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = scrollContainerRef.current;
		if (container) container.scrollTop = container.scrollHeight;
	}, [messages]);

	const sendMessage = (): void => {
		const trimmed = inputValue.trim();
		if (!trimmed) return;

		const newMessage: ChatMessage = {
			id: `m_${Date.now()}`,
			senderId: "me",
			text: trimmed,
			createdAt: new Date().toISOString(),
		};

		setMessages(prev => [...prev, newMessage]);
		setInputValue("");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") sendMessage();
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	return (
		<motion.div
			key={conversation.id}
			initial={{ opacity: 0, x: 30 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 30 }}
			transition={{ duration: 0.2 }}
			className="grid grid-rows-[auto_1fr_auto] h-full min-h-0 bg-background"
		>
			{/* Header */}
			<div className="px-4 py-3.5 border-b border-border flex items-center gap-3 bg-card">
				{isMobile && (
					<button
						onClick={onBack}
						className="bg-transparent border-none cursor-pointer text-text-opaque hover:text-text transition-colors p-1 flex"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
				)}
				<div className="relative flex-shrink-0">
					<AvatarWithFallback
						src="" // use actual avatar if available
						alt={conversation.username}
						size={48} // controls avatar size
					/>
					{conversation.isOnline && (
						<span className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-background rounded-full shadow-sm" />
					)}
				</div>
				<div className="flex-1 min-w-0">
					<p className="m-0 font-semibold text-sm text-text truncate">{conversation.username}</p>
					<p className="m-0 text-xs text-text-opaque">
						{conversation.isOnline ? "Active now" : "Offline"}
					</p>
				</div>
			</div>

			{/* Message list */}
			<div
				ref={scrollContainerRef}
				className="overflow-y-auto pt-4 pr-4 pl-4 flex flex-col gap-2.5 bg-card"
			>
				{messages.map(msg => {
					const isMe = msg.senderId === "me";
					return (
						<motion.div
							key={msg.id}
							initial={{ opacity: 0, y: 8, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.18 }}
							className={`flex ${isMe ? "justify-end" : "justify-start"}`}
						>
							<div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
								<div
									className={`px-3.5 py-2.5 text-sm leading-relaxed ${isMe
										? "bg-primary text-text-opposite rounded-[18px_18px_4px_18px]"
										: "bg-background text-text border border-border rounded-[18px_18px_18px_4px]"
										}`}
								>
									{msg.text}
								</div>
								<span className="text-xs text-text-opaque px-1">
									{formatMessageTimestamp(msg.createdAt)}
								</span>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Input bar */}
			<div className="px-4 py-3 border-t border-border flex items-center gap-2.5 bg-card">
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder="Message..."
					className="flex-1 bg-background text-text placeholder:text-text-opaque rounded-xl px-4 py-2.5 text-sm outline-none border border-border focus:border-primary transition-colors"
				/>
				<motion.button
					onClick={sendMessage}
					whileTap={{ scale: 0.88 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
					disabled={!inputValue.trim()}
					className="w-10 h-10 rounded-full bg-primary hover:bg-primary-hover text-text-opposite flex items-center justify-center border-none cursor-pointer flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
				>
					<Send className="w-4 h-4" />
				</motion.button>
			</div>
		</motion.div>
	);
}

function ConversationItem({ conversation, index, isSelected, onClick }: ConversationItemProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: 0.05 * index, duration: 0.3 }}
			className="mb-2" // margin between items
		>
			<button
				onClick={onClick}
				className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${isSelected ? "bg-background hover:bg-background" : "hover:bg-background-opposite/10"
					}`}
			>
				{/* Avatar */}
				<div className="relative flex-shrink-0">
					<div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center overflow-hidden">
						<AvatarWithFallback
							src=""
							alt={conversation.username}
							className="w-full h-full object-cover"
						/>
					</div>

					{/* Online status */}
					{conversation.isOnline && (
						<span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success border-2 border-background rounded-full" />
					)}
				</div>

				{/* User info */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-0.5">
						<span className="truncate font-semibold text-text">
							{conversation.username}
						</span>
						<span className="text-text-opaque text-xs flex-shrink-0 ml-2">
							{formatRelativeTime(conversation.lastMessageAt)}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<p className={`truncate text-sm m-0 ${conversation.unreadCount > 0 ? "text-text font-medium" : "text-text-opaque"}`}>
							{conversation.lastMessage}
						</p>
						{conversation.unreadCount > 0 && (
							<span className="ml-2 flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-xs text-white font-bold">
								{conversation.unreadCount}
							</span>
						)}
					</div>
				</div>
			</button>
		</motion.div>
	);
}

export {
	ConversationItem,
	ChatView,
	EmptyState
};