import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, MapPin, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  getAllHotel,
  updateHotel,
  deleteHotel,
  searchHotel,
} from "@/services/Hotel/HotelService";

import { SearchBar } from "@/components/Modular/searchbar";
import Pagination from "@/components/pagination/pagination";
import ReusableTable from "@/components/Modular/Table";
import { getCoordinatesFromPlace } from "@/services/Location/locationService";

interface Hotel {
  _id: string;
  name: string;
  address: string;
  rating: number;
  hotelId?: string;
  destinationId?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const HotelsTable: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [originalHotels, setOriginalHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    rating: 0,
    coordinates: {
      lat: undefined as number | undefined,
      lng: undefined as number | undefined,
    },
  });
  const [isGettingCoordinates, setIsGettingCoordinates] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHotels, setTotalHotels] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
const [destinationId, ] = useState<string>("");
  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const loadHotels = useCallback(async (pageNum: number = 1) => {
  if (isLoadingRef.current) return;

  try {
    isLoadingRef.current = true;
    setLoading(true);
    setError("");

    const response = await getAllHotel(pageNum, 5);

    const hotelsWithId = response.hotels.map((hotel) => ({
      ...hotel,
      _id: hotel.hotelId || "",
    }));

    setHotels(hotelsWithId);
    setOriginalHotels(hotelsWithId); // ✅ Preserve original data
    setTotalPages(response.totalPages || 1);
    setTotalHotels(response.totalHotels || hotelsWithId.length);
    setPage(pageNum);
  } catch (err) {
    console.error("Error loading hotels:", err);
    setError("Failed to load hotels. Please try again.");
    setHotels([]);
    toast.error("Failed to load hotels");
  } finally {
    isLoadingRef.current = false;
    setLoading(false);
  }
}, []);


  const handleSearch = useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
        // Return to original data
        setIsSearchMode(false);
        setHotels(originalHotels);
        setTotalPages(Math.ceil(totalHotels / 5));
        setPage(1);
        return;
      }

      setIsSearchMode(true);
      try {
        const response = await searchHotel(query);
        const searchResults = Array.isArray(response) ? response : [];
        
        const hotelsWithId = searchResults.map((hotel) => ({
          ...hotel,
          _id: hotel.hotelId || hotel._id,
        }));
        
        setHotels(hotelsWithId);
        setTotalPages(Math.ceil(hotelsWithId.length / 5));
        setPage(1);
        
      } catch (err) {
        console.error("Search error:", err);
        setError("Search failed. Please try again.");
        setHotels([]);
        setTotalPages(1);
        toast.error("Failed to search hotels");
       
        setTimeout(() => setError(""), 3000);
      }
    }, 400);
  }, [originalHotels, totalHotels]);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === page) return; // Prevent unnecessary calls
    
    setPage(newPage);
    
    if (!isSearchMode) {
      // Only fetch from server in normal mode
      loadHotels(newPage);
    }
    // In search mode, we handle pagination with data slicing below
  }, [page, isSearchMode, loadHotels]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadHotels(1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [loadHotels]); 

  const getCurrentPageData = () => {
    if (!isSearchMode) {
      return hotels; 
    } else {
      const startIndex = (page - 1) * 5;
      const endIndex = startIndex + 5;
      return hotels.slice(startIndex, endIndex);
    }
  };

  const handleEditClick = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      address: hotel.address,
      rating: hotel.rating,
      coordinates: {
        lat: hotel.coordinates?.lat,
        lng: hotel.coordinates?.lng,
      },
    });
    setIsEditModalOpen(true);
  }, []);

  const handleGetCoordinates = async () => {
    const currentAddress = formData.address;
    
    if (!currentAddress || currentAddress.trim().length < 3) {
      toast.error("Please enter an address first");
      return;
    }

    setIsGettingCoordinates(true);
    try {
      const coords = await getCoordinatesFromPlace(currentAddress);
      setFormData({
        ...formData,
        coordinates: {
          lat: parseFloat(coords.lat.toFixed(6)),
          lng: parseFloat(coords.lng.toFixed(6)),
        },
      });
      toast.success("Coordinates fetched successfully!");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error fetching coordinates:", error);
      toast.error(error?.message || "Failed to fetch coordinates");
    } finally {
      setIsGettingCoordinates(false);
    }
  };

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotel?._id && !selectedHotel?.hotelId) {
      toast.error("Hotel ID is missing");
      return;
    }
    
    const hotelId = selectedHotel._id || selectedHotel.hotelId;
    if (!hotelId) return;

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatePayload: any = {
        name: formData.name,
        address: formData.address,
        rating: Math.min(5, formData.rating),
      };

      if (selectedHotel.destinationId || destinationId) {
        updatePayload.destinationId = selectedHotel.destinationId || destinationId;
      }

      if (formData.coordinates.lat !== undefined && formData.coordinates.lng !== undefined) {
        updatePayload.coordinates = {
          lat: formData.coordinates.lat,
          lng: formData.coordinates.lng,
        };
      }

     await updateHotel(hotelId, updatePayload);
      toast.success("Hotel updated successfully!");

      const updateHotelInList = (list: Hotel[]) =>
        list.map((h) => {
          const currentId = h._id || h.hotelId;
          const selectedId = selectedHotel._id || selectedHotel.hotelId;
          return currentId === selectedId
            ? {
                ...h,
                name: formData.name,
                address: formData.address,
                rating: Math.min(5, formData.rating),
                coordinates: formData.coordinates.lat !== undefined && formData.coordinates.lng !== undefined
                  ? { lat: formData.coordinates.lat, lng: formData.coordinates.lng }
                  : h.coordinates,
              }
            : h;
        });

      setHotels(updateHotelInList);
      if (!isSearchMode) {
        setOriginalHotels(updateHotelInList);
      }

      setIsEditModalOpen(false);
      setSelectedHotel(null);
      
    } catch (err) {
      console.error("Error while editing hotel", err);
      setError("Failed to update hotel. Please try again.");
      toast.error( "Failed to update hotel");
      
      setTimeout(() => setError(""), 3000);
    }
  }, [selectedHotel, formData, isSearchMode, destinationId]);

  const confirmDelete = useCallback(async () => {
    if (!selectedHotel?._id) return;
    
    try {
      await deleteHotel(selectedHotel._id);
      toast.success("Hotel deleted successfully!");

      const updatedHotels = hotels.filter(h => h._id !== selectedHotel._id);
      const updatedOriginalHotels = originalHotels.filter(h => h._id !== selectedHotel._id);

      setHotels(updatedHotels);
      if (!isSearchMode) {
        setOriginalHotels(updatedOriginalHotels);
        setTotalHotels(prev => prev - 1);
        setTotalPages(Math.ceil((totalHotels - 1) / 5));
      } else {
        setTotalPages(Math.ceil(updatedHotels.length / 5));
      }
      
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete hotel. Please try again.");
      toast.error("Failed to delete hotel");
      
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setSelectedHotel(null);
    }
  }, [selectedHotel, hotels, originalHotels, isSearchMode, totalHotels]);

  const columns = useMemo<ColumnDef<Hotel>[]>(
    () => [
      { 
        header: "#", 
        cell: ({ row }) => {
          const baseIndex = (page - 1) * 5;
          return baseIndex + row.index + 1;
        }
      },
      { header: "Hotel Name", accessorKey: "name" },
      { header: "Address", accessorKey: "address" },
      {
        header: "Rating",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <span className="font-medium">{row.original.rating}</span>
            <span className="text-yellow-500">⭐</span>
          </div>
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleEditClick(row.original)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit hotel"
            >
              <Edit className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedHotel(row.original);
                setIsDeleteModalOpen(true);
              }}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete hotel"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ),
      },
    ],
    [page, handleEditClick]
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading hotels...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-black flex items-center gap-2">
            <MapPin className="w-5 h-5" /> Hotels List
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {isSearchMode 
              ? `Found ${hotels.length} hotel${hotels.length !== 1 ? 's' : ''} for "${searchQuery}"`
              : `${totalHotels} total hotels`
            }
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-60">
            <SearchBar 
              placeholder="Search hotels..." 
              onSearch={handleSearch}
              // value={searchQuery}
            />
          </div>
          <span className="bg-slate-800 text-white px-3 py-1 rounded-full text-sm">
            {hotels.length} hotel{hotels.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

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

  
      {hotels.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReusableTable data={getCurrentPageData()} columns={columns} />
          </div>

        
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                total={totalPages} 
                current={page} 
                setPage={handlePageChange}
              />
            </div>
          )}

       
          <div className="text-center text-sm text-gray-500">
            {isSearchMode 
              ? `Showing ${Math.min((page - 1) * 5 + 1, hotels.length)}-${Math.min(page * 5, hotels.length)} of ${hotels.length} search results`
              : `Showing ${((page - 1) * 5) + 1}-${Math.min(page * 5, totalHotels)} of ${totalHotels} hotels`
            }
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Hotels Found
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No hotels match your search for "${searchQuery}"`
              : "No hotels are available at the moment"
            }
          </p>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 p-6 animate-scaleIn">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
              Edit Hotel
            </h3>

            <form onSubmit={handleUpdate} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotel Name
                </label>
                <input
                  className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Hotel Name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="flex gap-2">
                  <input
                    className="border border-gray-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Address"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleGetCoordinates}
                    disabled={isGettingCoordinates}
                    className="bg-gray-800 text-white hover:bg-gray-700 px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                  >
                    {isGettingCoordinates ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Getting...</span>
                      </>
                    ) : (
                      <>
                        <MapPin className="w-4 h-4" />
                        <span>Get Coords</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Coordinates */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <label className="text-sm font-semibold text-gray-700">
                    Geographic Coordinates
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={formData.coordinates.lat ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: {
                            ...formData.coordinates,
                            lat: e.target.value ? parseFloat(e.target.value) : undefined,
                          },
                        })
                      }
                      placeholder="e.g., 28.6139"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      value={formData.coordinates.lng ?? ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          coordinates: {
                            ...formData.coordinates,
                            lng: e.target.value ? parseFloat(e.target.value) : undefined,
                          },
                        })
                      }
                      placeholder="e.g., 77.2090"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Click "Get Coords" to automatically fetch coordinates from the address
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-5)
                </label>
                <input
                  className="border border-gray-300 p-2 w-full rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  type="number"
                  min={1}
                  max={5}
                  step={0.1}
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: Math.min(5, Math.max(1, Number(e.target.value))),
                    })
                  }
                  placeholder="Rating (1-5)"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedHotel && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 p-6 animate-scaleIn">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Confirm Delete
              </h3>
              
              <p className="text-gray-600 mb-2">
                Are you sure you want to delete this hotel?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="font-semibold text-red-800 text-lg">
                  {selectedHotel.name}
                </p>
                <p className="text-red-600 text-sm">
                  {selectedHotel.address}
                </p>
                <p className="text-red-600 text-sm">
                  Rating: {selectedHotel.rating} ⭐
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-6">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Delete Hotel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelsTable;