import Card from "../components/ui/Card"
import DefaultLogo from "../assets/world_logo.svg"
import { Link } from "react-router-dom"

const Home = () => {
	return (
		<>
			<section className="mx-screen w-full flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-[#fdf5e2] to-[#f7ecd9]">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-black text-5xl mb-4">Master Your Art Through</h1>
					<h1 className="text-red-700 text-5xl mb-4">Daily Practice</h1>
				</div>
				<h1 className="text-black text-center text-lg text-gray-600">
					SketchFlow helps you develop your drawing skills with timed reference practice, progress tracking, and a supportive community of artists.
				</h1>
				<div className="flex gap-4 pt-4">
					<Link
						to="/practice"
						className="inline-block bg-[#F9F6EE] hover:bg-[#C24A48] hover:text-white border rounded-lg py-2.5 px-8"
					>
						Start Practicing
					</Link>
					<Link
						to="/"
						className="inline-block bg-[#F9F6EE] hover:bg-[#C24A48] hover:text-white border rounded-lg py-2.5 px-8"
					>
						Explore Gallery
					</Link>
				</div>
			</section>
			<section className="mx-screen w-full flex flex-col items-center gap-3 pb-20 p-6 bg-gradient-to-br from-[#fdf5e2] to-[#f7ecd9]">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-black text-4xl mb-4">Everything You Need to Improve</h1>
					<h1 className="text-black text-gray-600 mb-4">Comprehensive tools designed for artists at every level</h1>
				</div>
				<div className="grid gap-6 w-full max-w-6xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					<Card img={DefaultLogo} title="Practice with References" description="Access a vast library of reference images across multiple categories to improve your skills." />
					<Card img={DefaultLogo} title="Timed Sessions" description="Set custom time intervals to challenge yourself and build drawing speed and accuracy." />
					<Card img={DefaultLogo} title="Track Progress" description="Monitor your daily drawings, streaks, and improvement over time with detailed statistics." />
					<Card img={DefaultLogo} title="Earn Badges" description="Unlock achievements and badges as you reach milestones in your artistic journey." />
					<Card img={DefaultLogo} title="Community" description="Share your work and get inspired by drawings from artists around the world." />
				</div>
			</section>
			<section className="mx-screen bg-[#C24A48] w-full flex flex-col items-center gap-3 pt-10 pb-25">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-white text-4xl mb-6">Ready to Level Up Your Art?</h1>
					<h1 className="text-white text-xl mb-4">Join thousands of artists improving their skills every day</h1>
				</div>
				<Link to="/practice" className="hover:bg-[#C24A48] bg-[#F9F6EE] hover:text-white border rounded-lg py-2.5 px-8">
					Begin Your Journey
				</Link>
			</section>
		</>
	);
};

export default Home;