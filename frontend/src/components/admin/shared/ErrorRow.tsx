import { AlertCircle } from "lucide-react";

// ─── ErrorRow ─────────────────────────────────────────
export function ErrorRow({ cols, message }: { cols: number; message: string }) {
    return (
        <tr>
            <td colSpan={cols} className="py-10">
                <div className="flex flex-col items-center gap-2 text-danger">
                    <AlertCircle className="w-5 h-5 opacity-70" />
                    <span className="text-sm">{message}</span>
                </div>
            </td>
        </tr>
    );
}