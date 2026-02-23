import Paths from "../routes/paths";

type AdminCard = {
	id: number;
	title: string;
	description: string;
	actionPath: string;
};

export const adminCards: AdminCard[] = [
	{
		id: 1,
		title: "Delete Posts",
		description: "Remove inappropriate or unwanted posts from the platform.",
		actionPath: Paths.admin.manage_posts,
	},
	{
		id: 2,
		title: "Suspend Users",
		description: "Temporarily suspend users violating rules.",
		actionPath: Paths.admin.manage_users,
	},
	{
		id: 3,
		title: "Delete Comments",
		description: "Delete offensive or spam comments.",
		actionPath: Paths.admin.manage_comments,
	},
	{
		id: 4,
		title: "Reset User Password",
		description: "Reset a user's password upon request.",
		actionPath: Paths.admin.reset_password,
	},
	{
		id: 5,
		title: "View User Requests",
		description: "View and respond to user requests.",
		actionPath: Paths.admin.user_requests,
	},
];