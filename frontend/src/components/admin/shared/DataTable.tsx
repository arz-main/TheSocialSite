type DataTableProps = {
    headers: string[];
    children: React.ReactNode;
};

export function DataTable({ headers, children }: DataTableProps) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-primary text-white">
                        {headers.map((h) => (
                            <th
                                key={h}
                                className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest border-b border-border"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>{children}</tbody>
            </table>
        </div>
    );
}
