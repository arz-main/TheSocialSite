import { AlertCircle } from "lucide-react";

// ─── ConfirmModal ─────────────────────────────────────
export function ConfirmModal({
    message,
    onConfirm,
    onCancel,
}: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6">
                    <div className="flex items-start gap-3 mb-5">
                        <div className="w-8 h-8 rounded-full bg-danger/10 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertCircle className="w-4 h-4 text-danger" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-text mb-0.5">Confirm Action</p>
                            <p className="text-sm text-muted">{message}</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-1.5 text-sm rounded-lg border border-border bg-background text-text hover:bg-border/50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-1.5 text-sm rounded-lg bg-primary text-text-opposite hover:bg-primary-hover transition-colors font-medium"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
