import type { ChatMessage, ChatViewProps, ConversationItemProps } from "../../types/MessagesPageTypes";
import { motion } from "framer-motion";
import { formatRelativeTime, formatMessageTimestamp } from "../../utils/MessagePageUtils";
import { User, Send, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { KeyboardEvent, ChangeEvent } from "react";


function EmptyState() {
	return (
		<div className="flex flex-col items-center justify-center gap-3 p-8 text-center h-full">
			<div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-text/40">
				<Send className="w-7 h-7" />
			</div>
			<p className="m-0 font-semibold text-lg text-text">Your Messages</p>
			<p className="m-0 text-sm text-text/50 max-w-[220px]">
				Select a conversation to start chatting with other artists.
			</p>
		</div>
	);
}

function ChatView({ conversation, onBack, isMobile }: ChatViewProps) {
	const [inputValue, setInputValue] = useState<string>("");
	const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages);

	/**
	 * Ref attached directly to the scrollable messages <div>.
	 * We set scrollTop = scrollHeight on this element (rather than calling
	 * scrollIntoView on a child sentinel) so only this container scrolls —
	 * the surrounding page layout is never affected.
	 */
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	/**
	 * After every render in which messages grows, snap the scroll container
	 * to its own bottom so the newest message is always in view.
	 */
	useEffect(() => {
		const container: HTMLDivElement | null = scrollContainerRef.current;
		if (container) {
			container.scrollTop = container.scrollHeight;
		}
	}, [messages]);

	const sendMessage = (): void => {
		const trimmed: string = inputValue.trim();
		if (!trimmed) return;

		const newMessage: ChatMessage = {
			id: `m_${Date.now()}`,
			senderId: "me",
			text: trimmed,
			createdAt: new Date().toISOString(),
		};

		setMessages((prev: ChatMessage[]) => [...prev, newMessage]);
		setInputValue("");
	};

	const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
		if (e.key === "Enter") sendMessage();
	};

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
		setInputValue(e.target.value);
	};

	return (
		<motion.div
			key={conversation.id}
			initial={{ opacity: 0, x: 30 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 30 }}
			transition={{ duration: 0.2 }}
			className="grid grid-rows-[auto_1fr_auto] h-full min-h-0"
		>
			{/* Header — participant info and mobile back button */}
			<div className="px-4 py-3.5 border-b border-muted flex items-center gap-3">
				{isMobile && (
					<button
						onClick={onBack}
						className="bg-transparent border-none cursor-pointer text-text/60 hover:text-text transition-colors p-1 flex"
					>
						<ArrowLeft className="w-5 h-5" />
					</button>
				)}
				<div className="relative">
					<div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-text">
						<User className="w-5 h-5" />
					</div>
					{conversation.isOnline && (
						<span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-card rounded-full block" />
					)}
				</div>
				<div>
					<p className="m-0 font-semibold text-sm text-text">{conversation.username}</p>
					<p className="m-0 text-xs text-text/60">{conversation.isOnline ? "Active now" : "Offline"}</p>
				</div>
			</div>

			{/* Scrollable message list — ref used for programmatic scroll-to-bottom */}
			<div
				ref={scrollContainerRef}
				className="overflow-y-auto p-4 flex flex-col gap-2.5"
			>
				{messages.map((msg: ChatMessage) => {
					const isMe: boolean = msg.senderId === "me";
					return (
						<motion.div
							key={msg.id}
							initial={{ opacity: 0, y: 8, scale: 0.97 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							transition={{ duration: 0.18 }}
							className={`flex ${isMe ? "justify-end" : "justify-start"}`}
						>
							<div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? "items-end" : "items-start"}`}>
								<div className={`px-3.5 py-2.5 text-sm leading-relaxed ${isMe
										? "bg-primary text-white rounded-[18px_18px_4px_18px]"
										: "bg-muted text-text rounded-[18px_18px_18px_4px]"
									}`}>
									{msg.text}
								</div>
								<span className="text-xs text-text/40 px-1">
									{formatMessageTimestamp(msg.createdAt)}
								</span>
							</div>
						</motion.div>
					);
				})}
			</div>

			{/* Input bar */}
			<div className="px-4 py-3 border-t border-muted flex items-center gap-2.5">
				<input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleKeyDown}
					placeholder="Message..."
					className="flex-1 bg-muted text-text placeholder:text-text/40 rounded-full px-4 py-2.5 text-sm outline-none border border-transparent focus:border-primary/40 transition-colors"
				/>
				<motion.button
					onClick={sendMessage}
					whileTap={{ scale: 0.88 }}
					transition={{ type: "spring", stiffness: 400, damping: 17 }}
					disabled={!inputValue.trim()}
					className="w-10 h-10 rounded-full bg-button hover:bg-primary flex items-center justify-center text-text border-none cursor-pointer flex-shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
		>
			<button
				onClick={onClick}
				className={`w-full text-left px-4 py-3 flex items-center gap-3 rounded-lg border-none cursor-pointer transition-colors ${
					isSelected ? "bg-muted" : "bg-transparent hover:bg-muted/50"
				}`}
			>
				{/* Avatar with online indicator dot */}
				<div className="relative flex-shrink-0">
					<div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-text">
						<User className="w-5 h-5" />
					</div>
					{conversation.isOnline && (
						<span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full block" />
					)}
				</div>

				{/* Username, last message preview, timestamp, and unread badge */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-0.5">
						<span className={`text-text text-sm truncate ${conversation.unreadCount > 0 ? "font-bold" : "font-semibold"}`}>
							{conversation.username}
						</span>
						<span className="text-text/60 text-xs flex-shrink-0 ml-2">
							{formatRelativeTime(conversation.lastMessageAt)}
						</span>
					</div>
					<div className="flex items-center justify-between">
						<p className={`text-sm truncate m-0 ${conversation.unreadCount > 0 ? "text-text font-medium" : "text-text/60"}`}>
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