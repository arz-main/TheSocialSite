import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

// ── StatPill ──────────────────────────────────────────────────────────────────
export function StatPill({ icon, label, value, total, accent }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    total: number;
    accent: string;
}) {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
        <div className="flex flex-col gap-1.5 px-4 py-3 rounded-xl bg-card border border-border min-w-[100px]">
            <div className="flex items-center gap-1.5">
                <span className={accent}>{icon}</span>
                <span className="text-xs text-muted font-medium">{label}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`text-2xl font-black ${accent}`}>{value}</span>
                <span className="text-xs text-muted">/ {total}</span>
            </div>
            <div className="w-full bg-border rounded-full h-1 overflow-hidden">
                <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'var(--primary)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                />
            </div>
        </div>
    );
}

// ── FilterSelect ──────────────────────────────────────────────────────────────
export function FilterSelect<T extends string>({ value, onChange, options, label }: {
    value: T;
    onChange: (v: T) => void;
    options: T[];
    label: string;
}) {
    const [open, setOpen] = useState(false);
    const isActive = value !== options[0];
    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border
                    ${isActive
                        ? 'bg-primary text-white border-primary shadow-sm shadow-primary/25'
                        : 'bg-card text-muted border-border hover:border-primary/40 hover:text-text'
                    }`}
            >
                {isActive ? value : label}
                <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.1 }}
                            className="absolute left-0 top-full mt-1.5 z-20 min-w-[150px] bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                        >
                            {options.map((o, i) => (
                                <button
                                    key={o}
                                    onClick={() => { onChange(o); setOpen(false); }}
                                    className={`w-full text-left px-4 py-2 text-xs transition-colors
                                        ${value === o ? 'bg-primary/10 text-primary font-semibold' : 'text-text hover:bg-primary/5'}
                                        ${i !== 0 ? 'border-t border-border/50' : ''}`}
                                >
                                    {i === 0 ? `All ${label}s` : o}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
