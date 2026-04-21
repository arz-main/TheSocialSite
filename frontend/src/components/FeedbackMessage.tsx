interface FeedbackMessageProps {
    error?: string | null;
    success?: string | null;
}

function FeedbackMessage({ error, success }: FeedbackMessageProps) {
    if (!error && !success) return null;

    if (error) {
        return (
            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                {error}
            </div>
        );
    }

    return (
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm">
            {success}
        </div>
    );
}

export { FeedbackMessage };