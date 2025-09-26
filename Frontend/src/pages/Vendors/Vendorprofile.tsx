import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import { useState } from "react";
import EditVendorProfileModal from "./EditProfile";

export const Profile = () => {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);

  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null); // For modal
  console.log(vendor);
  if (!vendor) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              {vendor?.profileImage ? (
                <img
                  src={vendor.profileImage}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-white font-bold">
                  {vendor?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {vendor?.name || ""}
              </h2>
              <p className="text-sm text-gray-500">{vendor?.email || ""}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">Name</span>
              <span className="text-sm text-gray-900">{vendor?.name}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">
                Email account
              </span>
              <span className="text-sm text-gray-900">{vendor?.email}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">
                Mobile number
              </span>
              <span className="text-sm text-gray-900">{vendor.phone}</span>
            </div>

            <div className="flex justify-between items-center py-3">
              <span className="text-sm font-medium text-gray-600">
                Document
              </span>
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

          <div className="mt-8">
            <button
              onClick={() => setEditOpen(true)}
              className="flex-1 bg-gradient-to-r text-white px-6 py-3 rounded-xl font-semibold bg-black transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Edit Profile
            </button>
            <EditVendorProfileModal
              isOpen={isEditOpen}
              onClose={() => setEditOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
