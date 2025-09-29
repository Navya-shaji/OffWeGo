import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getsingleDestination } from "@/services/Destination/destinationService";
import { getPackagesByDestination } from "@/services/packages/packageService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { MapPin, Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import Navbar from "@/components/profile/navbar";
import { SearchBar } from "@/components/Modular/searchbar";
import { searchPackages } from "@/services/packages/packageService";
import type { Package } from "@/interface/PackageInterface";

export const DestinationDetail = () => {
  const id = useParams().id;
  const [destination, setDestination] = useState<DestinationInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<Package[] | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Memoized displayed packages
  const displayedPackages = useMemo(() => {
    const result = searchResults ?? packages;
    console.log("🖥️ Displaying packages:", {
      searchResultsExists: searchResults !== null,
      searchResultsCount: searchResults?.length || 0,
      regularPackagesCount: packages.length,
      finalCount: result.length
    });
    return result;
  }, [searchResults, packages]);

  const handleSearch = useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults(null); // Clear search results to show original packages
        setIsSearchMode(false);
        return;
      }

      setIsSearchMode(true);
      setSearchLoading(true);
      try {
        const response = await searchPackages(query);
        
        // Handle search response - based on your service, it returns packages directly
        const searchResultsArray = Array.isArray(response) ? response : [];
        
        setSearchResults(searchResultsArray);
        
      } catch (error) {
        console.error("Search error:", error);
        setError("Search failed. Please try again.");
        setSearchResults([]);
        
        // Clear error after 3 seconds
        setTimeout(() => setError(""), 3000);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }, []);

  const fetchDestinationPackages = useCallback(async () => {
    if (!id) return;
    
    setPackagesLoading(true);
    try {
      console.log("📦 Fetching packages for destination:", id);
      const response = await getPackagesByDestination(id);
      console.log("📦 Packages response:", response);
      
      // Based on your service function, it returns {packages: Package[]}
      let destinationPackages: Package[] = [];
      
      if (response && Array.isArray(response.packages)) {
        destinationPackages = response.packages;
      } else if (response && Array.isArray(response)) {
        // Fallback if the API sometimes returns packages directly
        destinationPackages = response;
      } else {
        console.warn("⚠️ Unexpected packages response structure:", response);
        destinationPackages = [];
      }
      
      console.log("✅ Setting packages:", destinationPackages.length, "items");
      setPackages(destinationPackages);
    
    } catch (error) {
      console.error("Failed to fetch destination packages:", error);
      setPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  }, [id]);

  // Clear search when destination changes
  const clearSearch = useCallback(() => {
    setSearchResults(null);
    setSearchQuery("");
    setIsSearchMode(false);
    setError("");
  }, []);

  useEffect(() => {
    if (id) {
      getsingleDestination(id)
        .then((res) => {
          console.log("🏖️ Destination loaded:", res);
          setDestination(res);
        })
        .catch((err) => console.error("Failed to load destination", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDestinationPackages();
      clearSearch(); // Clear search when destination changes
    }
  }, [id, fetchDestinationPackages, clearSearch]);

 


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-600 absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-700 font-semibold text-lg">
              Loading destination...
            </p>
            <p className="text-slate-500 text-sm">
              Preparing your adventure details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-rose-100 flex items-center justify-center">
        <div className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-red-100 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Destination Not Found
          </h3>
          <p className="text-red-600 mb-6">
            We couldn't find the destination you're looking for.
          </p>
          <button
            onClick={() => navigate("/destinations")}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="relative">
        {Array.isArray(destination.imageUrls) &&
        destination.imageUrls.length > 0 ? (
          <div className="relative h-96 md:h-[500px] overflow-hidden">
            <img
              src={
                destination.imageUrls[activeImageIndex] || "/placeholder.svg"
              }
              alt={destination.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

            {destination.imageUrls.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {destination.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex
                        ? "bg-white shadow-lg"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={() => navigate("/destinations")}
                  className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Destinations
                </button>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                  {destination.name}
                </h1>
                <div className="flex items-center text-white/90 text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="font-medium">{destination.location}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-96 md:h-[500px] bg-gradient-to-br from-slate-800 to-black relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                <button
                  onClick={() => navigate("/destinations")}
                  className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors duration-300"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Destinations
                </button>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                  {destination.name}
                </h1>
                <div className="flex items-center text-white/90 text-lg">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span className="font-medium">{destination.location}</span>
                </div>
              </div>
            </div>

            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-yellow-400/20 rounded-full blur-2xl"></div>
          </div>
        )}
      </div>

      <div className="relative -mt-20 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Uncomment the line below to see debug info */}
          {/* <DebugInfo /> */}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-4"></div>
                  Discover This Destination
                </h2>
                <p className="text-slate-700 leading-relaxed text-lg">
                  {destination.description}
                </p>
              </div>

              {Array.isArray(destination.imageUrls) &&
                destination.imageUrls.length > 1 && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                      <div className="w-2 h-6 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-4"></div>
                      Photo Gallery
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {destination.imageUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                            idx === activeImageIndex
                              ? "ring-4 ring-blue-500 ring-offset-2"
                              : ""
                          }`}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`${destination.name} ${idx + 1}`}
                            className="w-full h-24 object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                    <div className="w-2 h-8 bg-gradient-to-b from-green-600 to-emerald-600 rounded-full mr-4"></div>
                    Available Packages
                  </h2>

                  <div className="flex items-center space-x-4">
                    <div className="w-60">
                      <SearchBar
                        placeholder="Search packages..."
                        onSearch={handleSearch}
                      />
                    </div>
                 
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                  </div>
                )}

                {(packagesLoading || searchLoading) ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-blue-600 absolute top-0"></div>
                    </div>
                    <span className="ml-4 text-slate-600 font-medium">
                      {searchLoading ? "Searching packages..." : "Loading packages..."}
                    </span>
                  </div>
                ) : displayedPackages.length > 0 ? (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-slate-700 font-semibold text-lg">
                          {displayedPackages.length} Package
                          {displayedPackages.length !== 1 ? "s" : ""} 
                          {searchResults !== null ? " Found" : " Available"}
                        </span>
                        {searchResults !== null && (
                          <span className="text-slate-500 text-sm ml-2">
                            (Search Results)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {displayedPackages.map((pkg) => (
                        <div
                          key={pkg._id || pkg.id}
                          className="group p-6 bg-gradient-to-r from-white to-blue-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20 hover:border-blue-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                                  <span className="text-white font-bold text-xl">
                                    {pkg.packageName.charAt(0)}
                                  </span>
                                </div>
                              </div>

                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                  {pkg.packageName}
                                </h4>
                                {pkg.description && (
                                  <p className="text-slate-600 text-sm line-clamp-2">
                                    {pkg.description}
                                  </p>
                                )}
                                <div className="flex items-center mt-2 text-sm text-slate-500">
                                  <span className="mr-4">Duration: {pkg.duration} day{pkg.duration !== 1 ? 's' : ''}</span>
                                  {pkg.price && (
                                    <span className="font-semibold text-green-600">₹{pkg.price.toLocaleString()}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              className="group/btn inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              onClick={() => {
                                navigate("/timeline", {
                                  state: { selectedPackage: pkg },
                                });
                              }}
                            >
                              <span className="mr-2">View Details</span>
                              <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl shadow-inner border-2 border-dashed border-slate-300 p-16 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                      <MapPin className="w-10 h-10 text-slate-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">
                      {searchResults !== null ? "No Search Results" : "No Packages Available"}
                    </h3>
                    <p className="text-slate-600 text-lg mb-6 max-w-md mx-auto">
                      {searchResults !== null ? 
                        "No packages found matching your search criteria. Try different keywords or clear the search to see all packages." :
                        "Travel packages for this destination are coming soon. Check back later for exciting adventures!"
                      }
                    </p>
                    <div className="flex justify-center space-x-4">
                      <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        <Calendar className="w-4 h-4 mr-2" />
                        {searchResults !== null ? "Try Different Keywords" : "Coming Soon"}
                      </div>
                      {searchResults !== null && (
                        <button
                          onClick={clearSearch}
                          className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors duration-200"
                        >
                          Show All Packages
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900 flex items-center">
                    <div className="w-2 h-6 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full mr-4"></div>
                    Location Map
                  </h3>
                </div>

                <div className="p-6">
                  <div className="h-64 w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                    <MapContainer
                      center={[
                        destination.coordinates.lat,
                        destination.coordinates.lng,
                      ]}
                      zoom={10}
                      scrollWheelZoom={true}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker
                        position={[
                          destination.coordinates.lat,
                          destination.coordinates.lng,
                        ]}
                      >
                        <Popup>
                          <div className="text-center p-2">
                            <h4 className="font-bold text-slate-900">
                              {destination.name}
                            </h4>
                            <p className="text-slate-600 text-sm">
                              {destination.location}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};