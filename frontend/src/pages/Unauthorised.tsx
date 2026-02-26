export default function Unauthorized() {
	return (
		<div className="flex flex-col flex-1 bg-background text-primary">
			<h1 className="text-6xl">401</h1>
			<p>
				You are not authorized to access this page.
			</p>
		</div>
	);
}