export default function InternalServerError() {
    return (
        <div className="flex h-full items-center justify-center bg-background text-primary">
			<div className="text-center">
				<h1 className="text-6xl font-bold">401</h1>
				<p className="mt-4 text-lg">
					Service error. Please refresh the page.
			</p>
			</div>
		</div>
	);
}
