export default function InternalServerError() {
    return (
        <div className="flex flex-1 items-center justify-center bg-background text-primary">
            <h1 className="text-6xl">500</h1>
            <p>
				Service error. Please refresh the page.
			</p>
		</div>
	);
}