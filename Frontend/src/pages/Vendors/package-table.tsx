import { useState } from "react";
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


type PackageTableProps = {
  packages: Package[];
};

const PackagesTable: React.FC<PackageTableProps> = () => {
  const [packages,setPackages]=useState<Package[]>([])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);

  const handleEditClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setIsEditModalOpen(true);
  };

const handleSearch = async (query: string) => {
  if (!query.trim()) {
    const allPackages = await fetchAllPackages();
    setPackages(allPackages?.packages ?? []); // default to empty array
    return;
  }
  try {
    const response = await searchPackages(query);
    setPackages(response ?? []); // default to empty array
  } catch (error) {
    console.error(error);
    setPackages([]);
  }
};
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage?._id) return;

    try {
      await editPackage(selectedPackage._id, selectedPackage);
      toast.success("Package updated successfully!");
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package ? ")) return;
    try {
      await deletePackage(id);
      toast.success("Package deleted successfully!");
    } catch {
      toast.error("Failed to delete package");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Travel Packages
          </h2>
           <div className="w-60">
                <SearchBar placeholder="Search packages..." onSearch={handleSearch} />
              </div>
          <span className="bg-white/10 px-3 py-1 rounded-full text-sm text-white">
            {packages.length} packages
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Package Details
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Price
              </th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Hotels
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                Activities
              </th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {packages.map((pkg, index) => (
              <tr
                key={pkg._id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50/30"}
              >
                {/* Package Details */}
                <td className="px-6 py-4 align-top">
                  <h3 className="font-semibold text-gray-900">
                    {pkg.packageName}
                  </h3>
                  <p className="text-sm text-gray-600">{pkg.description}</p>
                </td>

                {/* Price */}
                <td className="px-6 py-4 text-right text-emerald-600 font-bold">
                  {formatCurrency(pkg.price)}
                </td>

                {/* Duration */}
                <td className="px-6 py-4 text-right text-gray-600">
                  <div className="flex justify-end items-center">
                    <Clock className="w-4 h-4 mr-1" /> {pkg.duration} days
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-700">
                  {pkg.hotels?.[0]?.name || (
                    <i className="text-gray-400">No hotels</i>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {pkg.activities?.[0]?.title || (
                    <i className="text-gray-400">No activities</i>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEditClick(pkg)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditModalOpen && selectedPackage && (
        <EditPackageModal
          pkg={selectedPackage}
          onClose={() => setIsEditModalOpen(false)}
          onChange={(updated) => setSelectedPackage(updated)}
          onSubmit={handleUpdate}
        />
      )}
    </div>
  );
};

export default PackagesTable;
