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

	const showSidebar: boolean = !isMobile || selectedConversation === null;
	const showChat: boolean = !isMobile || selectedConversation !== null;

	return (
		<section className="flex flex-col flex-1 w-full bg-background text-foreground">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex-1 flex flex-col p-6" // Use flex-1 to fill vertical space
			>
				<Card className="overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] lg:grid-cols-[380px_1fr] h-full">

					{/* Sidebar */}
					{showSidebar && (
						<div className="border-r border-border grid grid-rows-[auto_1fr] min-h-0">

							{/* Search */}
							<div className="p-4 border-b border-border">
								<div className="relative">
									<span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-opaque">
										<Search className="w-4 h-4" />
									</span>
									<input
										type="text"
										value={searchQuery}
										onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
										placeholder="Search conversations..."
										className="w-full bg-card text-text placeholder:text-text-opaque rounded-full pl-9 pr-4 py-2 text-sm outline-none border border-border focus:border-primary transition-colors"
									/>
								</div>
							</div>

							{/* Conversations */}
							<div className="overflow-y-auto p-2 min-h-0">
								{filteredConversations.length === 0 ? (
									<p className="text-center text-muted text-sm mt-4">
										No conversations found
									</p>
								) : (
									filteredConversations.map((conv: Conversation, i: number) => (
										<ConversationItem
											key={conv.id}
											conversation={conv}
											index={i}
											isSelected={selectedConversation?.id === conv.id}
											onClick={() => setSelectedConversation(conv)}
										/>
									))
								)}
							</div>
						</div>
					)}

					{/* Chat */}
					{showChat && (
						<div className="min-h-0 flex-1 bg-card"> {/* Changed from bg-background to bg-card */}
							<AnimatePresence mode="wait">
								{selectedConversation !== null ? (
									<ChatView
										conversation={selectedConversation}
										onBack={() => setSelectedConversation(null)}
										isMobile={isMobile}
									/>
								) : (
									<EmptyState key="empty" />
								)}
							</AnimatePresence>
						</div>
					)}
				</Card>
			</motion.div>
		</section>
	);
}