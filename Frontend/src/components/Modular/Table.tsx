import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";

type ReusableTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
};

const ReusableTable = <T extends object>({
  data,
  columns,
  loading = false,
}: ReusableTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return (
      <div className="w-full">
        <div className="rounded-xl border border-border bg-card shadow-elevated overflow-hidden">
          <div className="h-14 bg-table-header">
            <Skeleton className="h-full w-full" />
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="border-t border-table-border">
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-elevated">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="bg-table-header border-b border-table-border">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-6 py-4 text-left text-sm font-semibold text-table-header-foreground tracking-wide"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-muted-foreground text-sm"
                >
                  No data available
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`
                    border-b border-table-border last:border-0
                    transition-colors duration-200
                    hover:bg-table-row-hover
                    ${idx % 2 === 0 ? "bg-table-row-even" : "bg-table-row-odd"}
                  `}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-card-foreground"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReusableTable;
