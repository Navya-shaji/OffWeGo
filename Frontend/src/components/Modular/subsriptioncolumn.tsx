import type { Subscription } from "@/interface/subscription";
import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react"; 


export const subscriptionColumns = (
  onEdit: (row: Subscription) => void,
  onDelete: (row: Subscription) => void
): ColumnDef<Subscription>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: info => info.getValue(),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: info => `₹${info.getValue()}`,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: info => `${info.getValue()} days`,
  },
  {
    accessorKey: "maxPackages",
    header: "maxPackages",
    cell: info => `${info.getValue()}`,
  },
 
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          onClick={() => onEdit(row.original)}
          className="text-blue-600 hover:underline"
        >
          <Pencil className="w-4 h-4 inline-block" />
        </button>
        <button
          onClick={() => onDelete(row.original)}
          className="text-red-600 hover:underline"
        >
          <Trash2 className="w-4 h-4 inline-block" />
        </button>
      </div>
    ),
  },
];
