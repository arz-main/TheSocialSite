/** Discriminates between the current user and any remote participant.
 *  "me" always refers to the locally authenticated user.
 *  Any other string is the sending participant's username or id. */
type MessageSenderId = "me" | string;

/** A single chat bubble within a conversation thread. */
interface ChatMessage {
	/** Unique identifier for this message (e.g. UUID or `m_${timestamp}`). */
	id: string;
	/** Who authored the message. "me" = current user; anything else = the other participant. */
	senderId: MessageSenderId;
	/** Plain-text content of the message. */
	text: string;
	/** ISO 8601 timestamp of when the message was created. */
	createdAt: string;
}

/** A one-to-one conversation between the current user and one other participant. */
interface Conversation {
	/** Unique identifier for this conversation thread. */
	id: string;
	/** Display name of the other participant. */
	username: string;
	/** Preview snippet of the most recent message — shown in the sidebar list. */
	lastMessage: string;
	/** ISO 8601 timestamp of the most recent message in this thread. */
	lastMessageAt: string;
	/** Count of messages the current user has not yet seen. 0 = fully read. */
	unreadCount: number;
	/** Whether the other participant has an active session right now. */
	isOnline: boolean;
	/** All messages in this thread, ordered oldest → newest. */
	messages: ChatMessage[];
}

/** Props for a single row in the conversation sidebar list. */
interface ConversationItemProps {
	conversation: Conversation;
	/** Zero-based position in the rendered list, used to stagger entry animations. */
	index: number;
	/** Whether this row represents the currently open conversation. */
	isSelected: boolean;
	/** Called when the user clicks or taps this row. */
	onClick: () => void;
}

/** Props for the main message thread panel. */
interface ChatViewProps {
	/** The conversation whose messages are being displayed. */
	conversation: Conversation;
	/** Called when the user taps the back arrow (mobile only). */
	onBack: () => void;
	/** True when the viewport width is below the two-column breakpoint (< 768 px). */
	isMobile: boolean;
}

export type { ChatMessage, ChatViewProps, MessageSenderId, Conversation, ConversationItemProps };