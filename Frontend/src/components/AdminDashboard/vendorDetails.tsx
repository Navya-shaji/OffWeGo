import React, { useEffect, useState } from "react";
import {
  getAllVendors,
  updateVendorBlockStatus,  // renamed to match boolean field
} from "@/services/admin/adminVendorService";
import type { Vendor } from "@/interface/vendorInterface";

const VendorList: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const vendorData = await getAllVendors();
        setVendors(vendorData);
      } catch (err) {
        console.error("Error fetching vendors:", err);
        setError("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  const handleBlockToggle = async (
    vendorId: string,
    currentIsBlocked: boolean
  ) => {
    try {
      const updatedIsBlocked = !currentIsBlocked;
      await updateVendorBlockStatus(vendorId, updatedIsBlocked); // pass boolean

      setVendors((prevVendors) =>
        prevVendors.map((vendor) =>
          vendor._id === vendorId
            ? { ...vendor, isBlocked: updatedIsBlocked }
            : vendor
        )
      );
    } catch (err) {
      console.error("Failed to update block status", err);
    }
  };

  if (loading) {
    return <p className="p-4 text-gray-600 italic">Loading vendors...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-600 font-medium">{error}</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Vendors</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2"></th>
              <th className="border px-4 py-2">Name</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Phone</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Blocked Status</th>
              <th className="border px-4 py-2">Document</th>
              <th className="border px-4 py-2">Created At</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor, idx) => (
              <tr key={vendor._id} className="text-center hover:bg-gray-50">
                <td className="border px-4 py-2">{idx + 1}</td>
                <td className="border px-4 py-2">{vendor.name}</td>
                <td className="border px-4 py-2">{vendor.email}</td>
                <td className="border px-4 py-2">{vendor.phone ?? "N/A"}</td>
                <td className="border px-4 py-2">
                  <span className="text-green-600 font-semibold">{vendor.status}</span>
                </td>
                <td className="border px-4 py-2">
                  {vendor.isBlocked ? (
                    <span className="text-red-500 font-semibold">Blocked</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Unblocked</span>
                  )}
                </td>
                <td className="border px-4 py-2">
                  <a
                    href={vendor.documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>
                <td className="border px-4 py-2">
                  {vendor.createdAt
                    ? new Date(vendor.createdAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!vendor.isBlocked}
                      onChange={() =>
                        handleBlockToggle(vendor._id, vendor.isBlocked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-14 h-8 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 rounded-full peer peer-checked:bg-green-500 transition-all duration-300"></div>
                    <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300"></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorList;
