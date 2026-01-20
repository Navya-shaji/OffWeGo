import { useEffect, useState, useCallback, useRef } from "react";
import ReusableTable from "../Modular/Table";
import {
  getAllVendors,
  searchVendor,
  updateVendorBlockStatus,
} from "@/services/admin/adminVendorService";
import type { ColumnDef } from "@tanstack/react-table";
import type { Vendor } from "@/interface/vendorInterface";
import { SearchBar } from "../Modular/searchbar";

export const VendorList = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [originalVendors, setOriginalVendors] = useState<Vendor[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [totalVendors, setTotalVendors] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<{
    id: string;
    isBlocked: boolean;
    name: string;
  } | null>(null);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchVendors = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError("");

      const response = await getAllVendors(pageNum, 10);
      const newVendors = response.vendors || [];

      if (append) {
        setVendors((prev) => [...prev, ...newVendors]);
        setOriginalVendors((prev) => [...prev, ...newVendors]);
      } else {
        setVendors(newVendors);
        setOriginalVendors(newVendors);
      }

      setTotalVendors(response.totalvendors);
      setPage(pageNum);
      setHasMore(newVendors.length === 10);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setError("Failed to fetch vendors.");
      if (!append) setVendors([]);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  const loadMoreVendors = useCallback(() => {
    if (!isSearchMode && hasMore && !isLoadingRef.current) {
      fetchVendors(page + 1, true);
    }
  }, [page, hasMore, isSearchMode, fetchVendors]);

  const handleSearch = useCallback(
    async (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setSearchQuery(query);

      searchTimeoutRef.current = setTimeout(async () => {
        if (!query.trim()) {
          setIsSearchMode(false);
          setVendors(originalVendors);
          setPage(1);
          setHasMore(originalVendors.length >= 10);
          return;
        }

        setIsSearchMode(true);
        try {
          const response = await searchVendor(query);
          const searchResults = Array.isArray(response) ? response : [];

          setVendors(searchResults);
          setPage(1);
          setHasMore(false); // Disable load more in search mode for now or implement backend search pagination
        } catch (error) {
          console.error("Error during search:", error);
          setVendors([]);
          setPage(1);
        }
      }, 300);
    },
    [originalVendors]
  );


  const handleConfirmBlock = async () => {
    if (!selectedVendor) return;
    await handleBlockToggle(selectedVendor.id, selectedVendor.isBlocked);
    setModalOpen(false);
    setSelectedVendor(null);
  };

  const handleCancelBlock = () => {
    setModalOpen(false);
    setSelectedVendor(null);
  };

  const handleBlockToggle = useCallback(
    async (vendorId: string, currentStatus: boolean) => {
      const previousVendors = [...vendors];
      const previousOriginalVendors = [...originalVendors];

      const updateVendor = (vendorList: Vendor[]) =>
        vendorList.map((vendor) =>
          vendor._id === vendorId
            ? { ...vendor, isBlocked: !currentStatus }
            : vendor
        );

      setVendors(updateVendor);
      if (!isSearchMode) {
        setOriginalVendors(updateVendor);
      }

      try {
        await updateVendorBlockStatus(vendorId, !currentStatus);
      } catch (err) {
        console.error("Failed to update vendor status", err);
        setVendors(previousVendors);
        setOriginalVendors(previousOriginalVendors);
        setError("Failed to update vendor status. Please try again.");
        setTimeout(() => setError(""), 3000);
      }
    },
    [vendors, originalVendors, isSearchMode]
  );

  const openBlockModal = (
    vendorId: string,
    isBlocked: boolean,
    vendorName: string
  ) => {
    setSelectedVendor({ id: vendorId, isBlocked, name: vendorName });
    setModalOpen(true);
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchVendors(1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnDef<Vendor>[] = [
    {
      id: "index",
      header: "#",
      cell: ({ row }) => {
        const baseIndex = (page - 1) * 10;
        return baseIndex + row.index + 1;
      },
    },
    {
      id: "image",
      header: () => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6 text-gray-600"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
        </svg>
      ),
      cell: ({ row }) => {
        const imageUrl = row.original.profileImage;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt={row.original.name}
            className="w-10 h-10 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-user.png";
            }}
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-gray-400 rounded-full bg-gray-100 p-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4 20c0-4 3.5-7 8-7s8 3 8 7" />
          </svg>
        );
      },
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const colorClass =
          status === "approved"
            ? "bg-green-100 text-green-800"
            : status === "rejected"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800";

        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}
          >
            {status}
          </span>
        );
      },
    },
    {
      header: "Blocked Status",
      cell: ({ row }) => {
        const blocked = row.original.isBlocked;
        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${blocked
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
              }`}
          >
            {blocked ? "Blocked" : "Unblocked"}
          </span>
        );
      },
    },
    {
      header: "Document",
      cell: ({ row }) => {
        const url = row.original.documentUrl;
        return url ? (
          <img
            src={url}
            alt="Vendor Document"
            className="w-16 h-16 object-cover rounded border"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-document.png";
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center">
            <span className="text-gray-400 text-xs">No Doc</span>
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt ?? "");
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString();
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={!row.original.isBlocked}
            onChange={() =>
              openBlockModal(
                row.original._id as string,
                row.original.isBlocked,
                row.original.name
              )
            }
            className="sr-only peer"
          />
          <div className="w-14 h-8 bg-gray-300 peer-checked:bg-green-500 rounded-full transition-all duration-300 peer-focus:ring-2 peer-focus:ring-green-300" />
          <span className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300" />
        </label>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading vendors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all scale-100 animate-in">
            <div className="flex items-start mb-4">
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${selectedVendor?.isBlocked ? "bg-green-100" : "bg-red-100"
                  }`}
              >
                <span className="text-2xl">
                  {selectedVendor?.isBlocked ? "✓" : "⚠"}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedVendor?.isBlocked
                    ? "Unblock Vendor"
                    : "Block Vendor"}
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Are you sure you want to{" "}
                  {selectedVendor?.isBlocked ? "unblock" : "block"}{" "}
                  <span className="font-medium">{selectedVendor?.name}</span>?
                </p>
                {!selectedVendor?.isBlocked && (
                  <p className="mt-2 text-sm text-gray-500">
                    This vendor will not be able to access their account.
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelBlock}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBlock}
                className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${selectedVendor?.isBlocked
                  ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                  : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  }`}
              >
                {selectedVendor?.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Vendors</h1>
          <p className="text-sm text-gray-600 mt-1">
            {isSearchMode
              ? `Found ${vendors.length} vendor${vendors.length !== 1 ? "s" : ""
              } for "${searchQuery}"`
              : `${totalVendors} total vendors`}
          </p>
        </div>

        <div className="w-60">
          <SearchBar placeholder="Search Vendors..." onSearch={handleSearch} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-900"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {vendors.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300 text-6xl">
            🏪
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No vendors found
          </h3>
          <p className="text-gray-500">
            {searchQuery
              ? `No vendors match your search for "${searchQuery}"`
              : "No vendors are available at the moment"}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReusableTable<Vendor>
              data={vendors}
              columns={columns}
              loading={false}
            />
          </div>

          {/* Load More Button */}
          {!isSearchMode && hasMore && vendors.length > 0 && !loading && (
            <div className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50/30">
              <button
                onClick={loadMoreVendors}
                disabled={loadingMore}
                className={`group relative px-10 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${loadingMore ? "opacity-80 cursor-not-allowed" : ""
                  }`}
              >
                {loadingMore ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                    <span>Fetching Vendors...</span>
                  </>
                ) : (
                  <>
                    <span>Load More Vendors</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

          {/* End of list message */}
          {!hasMore && vendors.length > 0 && !isSearchMode && (
            <div className="p-8 text-center text-sm text-gray-500 bg-gray-50/30 border-t border-gray-100 italic">
              You've reached the end of the vendor list
            </div>
          )}

          {/* Results Info */}
          <div className="text-center text-sm text-gray-400 py-4">
            {isSearchMode
              ? `Showing all ${vendors.length} search results`
              : `Showing ${vendors.length} of ${totalVendors} total vendors`}
          </div>
        </>
      )}
    </div>
  );
};
