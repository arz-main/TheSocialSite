// ─── Stat Card ────────────────────────────────────────
export function StatCard({ label, value, accent }: { label: string; value: number | string; accent: string }) {
    return (
        <div className="bg-card border border-border rounded-xl px-5 py-4 flex flex-col gap-1 min-w-32.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted">{label}</span>
            <span className={`text-2xl font-bold ${accent}`}>{value}</span>
        </div>
    );
}