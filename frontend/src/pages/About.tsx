const About = () => {
	return (
		<>
			<section className="mx-screen w-full flex flex-col items-center gap-3 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-5xl mb-4">About</h1>
					<h1 className="text-primary text-5xl mb-4">SketchFlow</h1>
				</div>
				<p className="text-text-opaque text-center text-lg max-w-2xl">
					A social and drawing training platform for artists, built with React, Tailwind and Typescript. An integrated digital environment that combines social networking with dedicated tools for creative skill development.
				</p>
			</section>

			<section className="mx-screen w-full flex flex-col items-center p-6 pb-20 bg-background">
				<div className="w-full max-w-4xl flex flex-col gap-12 pt-10">

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">Why SketchFlow?</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							This project was born out of a desire to improve the experience artists have when growing and perfecting their drawing skills. By creating a space dedicated exclusively to the artistic community, the platform aims to offer a structured and motivating environment for the continuous development of visual and creative abilities.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">The Problem We Solve</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							There is a clear lack of platforms dedicated to artistic development through fast, systematic training. Although many general social networks exist, the artist community has no specialized tool that combines professional socializing with structured training exercises and individual progress tracking in a coherent and efficient way.
						</p>
						<p className="text-text-opaque text-lg leading-relaxed">
							Existing platforms either focus exclusively on showcasing finished work, or offer rigid courses — without emphasizing interaction between users and the organic development of skills through daily practice.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<h2 className="text-text text-3xl">What the Platform Offers</h2>
						<p className="text-text-opaque text-lg leading-relaxed">
							SketchFlow gives artists, illustrators, painters, and other creators the ability to interact with people from the same field by sharing their own creations, sending text messages, and appreciating content posted by other users.
						</p>
						<p className="text-text-opaque text-lg leading-relaxed">
							The platform also provides an efficient way for each user to self-evaluate their progress by viewing statistical diagrams, earning digital badges upon reaching certain goals, and comparing results with other artists in the community.
						</p>
						<p className="text-text-opaque text-lg leading-relaxed">
							Through quick drawing exercises, drawing challenges, and feedback from the community, users are encouraged to practice consistently and improve their technique in an interactive way.
						</p>
					</div>

				</div>
			</section>
		</>
	);
};

export default About;