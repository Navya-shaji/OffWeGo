import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { useState } from "react";
import EditVendorProfileModal from "./EditProfile";
import { Edit2 } from "lucide-react";

export const Profile = () => {
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  if (!vendor) return null;

  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-sm">
        {/* Header Section with Edit Button */}
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage your vendor profile information</p>
          </div>
          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
          <EditVendorProfileModal
            isOpen={isEditOpen}
            onClose={() => setEditOpen(false)}
          />
        </div>

        <div className="px-6 py-6">
          {/* Profile Header */}
          <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-200">
            <div
              className="w-20 h-20 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0 cursor-pointer hover:ring-4 hover:ring-gray-100 transition-all duration-300 relative group"
              onClick={() => setIsPreviewOpen(true)}
            >
              {vendor?.profileImage ? (
                <img
                  src={vendor.profileImage}
                  alt="Vendor Avatar"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <span className="text-2xl text-white font-bold">
                  {vendor?.name?.[0]?.toUpperCase() || "V"}
                </span>
              )}
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {vendor?.name || "Vendor"}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{vendor?.email || ""}</p>
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full">
                Vendor
              </span>
            </div>
          </div>

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Full Name
              </label>
              <p className="text-base font-semibold text-gray-900">{vendor?.name || "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Email Address
              </label>
              <p className="text-base font-semibold text-gray-900">{vendor?.email || "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Mobile Number
              </label>
              <p className="text-base font-semibold text-gray-900">{vendor?.phone || "N/A"}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Status
              </label>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${vendor?.status === "approved"
                ? "bg-gray-200 text-gray-900"
                : vendor?.status === "pending"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gray-100 text-gray-700"
                }`}>
                {vendor?.status?.toUpperCase() || "N/A"}
              </span>
            </div>
          </div>

          {/* Document Section */}
          {vendor.documentUrl && (
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 block">
                Verification Document
              </label>
              <button
                onClick={() => setSelectedDocument(vendor.documentUrl)}
                className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-800 transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Document
              </button>
            </div>
          )}

          {/* Document Modal */}
          {selectedDocument && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
              <div className="bg-white rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full mx-4 relative">
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="p-6">
                  <img
                    src={selectedDocument}
                    alt="Vendor Document"
                    className="w-full h-auto rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}
          {isPreviewOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
              onClick={() => setIsPreviewOpen(false)}
            >
              <div
                className="relative max-w-sm w-full bg-white rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-md transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="p-2">
                  <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
                    {vendor?.profileImage ? (
                      <img
                        src={vendor.profileImage}
                        alt="Vendor DP Full"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-8xl font-bold text-gray-300">
                        {vendor?.name?.[0]?.toUpperCase() || "V"}
                      </div>
                    )}
                  </div>
                  <div className="py-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900">{vendor?.name}</h3>
                    <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mt-1">Vendor Account</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

