import { Search, X } from "lucide-react";

// ─── SearchBar ────────────────────────────────────────
export function SearchBar({
    value,
    onChange,
    placeholder,
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    return (
        <div className="relative flex items-center">
            <Search className="absolute left-2.5 w-3.5 h-3.5 text-muted pointer-events-none" />
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="bg-background border border-border rounded-lg pl-8 pr-7 py-1.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-primary transition-colors w-52"
            />
            {value && (
                <button
                    onClick={() => onChange("")}
                    className="absolute right-2 text-muted hover:text-text transition-colors"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </div>
    );
}