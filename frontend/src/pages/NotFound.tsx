export default function NotFound() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background text-primary">
      <div className="text-center">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="mt-2">
          Page is not found. Please, check the URL and try again.
        </p>
      </div>
    </div>
  );
}