export default function Forbidden() {
    return (
        <div className="flex flex-1 items-center justify-center bg-background text-primary">
            <h1 className="text-6xl">403</h1>
            <p>
                Hm, you may have selected the wrong role. Please try again.
            </p>
        </div>
    );
}