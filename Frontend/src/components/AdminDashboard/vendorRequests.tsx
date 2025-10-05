import { useEffect, useState } from "react";
import {
  getVendorsByStatus,
  updateVendorStatus,
} from "@/services/admin/adminService";
import toast from "react-hot-toast";
import type { Vendor } from "@/interface/vendorInterface";

interface Props {
  filter: "pending" | "approved" | "rejected";
  onTabChange?: (tab: string) => void;
}

const VendorRequests: React.FC<Props> = ({ filter, onTabChange }) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null); // For modal

  const fetchVendors = () => {
    setLoading(true);
    getVendorsByStatus(filter)
      .then((data) => setVendors(data))
      .catch(() => toast.error("Failed to fetch vendors"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVendors();
  }, [filter]);

  const handleStatusChange = async (
    vendorId: string,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      await updateVendorStatus(vendorId, newStatus);
      toast.success(`Vendor ${newStatus}`);
      if (newStatus === "approved" && onTabChange) {
        onTabChange("Approved Requests");
      } else {
        setVendors((prev) => prev.filter((ven) => ven.id !== vendorId));
      }
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
        {filter} Vendors
      </h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span className="ml-2 text-gray-600 text-lg">Loading...</span>
        </div>
      ) : vendors.length === 0 ? (
        <p className="text-gray-500 text-lg italic text-center">
          No {filter} vendors found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-white rounded-lg p-6 shadow-lg border border-gray-200 transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              <div className="space-y-3 text-gray-700">
                <p className="text-lg">
                  <span className="font-semibold">Name:</span> {vendor.name}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Email:</span> {vendor.email}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Phone:</span> {vendor.phone}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`capitalize font-semibold ${
                      vendor.status === "approved"
                        ? "text-green-600"
                        : vendor.status === "rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {vendor.status}
                  </span>
                </p>
                <p className="text-lg">
                  {vendor.documentUrl && (
                    <button
                      onClick={() => setSelectedDocument(vendor.documentUrl)}
                      className="bg-black text-white px-2 py-2 rounded-lg font-semibold shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300"
                    >
                      View Document
                    </button>
                  )}
                </p>
              </div>

              {filter === "pending" && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleStatusChange(vendor.id, "approved")}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(vendor.id, "rejected")}
                    className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

     
      {selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl overflow-hidden shadow-xl max-w-3xl w-full relative">
            <button
              onClick={() => setSelectedDocument(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ✕
            </button>
            <div className="p-4">
              <img
                src={selectedDocument}
                alt="Vendor Document"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorRequests;
