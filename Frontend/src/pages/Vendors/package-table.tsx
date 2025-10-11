import { useState, useCallback, useEffect, useRef } from "react";
import {
  Clock,
  Trash2,
  Building,
  Activity,
  CheckCircle,
  Sparkles,
  DollarSign,
  Info,
  Package,
} from "lucide-react";
import { deletePackage, fetchAllPackages, searchPackages } from "@/services/packages/packageService";
import { SearchBar } from "@/components/Modular/searchbar";
import { type Package as PackageInterface } from "@/interface/PackageInterface";

interface PackageTableProps {
  packages: PackageInterface[];
  onPackagesUpdate?: (packages: PackageInterface[]) => void;
  loading?: boolean;
}

const PackageTable: React.FC<PackageTableProps> = ({
  packages = [],
  onPackagesUpdate,
  loading = false,
}) => {
  const [packageList, setPackageList] = useState<PackageInterface[]>(packages);
  const [originalPackages, setOriginalPackages] = useState<PackageInterface[]>(packages);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [error, setError] = useState("");
  console.log(packageList)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    package: PackageInterface | null;
  }>({
    isOpen: false,
    package: null,
  });
  console.log(originalPackages,"o")
  
  const [isDeleting, setIsDeleting] = useState(false);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setPackageList(packages);
    setOriginalPackages(packages);
  }, [packages]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);


  const loadPackages = useCallback(async () => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setError("");
      
      const response = await fetchAllPackages();
      const allPackages = response?.packages ?? [];
      
      setPackageList(allPackages);
      setOriginalPackages(allPackages);
      onPackagesUpdate?.(allPackages);
      
    } catch (error) {
      console.error("Error loading packages:", error);
      setError("Failed to load packages. Please try again.");
      setPackageList([]);
      setOriginalPackages([]);
    } finally {
      isLoadingRef.current = false;
    }
  }, [onPackagesUpdate]);

  const handleSearch = useCallback(async (query: string) => {
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
      
        setIsSearchMode(false);
        setPackageList(originalPackages);
        return;
      }

      setIsSearchMode(true);
      try {
        const response = await searchPackages(query);
        const searchResults = Array.isArray(response) ? response : [];
        
        setPackageList(searchResults);
        
      } catch (error) {
        console.error("Search error:", error);
        setError("Search failed. Please try again.");
        setPackageList([]);
        
        
        setTimeout(() => setError(""), 3000);
      }
    }, 400);
  }, [originalPackages]);

  useEffect(() => {
    if (!hasInitialized.current && packages.length === 0) {
      hasInitialized.current = true;
      loadPackages();
    }


    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [loadPackages, packages.length]);

  const openDeleteModal = useCallback((pkg: PackageInterface) => {
    setDeleteModal({ isOpen: true, package: pkg });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, package: null });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteModal.package) return;

    setIsDeleting(true);
    try {
      if (!deleteModal.package?._id) return;
      await deletePackage(deleteModal.package._id);

      const updatedPackages = packageList.filter(
        (pkg) => pkg._id !== deleteModal.package!._id
      );
      const updatedOriginalPackages = originalPackages.filter(
        (pkg) => pkg._id !== deleteModal.package!._id
      );

      setPackageList(updatedPackages);
      if (!isSearchMode) {
        setOriginalPackages(updatedOriginalPackages);
      }
      
      onPackagesUpdate?.(isSearchMode ? updatedOriginalPackages : updatedPackages);
      closeDeleteModal();

    } catch (error) {
      console.error("Delete failed:", error);
      setError("Failed to delete package. Please try again.");
      
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteModal.package, packageList, originalPackages, isSearchMode, onPackagesUpdate, closeDeleteModal]);

  const renderHotelsList = useCallback((hotels?: PackageInterface["hotels"]) => {
    if (!hotels || hotels.length === 0) {
      return <span className="text-gray-500 italic text-sm">No hotels</span>;
    }

    return (
      <div className="space-y-2 max-w-xs">
        {hotels.map((hotel, idx) => (
          <div key={idx}>
            <div className="font-semibold text-slate-800">{hotel.name}</div>
            <div className="flex items-center gap-1 mt-2"></div>
          </div>
        ))}
      </div>
    );
  }, []);

  const renderActivitiesList = useCallback((activities?: PackageInterface["activities"]) => {
    const validActivities = activities?.filter(activity => activity != null) || [];
    console.log(validActivities)
    const hasInvalidActivities = activities && activities.length > validActivities.length;
 
    if (validActivities.length === 0) {
      return (
        <div className="space-y-1">
          <span className="text-gray-500 italic text-sm">No activities</span>
          {hasInvalidActivities && (
            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded-md mt-1">
              ⚠️ Invalid activity references
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-2 max-w-xs">
        {validActivities.map((activity, idx) => (
          <div key={activity.id || idx} className="bg-indigo-50 border border-indigo-200 p-2 rounded-md">
            <div className="font-semibold text-indigo-900 text-sm">
              {activity.title}
            </div>
            <div className="text-xs text-indigo-700 mt-1 line-clamp-2">
              {activity.description}
            </div>
          </div>
        ))}
        {hasInvalidActivities && (
          <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 p-2 rounded-md">
            ⚠️ Some activities not found
          </div>
        )}
      </div>
    );
  }, []);

  const renderItineraryCount = useCallback((itinerary?: PackageInterface["itinerary"]) => {
    if (!itinerary || itinerary.length === 0) {
      return <span className="text-gray-500 italic text-sm">No itinerary</span>;
    }

    const uniqueDays = new Set(itinerary.map((item) => item.day));

    return (
      <div className="text-center">
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-3 rounded-lg">
          <div className="font-bold text-xl">{uniqueDays.size}</div>
          <div className="text-xs font-medium">Days Planned</div>
        </div>
        <div className="bg-emerald-25 border border-emerald-100 text-emerald-700 px-2 py-2 rounded-md mt-2 text-xs">
          {itinerary.length} Activities
        </div>
      </div>
    );
  }, []);

  const renderInclusionsList = useCallback((inclusions?: string[]) => {
    if (!inclusions || inclusions.length === 0) {
      return (
        <span className="text-gray-500 italic text-sm">No inclusions</span>
      );
    }

    return (
      <div className="max-w-xs">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {inclusions.slice(0, 3).map((inclusion, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs bg-teal-25 border border-teal-100 p-2 rounded-md"
            >
              <CheckCircle className="h-3 w-3 text-teal-600 flex-shrink-0 mt-0.5" />
              <span className="text-teal-800">{inclusion}</span>
            </div>
          ))}
          {inclusions.length > 3 && (
            <div className="text-xs text-teal-700 font-medium text-center py-2">
              +{inclusions.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }, []);

  const renderAmenitiesList = useCallback((amenities?: string[]) => {
    if (!amenities || amenities.length === 0) {
      return <span className="text-gray-500 italic text-sm">No amenities</span>;
    }

    return (
      <div className="max-w-xs">
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {amenities.slice(0, 3).map((amenity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 text-xs bg-violet-25 border border-violet-100 p-2 rounded-md"
            >
              <Sparkles className="h-3 w-3 text-violet-600 flex-shrink-0 mt-0.5" />
              <span className="text-violet-800">{amenity}</span>
            </div>
          ))}
          {amenities.length > 3 && (
            <div className="text-xs text-violet-700 font-medium text-center py-2">
              +{amenities.length - 3} more
            </div>
          )}
        </div>
      </div>
    );
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600"></div>
        <span className="ml-3 text-slate-600">Loading packages...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          Package Details Overview
        </h2>
        
        <div className="flex items-center gap-4">
          <div className="w-60">
            <SearchBar 
              placeholder="Search packages..." 
              onSearch={handleSearch}
            />
          </div>
          <span className="bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-full font-medium">
            {packageList.length} Package{packageList.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Error Message */}
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

      {/* Search Status */}
      {isSearchMode && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
          Found {packageList.length} package{packageList.length !== 1 ? 's' : ''} for "{searchQuery}"
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-4 text-left font-semibold min-w-[200px]">
                  Package Details
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[120px]">
                  Price & Duration
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[100px]">
                  Check-In Time
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[100px]">
                  Check-Out Time
                </th>
                <th className="px-4 py-4 text-left font-semibold">
                  Hotels
                </th>
                <th className="px-4 py-4 text-left font-semibold">
                  Activities
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[120px]">
                  Itinerary
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[200px]">
                  Inclusions
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[200px]">
                  Amenities
                </th>
                <th className="px-4 py-4 text-left font-semibold min-w-[100px]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {packageList.map((pkg, index) => (
                <tr
                  key={pkg._id}
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-slate-25"
                  }`}
                >
                  <td className="px-4 py-6 align-top">
                    <div className="max-w-[200px]">
                      <h3 className="font-bold text-lg text-slate-900 mb-2 leading-tight">
                        {pkg.packageName}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {pkg.description}
                      </p>
                    </div>
                  </td>

                  <td className="px-4 py-6 align-top">
                    <div className="space-y-3">
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-emerald-800">
                          {formatCurrency(pkg.price)}
                        </div>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-center">
                        <div className="text-lg font-bold text-blue-800">
                          {pkg.duration}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          Days
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-6 align-top">
                    <div className="text-center">
                      {pkg.checkInTime ? (
                        <div>
                          <Clock className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                          <div className="font-bold text-emerald-800">
                            {pkg.checkInTime}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <Clock className="h-5 w-5 text-slate-400 mx-auto mb-2" />
                          <div className="text-sm text-slate-500">Not Set</div>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-6 align-top">
                    <div className="text-center">
                      {pkg.checkOutTime ? (
                        <div>
                          <Clock className="h-5 w-5 text-rose-600 mx-auto mb-2" />
                          <div className="font-bold text-rose-800">
                            {pkg.checkOutTime}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg">
                          <Clock className="h-5 w-5 text-slate-400 mx-auto mb-2" />
                          <div className="text-sm text-slate-500">Not Set</div>
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-6 align-top">
                    {renderHotelsList(pkg.hotels)}
                  </td>

                  <td className="px-4 py-6 align-top">
                    {renderActivitiesList(pkg.activities)}
                  </td>

                  <td className="px-4 py-6 align-top">
                    {renderItineraryCount(pkg.itinerary)}
                  </td>

                  <td className="px-4 py-6 align-top">
                    {renderInclusionsList(pkg.inclusions)}
                  </td>

                  <td className="px-4 py-6 align-top">
                    {renderAmenitiesList(pkg.amenities)}
                  </td>

                  <td className="px-4 py-6 align-top">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => openDeleteModal(pkg)}
                        className="flex items-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg hover:bg-rose-100 hover:border-rose-300 transition-colors text-sm font-medium"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {packageList.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <Package className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            No Packages Found
          </h3>
          <p className="text-slate-600">
            {searchQuery 
              ? `No packages match your search for "${searchQuery}"`
              : "Start by creating your first travel package."
            }
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-slate-300">
            <div className="bg-slate-800 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Trash2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Delete Package</h3>
                  <p className="text-slate-300 text-sm">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <p className="text-slate-700 mb-4">
                  Are you sure you want to delete this package? This will
                  permanently remove:
                </p>

                {deleteModal.package && (
                  <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl border-l-4 border-l-rose-500">
                    <h4 className="font-bold text-rose-800 text-lg mb-2">
                      {deleteModal.package.packageName}
                    </h4>
                    <div className="space-y-2 text-sm text-rose-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          Price: {formatCurrency(deleteModal.package.price)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Duration: {deleteModal.package.duration} days
                        </span>
                      </div>
                      {deleteModal.package.hotels && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>
                            {deleteModal.package.hotels.length} hotels
                          </span>
                        </div>
                      )}
                      {deleteModal.package.activities && (
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          <span>
                            {deleteModal.package.activities.length} activities
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <strong>Warning:</strong> All package data including
                      itinerary, images, and bookings will be permanently
                      deleted.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-slate-100 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete Package
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PackageTable;