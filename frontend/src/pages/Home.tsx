const Home = () => {
	return (
		<div className="max-w-3xl mx-auto p-6">
			<h1 className="text-3xl font-bold mb-4">Welcome to the Home Page</h1>
			<p className="text-gray-700 mb-6">
				This is a simple Home page example. Scroll down to see how the layout works with the fixed navbar and footer.
			</p>
			<div className="h-[800px] bg-gray-100 flex items-center justify-center text-gray-400">
				Scrollable Content
			</div>
		</div>
	);
};

export default Home;