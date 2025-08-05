import { useEffect, useState } from "react";
import ReusableTable from "../Modular/Table";
import { getAllVendors,  updateVendorBlockStatus } from "@/services/admin/adminVendorService";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vendor } from "@/interface/vendorInterface";
import Pagination from "../pagination/pagination";

export const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
    const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllVendors(page,10);
        setVendors(result.vendors);
        setTotalPages(Math.ceil(result.totalvendors / 10));

      } catch (error) {
        console.error("Error fetching vendors:", error);
        
      }
    };

    fetchData();
  }, [page]);

  const handleBlockToggle = async (vendorId: string, currentStatus: boolean) => {
    try {
      const updated = await updateVendorBlockStatus(vendorId, !currentStatus);
      console.log(updated)
      setVendors((prev) =>
        prev.map((v) => (v._id === vendorId ? { ...v, isBlocked: !currentStatus } : v))
      );
    } catch (err) {
      console.error("Failed to update vendor status", err);
    }
  };

  const columns: ColumnDef<Vendor>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => row.index + 1,
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const color =
          status === "approved"
            ? "text-green-600"
            : status === "rejected"
            ? "text-red-500"
            : "text-yellow-500";
        return <span className={color}>{status}</span>;
      },
    },
    {
      header: "Blocked Status",
      cell: ({ row }) => {
        const blocked = row.original.isBlocked;
        return (
          <span className={blocked ? "text-red-500" : "text-green-600"}>
            {blocked ? "Blocked" : "Unblocked"}
          </span>
        );
      },
    },
    {
      header: "Document",
      cell: ({ row }) => {
        const url = row.original.documentUrl;
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            View
          </a>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt ?? "");
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!row.original.isBlocked}
            onChange={() =>
              handleBlockToggle(row.original._id, row.original.isBlocked)
            }
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all duration-300" />
          <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300" />
        </label>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Vendors</h1>
      <ReusableTable<Vendor> data={vendors} columns={columns} />
         <Pagination total={totalPages} current={page} setPage={setPage} />
    </div>
  );
};

