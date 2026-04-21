export function TableSkeleton({ cols }: { cols: number }) {
    return (
        <>
            {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                    {Array.from({ length: cols }).map((__, j) => (
                        <td key={j} className="px-5 py-3.5">
                            <div
                                className="h-3 rounded-full bg-border animate-pulse"
                                style={{ width: `${55 + ((i * 3 + j * 7) % 35)}%`, opacity: 1 - i * 0.15 }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}