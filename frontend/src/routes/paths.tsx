const Paths = {
	home: "/",
	about: "/about",
	explore: "/explore",
	practice: "/practice",
	login: "/login",
	signup: "/signup",
	forgot_password: "/forgot_password",
	terms: "/terms",
	privacy: "/privacy",
	error: {
		unauthorized: "/unauthorized",
		forbidden: "/forbidden",
		not_found: "/not_found",
		internal_server_error: "/internal_server_error",
	},
	
	admin: {
		dashboard: "/admin",
		manage_users: "/admin/manage_users",
		manage_comments: "/admin/manage_comments",
		manage_posts: "/admin/manage_posts",
		reset_password: "/admin/reset_password",
		user_requests: "/admin/user_requests",
	},

	artist: {
		profile: "/artist/profile",
		edit_profile: "/artist/edit_profile",
		statistics: "/artist/statistics",
		messages: "/artist/messages",
	},
}

export default Paths