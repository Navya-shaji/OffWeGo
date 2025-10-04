import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

type ReusableTableProps<T extends object> = {
  data: T[];
  columns: ColumnDef<T>[];
   loading?: boolean;
};

const ReusableTable = <T extends object>({
  data,
  columns,
}: ReusableTableProps<T>) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-md">
        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 border-b border-gray-200 text-left"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="text-sm text-gray-800">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="even:bg-gray-50 hover:bg-gray-100 transition duration-150 ease-in-out"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="px-6 py-4 border-b border-gray-200"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReusableTable;
