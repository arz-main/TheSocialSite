export default function InternalServerError() {
    return (
        <div className = "h-screen flex flex-col items-center justify-center text-primary bg-background">
            <h1 className="text-6xl">500</h1>
            <p>
				Service error. Please refresh the page.
			</p>
		</div>
	);
}