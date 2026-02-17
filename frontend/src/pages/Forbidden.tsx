export default function Forbidden() {
    return (
        <div className = "h-screen flex flex-col items-center justify-center text-primary bg-background">
            <h1 className="text-6xl">403</h1>
            <p>
				Hm, you may have selected the wrong role. Please try again.
			</p>
		</div>
	);
}