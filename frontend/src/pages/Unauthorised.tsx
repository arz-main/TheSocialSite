export default function Unauthorized() {
	return (
		<div className="h-screen flex flex-col items-center justify-center text-primary bg-background">
			<h1 className="text-6xl">401</h1>
			<p>
				You are not authorized to access this page.
			</p>
		</div>
	);
}