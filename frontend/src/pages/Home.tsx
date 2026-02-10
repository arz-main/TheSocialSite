import Card from "../components/ui/Card"
import { Link } from "react-router-dom"
import Paths from "../routes/paths";
import MockCards from "../_mock/mockCards"

const Home = () => {
	return (
		<>
			<section className="mx-screen w-full flex flex-col items-center gap-3 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-5xl mb-4">Master Your Art Through</h1>
					<h1 className="text-primary text-5xl mb-4">Daily Practice</h1>
				</div>
				<h1 className="text-text-opaque text-center text-lg">
					SketchFlow helps you develop your drawing skills with timed reference practice, progress tracking, and a supportive community of artists
				</h1>
				<div className="flex gap-4 pt-4">
					<Link
						to={Paths.practice}
						className="text-text inline-block bg-button hover:bg-primary border rounded-lg py-2.5 px-8"
					>
						Start Practicing
					</Link>
					<Link
						to={Paths.home}
						className="text-text inline-block bg-button hover:bg-primary border rounded-lg py-2.5 px-8"
					>
						Explore Gallery
					</Link>
				</div>
			</section>
			<section className="mx-screen w-full flex flex-col items-center gap-3 pb-20 p-6 bg-background">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-4xl mb-4">Everything You Need to Improve</h1>
					<h1 className="text-text-opaque text-gray-600 mb-4">Comprehensive tools designed for artists at every level</h1>
				</div>
				<div className="grid gap-6 w-full max-w-6xl sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
					{/* Itereaza prin mock data si pune carduri pe pagina */}
					{MockCards.map(card => <Card key={card.id} {...card} />)}
				</div>
			</section>
			<section className="mx-screen bg-primary w-full flex flex-col items-center gap-3 pt-8 pb-16">
				<div className="text-center flex flex-col items-center pt-10">
					<h1 className="text-text text-4xl mb-6">Ready to Level Up Your Art?</h1>
					<h1 className="text-text text-xl mb-4">Join thousands of artists improving their skills every day</h1>
				</div>
				<Link
					to={Paths.practice}
					className="text-text hover:bg-primary bg-button border-2 rounded-lg py-2.5 px-8"
				>
					Begin Your Journey
				</Link>
			</section>
		</>
	);
};

export default Home;