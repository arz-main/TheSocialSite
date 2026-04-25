const paths = {
	home: "/",
	about: "/about",
	login: "/login",
	signup: "/signup",
	terms: "/terms",
	privacy: "/privacy",
	practice: "/practice",
	forgot_password: "/forgot-password",
	badge_templates: "/badge-templates",
	explore: {
		page: "/explore",
		user: "/explore/user/:userId", // for the app.tsx route
		toUser: (userId: number | string) => `/explore/user/${userId}`,
	},
	roadmap: {
		page: "/roadmap",
		course: "/roadmap/course/:courseId", // for the app.tsx route
		lesson: "/roadmap/course/:courseId/lesson/:lessonId", // for the app.tsx route
		toCourse: (courseId: number | string) => `/roadmap/course/${courseId}`,
		toLesson: (courseId: number | string, lessonId: number | string) => `/roadmap/course/${courseId}/lesson/${lessonId}`,
	},
	artist: {
		profile: "/artist/profile",
		edit_profile: "/artist/edit-profile",
		statistics: "/artist/statistics",
		messages: "/artist/messages",
	},
	admin: {
		dashboard: "/admin",
		manage_users: "/admin/manage-users",
		manage_comments: "/admin/manage-comments",
		manage_posts: "/admin/manage-posts",
		reset_password: "/admin/reset-password",
		user_requests: "/admin/user-requests",
		course_creator: "/admin/course-creator",
		course_drafts: "/admin/course-drafts",
		course_creator_edit_route: "/admin/course-creator/edit/:courseId",
		course_creator_edit: (id: number | string) => `/admin/course-creator/edit/${id}`,
	},
	error: {
		unauthorized: "/unauthorized",
		forbidden: "/forbidden",
		not_found: "/not-found",
		internal_server_error: "/internal-server-error",
	},
}

export default paths;