const Paths = {
	home: "/",
	about: "/about",
	explore: "/explore",
	practice: "/practice",
    roadmap: "/roadmap",
	login: "/login",
	signup: "/signup",
	forgot_password: "/forgot-password",
	reset_password: "/reset-password",
	terms: "/terms",
	privacy: "/privacy",

	error: {
		unauthorized: "/unauthorized",
		forbidden: "/forbidden",
		not_found: "/not-found",
		internal_server_error: "/internal-server-error",
	},

	admin: {
		dashboard: "/admin",
		manage_users: "/admin/manage-users",
		manage_comments: "/admin/manage-comments",
		manage_posts: "/admin/manage-posts",
		reset_password: "/admin/reset-password",
		user_requests: "/admin/user-requests",
		course_creator: "/admin/course-creator",
	},

	artist: {
		profile: "/artist/profile",
		edit_profile: "/artist/edit-profile",
		statistics: "/artist/statistics",
		messages: "/artist/messages",
	},

	course: (id: number | string) => `/roadmap/course/${id}`,
}

export default Paths