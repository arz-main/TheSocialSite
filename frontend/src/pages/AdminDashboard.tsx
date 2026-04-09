import { useState } from "react";
import { Users, FileText, Award, ChevronLeft } from "lucide-react";
import { UsersSection } from "../components/admin/UsersSection";
import { PostsSection } from "../components/admin/PostsSection";
import { BadgeTemplatesSection } from "../components/admin/BadgeTemplatesSection";
import { CreateBadgeTemplatesSection } from "../components/admin/CreateBadgeTemplatesSection";

type AdminSection = "users" | "posts" | "badgeTemplates" | "createBadgeTemplates" | null;

const SECTIONS = [
	{
		id: "users" as AdminSection,
		label: "Manage Users",
		description: "View, promote, demote and delete users",
		icon: Users,
	},
	{
		id: "posts" as AdminSection,
		label: "Manage Posts",
		description: "View and delete posts across the platform",
		icon: FileText,
	},
	{
		id: "badgeTemplates" as AdminSection,
		label: "Manage Badge Templates",
		description: "Manage badge templates",
		icon: Award,
	},
	{
		id: "createBadgeTemplates" as AdminSection,
		label: "Create Badge Templates",
		description: "Create badge templates",
		icon: Award,
	},
];

export default function AdminDashboard() {
	const [activeSection, setActiveSection] = useState<AdminSection>(null);

	return (
		<div className="h-screen overflow-auto bg-background text-text">
			<div className="max-w-6xl mx-auto px-6 py-8 flex flex-col gap-8">

				{/* Page header */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						{activeSection && (
							<button
								onClick={() => setActiveSection(null)}
								className="p-1.5 rounded hover:bg-border transition-colors text-muted hover:text-text"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
						)}
						<div>
							<p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">Control Panel</p>
							<h1 className="text-2xl font-bold text-text">
								{activeSection
									? SECTIONS.find(s => s.id === activeSection)?.label
									: "Admin Dashboard"
								}
							</h1>
						</div>
					</div>
				</div>

				<div className="h-px bg-border" />

				{/* Section cards */}
				{!activeSection && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{SECTIONS.map(section => {
							const Icon = section.icon;
							return (
								<button
									key={section.id}
									onClick={() => setActiveSection(section.id)}
									className="flex flex-col gap-3 text-left p-5 rounded-xl border border-border bg-card hover:border-primary transition-all"
								>
									<div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
										<Icon className="w-5 h-5 text-primary" />
									</div>
									<div>
										<p className="text-sm font-semibold text-text">{section.label}</p>
										<p className="text-xs text-muted mt-0.5">{section.description}</p>
									</div>
								</button>
							);
						})}
					</div>
				)}

				{/* Active section */}
				{activeSection === "users" && <UsersSection />}
				{activeSection === "posts" && <PostsSection />}
				{activeSection === "badgeTemplates" && <BadgeTemplatesSection />}
				{activeSection === "createBadgeTemplates" && <CreateBadgeTemplatesSection/>}
			</div>
		</div>
	);
}