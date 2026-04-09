import { SearchBar } from "./SearchBar";

export function SectionHeader({ title, count, search, onSearch, placeholder }: {
    title: string;
    count: number;
    search: string;
    onSearch: (v: string) => void;
    placeholder: string;
}) {
    return (
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-border">
            <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-text">{title}</h2>
                <span className="text-[11px] font-semibold bg-border text-muted px-2 py-0.5 rounded-full">
                    {count}
                </span>
            </div>
            <SearchBar value={search} onChange={onSearch} placeholder={placeholder} />
        </div>
    );
}