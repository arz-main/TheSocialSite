const Terms = () => {
	return (
		<div className="flex flex-col flex-1">
			<section className="mx-screen w-full flex flex-col items-center gap-3 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-5xl mb-4">Terms of Service</h1>
				</div>
				<p className="text-text-opaque text-center text-lg max-w-2xl">
					These terms govern the use of the SketchFlow platform. By using the service,
					you agree to comply with the following rules and guidelines.
				</p>
			</section>

			<section className="mx-screen w-full flex flex-col items-center p-6 pb-20 bg-background">
				<div className="w-full max-w-4xl flex flex-col gap-12 pt-10">

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Use of the Platform</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							SketchFlow is intended to provide a positive environment for artists
							to practice drawing, share their work, and interact with other members
							of the creative community.
						</p>
						<p className="text-text-opaque text-lg leading-relaxed">
							Users agree to use the platform responsibly and refrain from posting
							content that is illegal, harmful, abusive, or violates the rights of
							others.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">User Accounts</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							To access certain features, users may need to create an account.
							You are responsible for maintaining the confidentiality of your
							account credentials and for all activities that occur under your
							account.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Content Ownership</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							Users retain ownership of the artwork and content they upload.
							However, by posting content on SketchFlow, you grant the platform
							permission to display and share that content within the community.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Changes to the Terms</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							These terms may be updated periodically to reflect improvements
							or changes to the platform. Continued use of the service after
							updates indicates acceptance of the revised terms.
						</p>
					</div>

				</div>
			</section>
		</div>
	);
};

export default Terms;