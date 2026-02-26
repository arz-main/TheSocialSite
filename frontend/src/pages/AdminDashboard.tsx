import React from "react";
import { motion } from "motion/react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/BasicButton";
import { useNavigate } from "react-router";
import { adminCards } from "../_mock/mockAdminDashboardCards";

const AdminDashboard: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col flex-1 items-center justify-start bg-background text-text py-12 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-6xl"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-semibold mb-2">Admin Dashboard</h1>
					<p className="text-text-opaque">Manage all platform activities from here</p>
				</div>

				<div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{adminCards.map((card) => (
						<Card key={card.id} className="p-6 flex flex-col justify-between">
							<div className="mb-4">
								<h2 className="text-xl font-medium mb-2">{card.title}</h2>
								<p className="text-text-opaque text-sm">{card.description}</p>
							</div>
							<motion.div
								whileTap={{ scale: 0.98 }}
								transition={{ type: "spring", stiffness: 400, damping: 17 }}
							>
								<Button
									onClick={() => navigate(card.actionPath)}
									className="w-full"
								>
									Go
								</Button>
							</motion.div>
						</Card>
					))}
				</div>
			</motion.div>
		</div>
	);
};

export default AdminDashboard;