const Privacy = () => {
	return (
		<div className="flex flex-col flex-1">
			<section className="mx-screen w-full flex flex-col items-center gap-3 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-5xl mb-4">Privacy Policy</h1>
				</div>
				<p className="text-text-opaque text-center text-lg max-w-2xl">
					This policy explains how SketchFlow collects, uses, and protects user
					information while using the platform.
				</p>
			</section>

			<section className="mx-screen w-full flex flex-col items-center p-6 pb-20 bg-background">
				<div className="w-full max-w-4xl flex flex-col gap-12 pt-10">

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Information We Collect</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							We may collect basic information such as your username, email
							address, and profile details when you create an account on the
							platform.
						</p>
						<p className="text-text-opaque text-lg leading-relaxed">
							Additional data may include activity on the platform, such as
							uploaded artwork, interactions with other users, and participation
							in drawing exercises.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">How Information Is Used</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							The information collected is used to operate the platform,
							improve features, personalize user experience, and maintain
							the security of the community.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Data Protection</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							We take reasonable technical and organizational measures to
							protect user information from unauthorized access, misuse,
							or disclosure.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Policy Updates</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							This privacy policy may be updated occasionally to reflect
							improvements or regulatory changes. Updates will be posted on
							this page.
						</p>
					</div>

				</div>
			</section>
		</div>
	);
};

export default Privacy;