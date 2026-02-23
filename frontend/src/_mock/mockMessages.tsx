import type { Conversation } from "../types/messageTypes";
export const mockConversations: Conversation[] = [
	{
		id: "conv_1",
		username: "sketchmaster99",
		lastMessage: "That perspective drawing you shared is 🔥",
		lastMessageAt: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
		unreadCount: 2,
		isOnline: true,
		messages: [
			{ id: "m1", senderId: "sketchmaster99", text: "Hey! Love your latest piece!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() },
			{ id: "m2", senderId: "me", text: "Thank you so much! Still practicing perspective.", createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString() },
			{ id: "m3", senderId: "sketchmaster99", text: "You're doing amazing. What references do you use?", createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
			{ id: "m4", senderId: "sketchmaster99", text: "That perspective drawing you shared is 🔥", createdAt: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
		],
	},
	{
		id: "conv_2",
		username: "inkandpaper",
		lastMessage: "Can you share the brush settings you used?",
		lastMessageAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
		unreadCount: 0,
		isOnline: true,
		messages: [
			{ id: "m5", senderId: "inkandpaper", text: "Your linework is so clean!", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
			{ id: "m6", senderId: "me", text: "Thanks! I use a hard round brush mostly.", createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
			{ id: "m7", senderId: "inkandpaper", text: "Can you share the brush settings you used?", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
		],
	},
	{
		id: "conv_3",
		username: "portraiture.flow",
		lastMessage: "Let's do a collab sometime!",
		lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
		unreadCount: 1,
		isOnline: false,
		messages: [
			{ id: "m8", senderId: "me", text: "I loved your portrait series!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
			{ id: "m9", senderId: "portraiture.flow", text: "Thank you! I studied from reference photos for weeks.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5.5).toISOString() },
			{ id: "m10", senderId: "portraiture.flow", text: "Let's do a collab sometime!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString() },
		],
	},
	{
		id: "conv_4",
		username: "daily.doodles",
		lastMessage: "I posted a new one, check it out!",
		lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
		unreadCount: 0,
		isOnline: false,
		messages: [
			{ id: "m11", senderId: "daily.doodles", text: "Do you draw every day?", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString() },
			{ id: "m12", senderId: "me", text: "Trying to! It's tough some days.", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24.5).toISOString() },
			{ id: "m13", senderId: "daily.doodles", text: "I posted a new one, check it out!", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
		],
	},
	{
		id: "conv_5",
		username: "charcoal.dreams",
		lastMessage: "The shading on that piece was incredible",
		lastMessageAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
		unreadCount: 0,
		isOnline: true,
		messages: [
			{ id: "m14", senderId: "charcoal.dreams", text: "The shading on that piece was incredible", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
		],
	},
];
