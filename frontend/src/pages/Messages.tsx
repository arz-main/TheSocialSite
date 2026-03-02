import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { ConversationItem, EmptyState, ChatView } from "../components/ui/MessagesPageComponents";
import { Card } from "../components/ui/Card";
import { mockConversations } from "../_mock/mockMessages";
import type { Conversation } from "../types/MessagesPageTypes";

export default function MessagesPage() {
	const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = (): void => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return (): void => window.removeEventListener("resize", handleResize);
	}, []);

	const filteredConversations: Conversation[] = mockConversations.filter((c: Conversation) =>
		c.username.toLowerCase().includes(searchQuery.toLowerCase())
	);

	/** On mobile only one panel is visible at a time — sidebar OR chat. */
	const showSidebar: boolean = !isMobile || selectedConversation === null;
	const showChat: boolean = !isMobile || selectedConversation !== null;

	return (
		<section className="flex flex-col flex-1 w-full p-6 bg-background">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="h-[calc(100vh-6rem)]"
			>
				{/* Two-column grid: fixed-width sidebar | flexible chat area */}
				<Card className="bg-card overflow-hidden h-[calc(100%-5rem)] grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr]">

					{/* Sidebar: search input + scrollable conversation list */}
					{showSidebar && (
						<div className="border-r border-muted grid grid-rows-[auto_1fr] min-h-0">
							<div className="p-4 border-b border-muted">
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text/40">
										<Search className="w-4 h-4" />
									</span>
									<input
										type="text"
										value={searchQuery}
										onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
										placeholder="Search conversations..."
										className="w-full bg-muted text-text placeholder:text-text/40 rounded-full pl-9 pr-4 py-2 text-sm outline-none border border-transparent focus:border-primary/40 transition-colors"
									/>
								</div>
							</div>

							<div className="overflow-y-auto p-2">
								{filteredConversations.length === 0
									? <p className="text-center text-text/40 text-sm mt-6">No conversations found</p>
									: filteredConversations.map((conv: Conversation, i: number) => (
										<ConversationItem
											key={conv.id}
											conversation={conv}
											index={i}
											isSelected={selectedConversation?.id === conv.id}
											onClick={() => setSelectedConversation(conv)}
										/>
									))
								}
							</div>
						</div>
					)}

					{/* Chat panel: active thread or empty placeholder */}
					{showChat && (
						<div className="min-h-0 grid grid-rows-[1fr]">
							<AnimatePresence mode="wait">
								{selectedConversation !== null
									? (
										<ChatView
											key={selectedConversation.id}
											conversation={selectedConversation}
											onBack={() => setSelectedConversation(null)}
											isMobile={isMobile}
										/>
									)
									: <EmptyState key="empty" />
								}
							</AnimatePresence>
						</div>
					)}
				</Card>
			</motion.div>
		</section>
	);
}