import { useState, useEffect, useMemo, useCallback } from "react";
import type { Package } from "@/interface/PackageInterface";
import { MapPin, Clock, Edit, Trash2 } from "lucide-react";
import {
  editPackage,
  deletePackage,
  fetchAllPackages,
  searchPackages,
} from "../../services/packages/packageService";
import { toast } from "react-toastify";
import { EditPackageModal } from "./editPackageModal";
import { SearchBar } from "@/components/Modular/searchbar";
import Pagination from "@/components/pagination/pagination";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";

const PackagesTable: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    const allPackages = await fetchAllPackages();
    setPackages(allPackages?.packages ?? []);
  };

  const handleEditClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditModalOpen(true);
  };

const handleSearch = useCallback(
  async (query: string) => {
    if (!query.trim()) {
      return;
    }
    try {
      const response = await searchPackages(query);
      console.log(response,"REfdkjgkhgirhuighiugh")
      setPackages(response ?? []);
    } catch (error) {
      console.error(error);
      setPackages([]);
    }
  },
  [] 
);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage?._id) return;

    try {
      await editPackage(selectedPackage._id, selectedPackage);
      toast.success("Package updated successfully!");
      setIsEditModalOpen(false);
      await loadPackages();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package ?")) return;
    try {
      await deletePackage(id);
      toast.success("Package deleted successfully!");
      await loadPackages();
    } catch {
      toast.error("Failed to delete package");
    }
  };

  const columns = useMemo<ColumnDef<Package>[]>(
    () => [
      {
        header: "Package Details",
        cell: ({ row }) => (
          <div>
            <h3 className="font-semibold text-gray-900">
              {row.original.packageName}
            </h3>
            <p className="text-sm text-gray-600">{row.original.description}</p>
          </div>
        ),
      },
      {
        header: "Price",
        cell: ({ row }) => (
          <span className="text-emerald-600 font-bold">
            {formatCurrency(row.original.price)}
          </span>
        ),
      },
      {
        header: "Duration",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" /> {row.original.duration} days
          </div>
        ),
      },
      {
        header: "Hotels",
        cell: ({ row }) => {
          console.log("Hotels for row:", row.original.hotels);
          return row.original.hotels?.length ? (
            <span>{row.original.hotels.map((h) => h.name).join(", ")}</span>
          ) : (
            <i className="text-gray-400">No hotels</i>
          );
        },
      },
      {
        header: "Activities",
        cell: ({ row }) => {
          console.log("Activities for row:", row.original.activities);
          return row.original.activities?.length ? (
            <span>
              {row.original.activities.map((a) => a.title).join(", ")}
            </span>
          ) : (
            <i className="text-gray-400">No activities</i>
          );
        },
      },

      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="p-2 hover:bg-blue-100 rounded-md transition-colors flex gap-2">
            <button
              onClick={() => handleEditClick(row.original)}
              className="text-black hover:text-black"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleDelete(row.original._id)}
              className="text-black hover:text-black"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Travel Packages
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-60">
            <SearchBar
              placeholder="Search packages..."
              onSearch={handleSearch}
            />
          </div>
          <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm">
            {packages.length} packages
          </span>
        </div>
      </div>

      {/* Table */}
      <ReusableTable data={packages} columns={columns} />

      {/* Edit Modal */}
      {isEditModalOpen && selectedPackage && (
        <EditPackageModal
          pkg={selectedPackage}
          onClose={() => setIsEditModalOpen(false)}
          onChange={(updated) => setSelectedPackage(updated)}
          onSubmit={handleUpdate}
        />
      )}

      <div className="mt-4 flex justify-center">
        <Pagination total={totalPages} current={page} setPage={setPage} />
      </div>
    </div>
  );
};

export default PackagesTable;
