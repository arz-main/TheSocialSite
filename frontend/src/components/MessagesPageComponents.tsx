import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { HubConnection } from "@microsoft/signalr";
import type { Conversation, ChatMessage } from "../types/MessagesPageTypes";

// ---------------------------------------------------------------------------
// ConversationItem (Sidebar)
// ---------------------------------------------------------------------------

export interface ConversationItemProps {
	conversation: Conversation;
	index: number;
	isSelected: boolean;
	onClick: () => void;
}

export function ConversationItem({ conversation, index, isSelected, onClick }: ConversationItemProps) {
	const { participant, lastMessage } = conversation;
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
			className={`flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-colors duration-100
				${isSelected ? "bg-primary-soft" : "bg-transparent"}
				hover:bg-border
			`}
		>
			<div className="relative shrink-0">
				<Avatar name={participant.username} size={38} />
				{(participant as any).online && (
					<span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-card bg-success" />
				)}
			</div>

			<div className="flex-1 min-w-0">
				<p className={`text-sm font-medium truncate ${isSelected ? "text-primary" : "text-text"}`}>
					{participant.username}
				</p>
				<p className="text-[11px] truncate mt-0.5 text-text-opaque">{preview}</p>
			</div>
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
			<div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary-soft">
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="var(--primary)"
					strokeWidth="1.5"
				>
					<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
				</svg>
			</div>
			<p className="text-sm font-medium text-text">No conversation selected</p>
			<p className="text-xs text-text-opaque">Pick someone from the sidebar to start chatting</p>
		</motion.div>
	);
}

// ---------------------------------------------------------------------------
// Avatar
// ---------------------------------------------------------------------------

export function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function Avatar({ name, size = 36 }: { name: string; size?: number }) {
	const ini = name
		.split(" ")
		.map((w) => w[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
	return (
		<div
			className="rounded-full flex items-center justify-center font-medium shrink-0 bg-secondary-soft text-text"
			style={{
				width: size,
				height: size,
				fontSize: size * 0.33,
			}}
		>
			{ini}
		</div>
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
			className={`flex items-end gap-2 w-full min-w-0 ${isMe ? "flex-row-reverse" : "flex-row"}`}
		>
			{!isMe && <Avatar name={senderName} size={26} />}
			<div className={`flex flex-col min-w-0 max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
				<div
					className="px-4 py-2 text-sm rounded-2xl whitespace-pre-wrap w-full"
					style={{
						backgroundColor: isMe ? "var(--button)" : "var(--border)",
						color: isMe ? "var(--text-opposite)" : "var(--text)",
						wordBreak: "break-word",
						overflowWrap: "break-word",
					}}
				>
					{msg.text}
				</div>
				<span className="text-[10px] mt-1 text-muted">
					{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
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
	const { messages, participant } = conversation;
	const [draft, setDraft] = useState("");
	const [sending, setSending] = useState(false);
	const bottomRef = useRef<HTMLDivElement>(null);
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleSend = async () => {
		const text = draft.trim();
		if (!text || sending) return;

		const msg: ChatMessage = {
			id: `msg_${Date.now()}`,
			senderId: currentUserId,
			text,
			createdAt: new Date().toISOString(),
		};

		setDraft("");
		onMessageSent(msg);

		if (!connection) return;
		setSending(true);
		try {
			await connection.invoke("SendMessageActionExecution", {
				ConversationId: conversation.conversationId,
				User: currentUserId,
				Message: text,
			});
		} catch (err) {
			console.error(err);
		} finally {
			setSending(false);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="flex flex-col flex-1 h-full min-h-0">
			{/* Participant banner */}
			<div className="p-3 border-b border-border flex items-center gap-3 bg-card shrink-0">
				<Avatar name={participant.username} size={40} />
				<p className="font-medium text-text">{participant.username}</p>
			</div>

			{/* Messages area */}
			<div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 min-h-0 bg-card">
				{messages.length === 0 && (
					<p className="text-center text-xs text-muted mt-6">No messages yet. Say hello!</p>
				)}
				{messages.map((msg) => {
					const isMe = msg.senderId === currentUserId;
					return (
						<Bubble
							key={msg.id}
							msg={msg}
							isMe={isMe}
							senderName={isMe ? "You" : participant.username}
						/>
					);
				})}
				<div ref={bottomRef} />
			</div>

			{/* Input bar */}
			<div className="flex items-end gap-2 p-3 border-t border-border bg-card shrink-0">
				<textarea
					ref={textareaRef}
					value={draft}
					onChange={(e) => {
						setDraft(e.target.value);
						const el = e.target;
						el.style.height = "auto";
						el.style.height = Math.min(el.scrollHeight, 100) + "px";
					}}
					onKeyDown={handleKeyDown}
					rows={1}
					placeholder="Write a message…"
					className="flex-1 resize-none rounded-2xl px-3 py-2 text-sm border border-border bg-background text-text placeholder:text-muted outline-none focus:border-primary transition-colors"
					style={{ overflow: "hidden" }}
				/>
				<button
					onClick={handleSend}
					disabled={!draft.trim() || sending}
					className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-button hover:bg-button-hover disabled:opacity-40 transition-colors"
				>
					<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-opposite)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
						<line x1="22" y1="2" x2="11" y2="13" />
						<polygon points="22 2 15 22 11 13 2 9 22 2" />
					</svg>
				</button>
			</div>
		</div>
	);
}