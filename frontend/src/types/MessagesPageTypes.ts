import type { User } from "./UserTypes";
import type { HubConnection } from "@microsoft/signalr";

export interface ChatMessage {
	id: string;
	senderId: string;
	text: string;
	createdAt: string;
}

export interface Conversation {
	conversationId: string;
	participant: User;
	messages: ChatMessage[];
	lastMessage?: string;
	lastMessageAt?: string;
	unreadCount?: number;
}

export interface ConversationItemProps {
	conversation: Conversation;
	index: number;
	isSelected: boolean;
	onClick: () => void;
}

export interface ChatViewProps {
    connection: HubConnection | null;
    currentUserId: string;
    conversation: Conversation;
    onMessageSent: (message: ChatMessage) => void; // NEW
}