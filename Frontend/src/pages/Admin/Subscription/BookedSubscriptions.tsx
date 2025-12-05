import { useEffect, useState } from "react";
import ReusableTable from "@/components/Modular/Table";
import { getAllSubscriptionBookings } from "@/services/subscription/subscriptionservice";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionBookingPayload } from "@/services/Payment/stripecheckoutservice";
import type { ColumnDef } from "@tanstack/react-table";

export default function BookedSubscriptions() {
  const [bookings, setBookings] = useState<SubscriptionBookingPayload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllSubscriptionBookings();
        setBookings(res.data || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const columns: ColumnDef<SubscriptionBookingPayload>[] = [
    {
      header: "Vendor ID",
      accessorKey: "vendorId",
      cell: ({ row }) => <span className="font-medium">{row.original.vendorId}</span>,
    },
    {
      header: "Plan Name",
      accessorKey: "planName",
    },
    {
      header: "Amount",
      accessorKey: "amount",
      cell: ({ row }) => `₹${row.original.amount}`,
    },
    {
      header: "Duration",
      accessorKey: "duration",
      cell: ({ row }) => `${row.original.duration} days`,
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;

        const style =
          status === "active"
            ? "bg-green-500"
            : status === "pending"
            ? "bg-yellow-500"
            : status === "expired"
            ? "bg-red-500"
            : "bg-gray-500";

        return <Badge className={`${style} text-white`}>{status}</Badge>;
      },
    },
    {
      header: "Created At",
      accessorKey: "createdAt",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📄 Subscription Bookings</h1>

      <ReusableTable data={bookings} columns={columns} loading={loading} />
    </div>
  );
}
