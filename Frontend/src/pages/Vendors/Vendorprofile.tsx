import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import { useState } from "react";
import EditVendorProfileModal from "./EditProfile";

export const Profile = () => {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
 

  const [isEditOpen, setEditOpen] = useState(false);

  if (!vendor) return null

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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {vendor?.profile_img ? (
                <img
                  src={vendor.profile_img}
                  alt="User Avatar"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl flex items-center justify-center h-full text-white font-bold">
                  {vendor?.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}{" "}
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {vendor?.name || ""}
              </h2>
              <p className="text-sm text-gray-500">{vendor?.email||""}</p>
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
              <a
                href={vendor.documentUrl}
                className="text-sm text-blue-600 hover:text-blue-700 underline transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Document
              </a>
            </div>
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
