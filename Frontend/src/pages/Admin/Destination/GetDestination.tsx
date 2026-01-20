/* eslint-disable react-hooks/exhaustive-deps */
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
  const [totalDestinations, setTotalDestinations] = useState(0);
  const [displayedDestinations, setDisplayedDestinations] = useState<DestinationInterface[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (pageNum: number = 1) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError("");

      const data = await fetchAllDestinations(pageNum, 5);
      const { destinations: fetchedDestinations, totalDestinations: total } =
        data;

      if (Array.isArray(fetchedDestinations)) {
        if (pageNum === 1) {
          setDestinations(fetchedDestinations);
          setDisplayedDestinations(fetchedDestinations);
          setOriginalDestinations(fetchedDestinations);
        } else {
          setDestinations(prev => [...prev, ...fetchedDestinations]);
          setDisplayedDestinations(prev => [...prev, ...fetchedDestinations]);
          setOriginalDestinations(prev => [...prev, ...fetchedDestinations]);
        }
        setTotalDestinations(total || 0);
        setPage(pageNum);
        setHasMore(fetchedDestinations.length === 5 && (pageNum * 5) < (total || 0));
      } else {
        console.error(
          "Expected destinations to be an array:",
          fetchedDestinations
        );
        setDestinations([]);
        setOriginalDestinations([]);
      }
    } catch (err) {
      console.error("Failed to fetch destinations:", err);
      setError("Failed to fetch destinations.");
      setDestinations([]);
      setOriginalDestinations([]);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setSearchQuery(query);

      searchTimeoutRef.current = setTimeout(async () => {
        if (!query.trim()) {
          setIsSearchMode(false);
          setDestinations(originalDestinations);
          setDisplayedDestinations(originalDestinations);
          setPage(1);
          return;
        }

        setIsSearchMode(true);
        setError("");

        try {
          const response = await searchDestination(query);
          const searchResults = Array.isArray(response) ? response : [];

          setDestinations(searchResults);
          setPage(1);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));

          console.error("Error during search:", error);

          const errWithResponse = err as {
            response?: { status: number };
            code?: string;
          };

          if (
            errWithResponse.response?.status === 401 ||
            errWithResponse.response?.status === 403
          ) {
            setError("Session expired. Please refresh the page and try again.");
          } else if (
            error.message.includes("Network Error") ||
            errWithResponse.code === "ECONNABORTED"
          ) {
            setError(
              "Network error. Please check your connection and try again."
            );
          } else {
            setError(error.message || "Search failed. Please try again.");
          }

          setDestinations([]);
        }
      }, 500);
    },
    [originalDestinations, totalDestinations]
  );

  const loadMoreDestinations = useCallback(() => {
    if (!isSearchMode && hasMore && !isLoadingRef.current) {
      fetchData(page + 1);
    }
  }, [page, hasMore, isSearchMode, fetchData]);


  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchData(1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getCurrentPageData = () => {
    if (!isSearchMode) {
      return displayedDestinations;
    } else {
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

      const updatedDestinations = destinations.filter(
        (dest) => dest.id !== deleteId
      );
      const updatedOriginalDestinations = originalDestinations.filter(
        (dest) => dest.id !== deleteId
      );
      const updatedDisplayedDestinations = displayedDestinations.filter(
        (dest) => dest.id !== deleteId
      );

      setDestinations(updatedDestinations);
      if (!isSearchMode) {
        setOriginalDestinations(updatedOriginalDestinations);
        setDisplayedDestinations(updatedDisplayedDestinations);
        setTotalDestinations((prev) => prev - 1);
      } else {
        setDisplayedDestinations(updatedDisplayedDestinations);
      }
    } catch (error) {
      console.error("Failed to delete destination:", error);
      setError("Failed to delete destination. Please try again.");

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

        const updateDestinationInList = (list: DestinationInterface[]) =>
          list.map((dest) =>
            dest.id === selectedDestination.id ? selectedDestination : dest
          );

        setDestinations(updateDestinationInList(destinations));
        setDisplayedDestinations(updateDestinationInList(displayedDestinations));
        if (!isSearchMode) {
          setOriginalDestinations(updateDestinationInList(originalDestinations));
        }

        setIsEditModalOpen(false);
      } catch (err) {
        console.error("Update failed:", err);
        setError("Failed to update destination. Please try again.");

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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All Destinations
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {isSearchMode
                ? `Found ${destinations.length} destination${destinations.length !== 1 ? "s" : ""
                } for "${searchQuery}"`
                : `Showing ${displayedDestinations.length} of ${totalDestinations} destinations`}
            </p>
          </div>

          <div className="w-full sm:w-80">
            <SearchBar
              placeholder="Search destinations..."
              onSearch={handleSearch}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(destinations) &&
                  getCurrentPageData().length > 0 ? (
                  getCurrentPageData().map((dest, idx) => {
                    const destinationId = dest.id ?? dest._id;
                    return (
                      <tr
                        key={destinationId ?? `destination-${idx}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-16 w-16">
                            {Array.isArray(dest.imageUrls) &&
                              dest.imageUrls.length > 0 ? (
                              <img
                                src={dest.imageUrls[0]}
                                alt={dest.name}
                                className="h-16 w-16 object-cover rounded-lg border border-white"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = "none";
                                  target.nextElementSibling?.classList.remove(
                                    "hidden"
                                  );
                                }}
                              />
                            ) : null}
                            <div
                              className={`h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-gray-200 ${Array.isArray(dest.imageUrls) &&
                                dest.imageUrls.length > 0
                                ? "hidden"
                                : ""
                                }`}
                            >
                              No Image
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {dest.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600 font-medium">
                            {dest.location}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div
                            className="text-sm text-gray-600 max-w-xs truncate"
                            title={dest.description}
                          >
                            {dest.description || "No description"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEdit(dest)}
                              className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110 active:scale-95"
                              title="Edit destination"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (destinationId) confirmDelete(destinationId);
                              }}
                              className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110 active:scale-95"
                              title="Delete destination"
                            >
                              <Trash size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
      </div>

      {/* Load More Button */}
      {!isSearchMode && hasMore && displayedDestinations.length > 0 && !loading && (
        <div className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={loadMoreDestinations}
            disabled={isLoadingMore}
            className={`group relative px-10 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${isLoadingMore ? "opacity-80 cursor-not-allowed" : ""
              }`}
          >
            {isLoadingMore ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                <span>Fetching Destinations...</span>
              </>
            ) : (
              <>
                <span>Load More Destinations</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && displayedDestinations.length > 0 && !isSearchMode && (
        <div className="p-8 text-center text-sm text-gray-500 bg-gray-50/30 border-t border-gray-100 italic">
          You've reached the end of the destination list
        </div>
      )}

      {isEditModalOpen && selectedDestination && (
        <EditDestinationModal
          destination={selectedDestination}
          onClose={() => setIsEditModalOpen(false)}
          onChange={(updated) => setSelectedDestination(updated)}
          onSubmit={handleUpdate}
        />
      )}

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
