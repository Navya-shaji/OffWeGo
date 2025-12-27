import { useEffect, useState } from "react";
import ReusableTable from "@/components/Modular/Table";
import { getAllSubscriptionBookings } from "@/services/subscription/subscriptionservice";
import { Badge } from "@/components/ui/badge";
import type { SubscriptionBookingPayload } from "@/services/Payment/stripecheckoutservice";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, Filter, Calendar, Download, RefreshCw } from "lucide-react";

export default function BookedSubscriptions() {
  const [bookings, setBookings] = useState<SubscriptionBookingPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [filteredBookings, setFilteredBookings] = useState<SubscriptionBookingPayload[]>([]);

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

  useEffect(() => {
    let filtered = bookings;
    if (searchQuery) {
      filtered = filtered.filter(
        (booking) =>
          booking.planName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.vendorDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          booking.vendorDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    if (dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter((booking) => {
        if (!booking.startDate) return false;
        const startDate = new Date(booking.startDate);
        switch (dateFilter) {
          case "active": return booking.status === "active" && startDate <= now;
          case "expired": return booking.status === "expired" || (booking.endDate && new Date(booking.endDate) < now);
          case "pending": return booking.status === "pending";
          case "last30":
            const thirtyDaysAgo = new Date(today);
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return startDate >= thirtyDaysAgo;
          case "last90":
            const ninetyDaysAgo = new Date(today);
            ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
            return startDate >= ninetyDaysAgo;
          default: return true;
        }
      });
    }
    setFilteredBookings(filtered);
  }, [bookings, searchQuery, statusFilter, dateFilter]);

  const handleExport = () => {
    const csvContent = [
      ["Vendor Name", "Email", "Plan Name", "Amount", "Duration", "Status", "Start Date", "End Date"],
      ...filteredBookings.map((booking) => [
        booking.vendorDetails?.name || "N/A",
        booking.vendorDetails?.email || "N/A",
        booking.planName || "N/A",
        booking.amount || 0,
        booking.duration || 0,
        booking.status || "N/A",
        booking.startDate ? new Date(booking.startDate).toLocaleDateString() : "N/A",
        booking.endDate ? new Date(booking.endDate).toLocaleDateString() : "N/A",
      ]),
    ].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscription-history-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const columns: ColumnDef<SubscriptionBookingPayload>[] = [
    {
      header: "Vendor Name",
      accessorKey: "vendorDetails",
      cell: ({ row }) => {
        const vendor = row.original.vendorDetails;
        return (
          <div>
            <div className="font-medium">{vendor?.name || 'N/A'}</div>
            <div className="text-sm text-gray-500">{vendor?.email || ''}</div>
          </div>
        );
      },
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
      header: "Start Date",
      accessorKey: "startDate",
      cell: ({ row }) => {
        const date = row.original.startDate;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
    {
      header: "End Date",
      accessorKey: "endDate",
      cell: ({ row }) => {
        const date = row.original.endDate;
        return date ? new Date(date).toLocaleDateString() : 'N/A';
      },
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">📄 Subscription Bookings</h1>

      <ReusableTable data={bookings} columns={columns} loading={loading} />
    </div>
  );
}
