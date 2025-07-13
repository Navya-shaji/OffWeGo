import type { VendorListProps } from "@/interface/vendorList";
import React from "react";

const VendorList: React.FC<VendorListProps> = ({
  title,
  vendors = [],
  bgColor = "bg-white",
  showActions = false,
  onAction,
}) => {
  return (
    <div className="mt-10 px-4 md:px-8">
      <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-6">
        {title}
      </h2>

      {vendors.length === 0 ? (
        <p className="text-gray-500 italic">No vendors found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor._id}
              className={`rounded-xl p-5 shadow-md border ${bgColor} transition hover:shadow-lg`}
            >
              <div className="space-y-2">
                <p className="text-lg font-medium text-black">
                  <strong>Name:</strong> {vendor.name}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Email:</strong> {vendor.email}
                </p>
                {vendor.phone && (
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {vendor.phone}
                  </p>
                )}
                {vendor.status && (
                  <p className="text-sm">
                    <strong>Status:</strong>{" "}
                    <span
                      className={`px-2 py-0.5 rounded text-white text-xs ${
                        vendor.status === "approved"
                          ? "bg-green-600"
                          : vendor.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {vendor.status}
                    </span>
                  </p>
                )}
              </div>

              {showActions && vendor.status === "pending" && onAction && (
                <div className="mt-4 flex gap-3">
                  <button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1.5 rounded-md text-sm transition"
                    onClick={() => onAction(vendor._id, "approved")}
                  >
                    ✅ Accept
                  </button>
                  <button
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 rounded-md text-sm transition"
                    onClick={() => onAction(vendor._id, "rejected")}
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorList;
