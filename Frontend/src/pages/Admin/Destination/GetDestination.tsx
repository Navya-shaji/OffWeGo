import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchAllDestinations,
  updateDestination,
  deleteDestination,
  searchDestination,
} from "@/services/Destination/destinationService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { Edit, Trash } from "lucide-react";
import { EditDestinationModal } from "./destinationModal";
import Pagination from "@/components/pagination/pagination";
import { SearchBar } from "@/components/Modular/searchbar";
import { ConfirmModal } from "@/components/Modular/ConfirmModal";

export const DestinationTable = () => {
  const [destinations, setDestinations] = useState<DestinationInterface[]>([]);
  const [originalDestinations, setOriginalDestinations] = useState<
    DestinationInterface[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] =
    useState<DestinationInterface | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Prevent multiple API calls
  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch destinations function
  const fetchData = useCallback(async (pageNum: number = 1) => {
    // Prevent multiple simultaneous calls
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError("");

      const data = await fetchAllDestinations(pageNum, 5);
      const { destinations: fetchedDestinations, totalDestinations: total } =
        data;

      if (Array.isArray(fetchedDestinations)) {
        setDestinations(fetchedDestinations);
        setOriginalDestinations(fetchedDestinations);
        setTotalPages(Math.ceil((total || 0) / 5));
        setTotalDestinations(total || 0);
        setPage(pageNum);
      } else {
        console.error(
          "Expected destinations to be an array:",
          fetchedDestinations
        );
        setDestinations([]);
        setOriginalDestinations([]);
      }
    } catch (err: any) {
      console.error("Failed to fetch destinations:", err);
      setError("Failed to fetch destinations.");
      setDestinations([]);
      setOriginalDestinations([]);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Debounced search function
  const handleSearch = useCallback(
    async (query: string) => {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setSearchQuery(query);

      // Debounce search
      searchTimeoutRef.current = setTimeout(async () => {
        if (!query.trim()) {
          // Return to original data
          setIsSearchMode(false);
          setDestinations(originalDestinations);
          setTotalPages(Math.ceil(totalDestinations / 5));
          setPage(1);
          return;
        }

        setIsSearchMode(true);
        setError(""); // Clear any previous errors

        try {
          const response = await searchDestination(query);
          const searchResults = Array.isArray(response) ? response : [];

          setDestinations(searchResults);
          setTotalPages(Math.ceil(searchResults.length / 5));
          setPage(1);
        } catch (error: any) {
          console.error("Error during search:", error);

          // Handle authentication/authorization errors
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            setError("Session expired. Please refresh the page and try again.");
          } else if (
            error.message?.includes("Network Error") ||
            error.code === "ECONNABORTED"
          ) {
            setError(
              "Network error. Please check your connection and try again."
            );
          } else {
            setError("Search failed. Please try again.");
          }

          setDestinations([]);
          setTotalPages(1);
        }
      }, 500); // Increased debounce time to reduce API calls
    },
    [originalDestinations, totalDestinations]
  );

  // Handle page change
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage === page) return; // Prevent unnecessary calls

      setPage(newPage);

      if (!isSearchMode) {
        // Only fetch from server in normal mode
        fetchData(newPage);
      }
      // In search mode, we handle pagination with data slicing below
    },
    [page, isSearchMode, fetchData]
  );

  // Initial fetch - only once
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchData(1);
    }

    // Cleanup
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array - only run once!

  // Get current page data for display
  const getCurrentPageData = () => {
    if (!isSearchMode) {
      return destinations; // Server handles pagination
    } else {
      // Client-side pagination for search
      const startIndex = (page - 1) * 5;
      const endIndex = startIndex + 5;
      return destinations.slice(startIndex, endIndex);
    }
  };

  const handleEdit = useCallback((dest: DestinationInterface) => {
    setSelectedDestination(dest);
    setIsEditModalOpen(true);
  }, []);

  const confirmDelete = useCallback((id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;

    try {
      await deleteDestination(deleteId);

      // Update local state instead of refetching
      const updatedDestinations = destinations.filter(
        (dest) => dest.id !== deleteId
      );
      const updatedOriginalDestinations = originalDestinations.filter(
        (dest) => dest.id !== deleteId
      );

      setDestinations(updatedDestinations);
      if (!isSearchMode) {
        setOriginalDestinations(updatedOriginalDestinations);
        setTotalDestinations((prev) => prev - 1);
        setTotalPages(Math.ceil((totalDestinations - 1) / 5));
      } else {
        setTotalPages(Math.ceil(updatedDestinations.length / 5));
      }
    } catch (error: any) {
      console.error("Failed to delete destination:", error);
      setError("Failed to delete destination. Please try again.");

      // Clear error after 3 seconds
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  }, [
    deleteId,
    destinations,
    originalDestinations,
    isSearchMode,
    totalDestinations,
  ]);

  const handleUpdate = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedDestination?.id) {
        console.warn("Missing selectedDestination or ID");
        return;
      }

      try {
        await updateDestination(selectedDestination.id, selectedDestination);

        // Update local state instead of refetching
        const updateDestinationInList = (list: DestinationInterface[]) =>
          list.map((dest) =>
            dest.id === selectedDestination.id ? selectedDestination : dest
          );

        setDestinations(updateDestinationInList);
        if (!isSearchMode) {
          setOriginalDestinations(updateDestinationInList);
        }

        setIsEditModalOpen(false);
      } catch (err: any) {
        console.error("Update failed:", err);
        setError("Failed to update destination. Please try again.");

        // Clear error after 3 seconds
        setTimeout(() => setError(""), 3000);
      }
    },
    [selectedDestination, isSearchMode]
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading destinations...</span>
        </div>
      </div>
    );
  }
  console.log(destinations, "dhj");

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            All Destinations
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isSearchMode
              ? `Found ${destinations.length} destination${
                  destinations.length !== 1 ? "s" : ""
                } for "${searchQuery}"`
              : `${totalDestinations} total destinations`}
          </p>
        </div>

        <div className="w-60">
          <SearchBar
            placeholder="Search destinations..."
            onSearch={handleSearch}
            value={searchQuery}
          />
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y ">
              {Array.isArray(destinations) &&
              getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((dest) => (
                  <tr
                    key={dest.id}
                    className="hover:bg-white transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center bg-gray-100">
                        {Array.isArray(dest.imageUrls) &&
                        dest.imageUrls.length > 0 ? (
                          (() => {
                            // Extract URL from the stored <img> HTML string
                            const imageUrl =
                              dest.imageUrls[0].match(/src="(.+?)"/)?.[1];
                            return (
                              <img
                                src={imageUrl || "/images/default-image.png"}
                                alt={dest.name}
                                className="h-full w-full object-cover rounded-lg"
                              />
                            );
                          })()
                        ) : (
                          <img
                            src="/images/default-image.png" // placeholder
                            alt="No Image"
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {dest.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {dest.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-500 max-w-xs truncate"
                        title={dest.description}
                      >
                        {dest.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(dest)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit destination"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDelete(dest.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete destination"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <div className="text-gray-400 text-6xl mb-4">🗺️</div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      No destinations found
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery
                        ? `No destinations match your search for "${searchQuery}"`
                        : "No destinations are available at the moment"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            total={totalPages}
            current={page}
            setPage={handlePageChange}
          />
        </div>
      )}

      {/* Stats */}
      {destinations.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          {isSearchMode
            ? `Showing ${Math.min(
                (page - 1) * 5 + 1,
                destinations.length
              )}-${Math.min(page * 5, destinations.length)} of ${
                destinations.length
              } search results`
            : `Showing ${(page - 1) * 5 + 1}-${Math.min(
                page * 5,
                totalDestinations
              )} of ${totalDestinations} destinations`}
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedDestination && (
        <EditDestinationModal
          destination={selectedDestination}
          onClose={() => setIsEditModalOpen(false)}
          onChange={(updated) => setSelectedDestination(updated)}
          onSubmit={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Destination"
        message="Are you sure you want to delete this destination? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        }}
      />
    </div>
  );
};
