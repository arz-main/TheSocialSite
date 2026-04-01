import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { HubConnection } from "@microsoft/signalr";
import type { Conversation, ChatMessage } from "../types/MessagesPageTypes";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildMessageId(): string {
	return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function initials(name: string): string {
	return name
		.split(" ")
		.map(w => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function fmtTime(iso: string): string {
	if (!iso) return "";
	return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function fmtDate(iso: string): string {
	if (!iso) return "";
	const d = new Date(iso);
	const now = new Date();
	const diff = now.getTime() - d.getTime();
	if (diff < 86_400_000) return "Today";
	if (diff < 172_800_000) return "Yesterday";
	return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
	return (
		<div
			className="rounded-full flex items-center justify-center font-medium shrink-0"
			style={{
				width: size,
				height: size,
				fontSize: size * 0.33,
				background: "var(--primary-soft)",
				color: "var(--primary)",
			}}
		>
			{initials(name)}
		</div>
	);
}

// ---------------------------------------------------------------------------
// ConversationItem
// ---------------------------------------------------------------------------

interface ConversationItemProps {
	conversation: Conversation;
	index: number;
	isSelected: boolean;
	onClick: () => void;
}

export function ConversationItem({ conversation, index, isSelected, onClick }: ConversationItemProps) {
	const { participant, lastMessage, unreadCount } = conversation;
	const preview = lastMessage
		? lastMessage.length > 40
			? lastMessage.slice(0, 40) + "…"
			: lastMessage
		: "No messages yet";

	return (
		<motion.div
			initial={{ opacity: 0, x: -6 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: index * 0.04, duration: 0.18 }}
			onClick={onClick}
			className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-colors duration-100"
			style={{
				background: isSelected ? "var(--primary-soft)" : "transparent",
			}}
			onMouseEnter={e => {
				if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "var(--border)";
			}}
			onMouseLeave={e => {
				if (!isSelected) (e.currentTarget as HTMLDivElement).style.background = "transparent";
			}}
		>
			<div className="relative shrink-0">
				<Avatar name={participant.username} size={38} />
				{(participant as any).online && (
					<span
						className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2"
						style={{ background: "var(--success)", borderColor: "var(--card)" }}
					/>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<p
					className="text-sm font-medium truncate"
					style={{ color: isSelected ? "var(--primary)" : "var(--text)" }}
				>
					{participant.username}
				</p>
				<p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-opaque)" }}>
					{preview}
				</p>
			</div>

			{(unreadCount ?? 0) > 0 && (
				<span
					className="shrink-0 min-w-4.5 h-4.5 rounded-full text-[10px] font-medium flex items-center justify-center px-1"
					style={{ background: "var(--primary)", color: "#fff" }}
				>
					{unreadCount}
				</span>
			)}
		</motion.div>
	);
}

// ---------------------------------------------------------------------------
// EmptyState
// ---------------------------------------------------------------------------

export function EmptyState() {
	return (
		<motion.div
			key="empty"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15 }}
			className="flex-1 flex flex-col items-center justify-center gap-3"
		>
			<div
				className="w-12 h-12 rounded-full flex items-center justify-center"
				style={{ background: "var(--primary-soft)" }}
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.5">
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			</div>
			<p className="text-sm font-medium" style={{ color: "var(--text)" }}>
				No conversation selected
			</p>
			<p className="text-xs" style={{ color: "var(--text-opaque)" }}>
				Pick someone from the sidebar to start chatting
			</p>
		</motion.div>
	);
}

// ---------------------------------------------------------------------------
// Bubble
// ---------------------------------------------------------------------------

function Bubble({ msg, isMe, senderName }: { msg: ChatMessage; isMe: boolean; senderName: string }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.15 }}
			className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}
		>
			{!isMe && <Avatar name={senderName} size={26} />}

			<div
				className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
				style={{ maxWidth: "min(65%, 420px)" }}
			>
				<div
					className="px-3.5 py-2 text-[13px] leading-relaxed rounded-2xl"
					style={{
						overflowWrap: "anywhere",
						wordBreak: "break-word",
						whiteSpace: "pre-wrap",
						...(isMe
							? {
								background: "var(--primary)",
								color: "#fff",
								borderBottomRightRadius: "4px",
							}
							: {
								background: "var(--secondary-soft)",
								color: "var(--text)",
								borderBottomLeftRadius: "4px",
							}),
					}}
				>
					{msg.text}
				</div>
				<span className="text-[10px] mt-1 px-0.5" style={{ color: "var(--text-opaque)" }}>
					{fmtTime(msg.createdAt)}
				</span>
			</div>
		</motion.div>
	);
}

// ---------------------------------------------------------------------------
// ChatView
// ---------------------------------------------------------------------------

interface ChatViewProps {
	connection: HubConnection | null;
	currentUserId: string;
	conversation: Conversation;
	onMessageSent: (msg: ChatMessage) => void;
}

export function ChatView({ connection, currentUserId, conversation, onMessageSent }: ChatViewProps) {
	const { participant, messages, conversationId } = conversation;
	const [draft, setDraft] = useState("");
	const [sending, setSending] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDraft(e.target.value);
		const el = e.target;
		el.style.height = "auto";
		el.style.height = Math.min(el.scrollHeight, 100) + "px";
	};

	const handleSend = async () => {
		const text = draft.trim();
		if (!text || sending) return;

		const msg: ChatMessage = {
			id: buildMessageId(),
			senderId: currentUserId,
			text,
			createdAt: new Date().toISOString(),
		};

		// Always update UI instantly — no conditions
		setDraft("");
		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
			textareaRef.current.focus();
		}
		onMessageSent(msg);

		// SignalR is best-effort
		if (connection) {
			setSending(true);
			try {
				await connection.invoke("SendMessage", conversationId, currentUserId, text, msg.id);
			} catch (err) {
				console.error("SignalR SendMessage failed:", err);
			} finally {
				setSending(false);
			}
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			handleSend();
		}
	};

	let lastDate = "";

	return (
		<motion.div
			key={participant.id}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.15 }}
			className="flex flex-col flex-1 min-h-0"
		>
			{/* Header */}
			<div
				className="flex items-center gap-3 px-4 h-14 shrink-0 border-b"
				style={{ borderColor: "var(--border)", background: "var(--card)" }}
			>
				<div className="relative">
					<Avatar name={participant.username} size={36} />
					{(participant as any).online && (
						<span
							className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2"
							style={{ background: "var(--success)", borderColor: "var(--card)" }}
						/>
					)}
				</div>
				<div>
					<p className="text-sm font-medium leading-tight" style={{ color: "var(--text)" }}>
						{participant.username}
					</p>
					<p className="text-[11px] leading-tight" style={{ color: "var(--text-opaque)" }}>
						{(participant as any).online ? (
							<span style={{ color: "var(--success)" }}>Online</span>
						) : (
							"Offline"
						)}
					</p>
				</div>
			</div>

			{/* Messages — only scrollable zone, invisible scrollbar */}
			<div
				className="
				bg-card flex-1 min-h-0 px-4 py-4 flex flex-col gap-2 overflow-y-auto 
				[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
			>
				{messages.length === 0 && (
					<p className="text-center text-xs text-opaque mt-6">
						No messages yet. Say hello!
					</p>
				)}

				{messages.map(msg => {
					const isMe = msg.senderId === currentUserId;
					const dateLabel = fmtDate(msg.createdAt);
					const showDivider = dateLabel !== lastDate;
					lastDate = dateLabel;

					return (
						<div key={msg.id}>
							{showDivider && (
								<p
									className="text-center text-[11px] my-2 tracking-wide"
									style={{ color: "var(--text-opaque)" }}
								>
									{dateLabel}
								</p>
							)}
							<Bubble msg={msg} isMe={isMe} senderName={participant.username} />
						</div>
					);
				})}

				<div ref={bottomRef} />
			</div>

			{/* Input bar */}
			<div
				className="shrink-0 flex items-end gap-2.5 px-3 py-2.5 border-t"
				style={{ borderColor: "var(--border)", background: "var(--card)" }}
			>
				<textarea
					ref={textareaRef}
					value={draft}
					onChange={handleInput}
					onKeyDown={handleKeyDown}
					placeholder="Write a message… (Enter to send, Shift+Enter for new line)"
					rows={1}
					className="flex-1 resize-none min-h-9 max-h-25 rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed outline-none transition-colors duration-150 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
					style={{
						overflowY: "auto",
						background: "var(--background)",
						color: "var(--text)",
						border: "1px solid var(--border)",
						fontFamily: "inherit",
					}}
					onFocus={e => (e.target.style.borderColor = "var(--primary)")}
					onBlur={e => (e.target.style.borderColor = "var(--border)")}
				/>
				<button
					onClick={handleSend}
					disabled={!draft.trim() || sending}
					className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 self-end transition-opacity cursor-pointer disabled:opacity-30 hover:opacity-85"
					style={{ background: "var(--button)", color: "#fff" }}
				>
					<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="22" y1="2" x2="11" y2="13" />
						<polygon points="22 2 15 22 11 13 2 9 22 2" />
					</svg>
				</button>
			</div>
		</motion.div>
	);
}