export default function Forbidden() {
    return (
        <div className="flex h-full items-center justify-center bg-background text-primary">
			<div className="text-center">
				<h1 className="text-6xl font-bold">403</h1>
				<p className="mt-4 text-lg">
					Hm, you may have selected the wrong role. Please try again.
				</p>
			</div>
		</div>
    );
}
