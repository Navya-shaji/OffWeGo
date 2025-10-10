import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getsingleDestination } from "@/services/Destination/destinationService";
import { getPackagesByDestination } from "@/services/packages/packageService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { MapPin, ArrowLeft } from "lucide-react";
import Navbar from "@/components/profile/navbar";
import { SearchBar } from "@/components/Modular/searchbar";
import { searchPackages } from "@/services/packages/packageService";
import type { Package } from "@/interface/PackageInterface";

export const DestinationDetail = () => {
  const id = useParams().id;
  const [destination, setDestination] = useState<DestinationInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<Package[] | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [error, setError] = useState("");
console.log(packagesLoading,searchLoading,error)
  console.log(searchQuery, isSearchMode);
  const navigate = useNavigate();

  const displayedPackages = useMemo(() => {
    const result = searchResults ?? packages;
    console.log("🖥️ Displaying packages:", {
      searchResultsExists: searchResults !== null,
      searchResultsCount: searchResults?.length || 0,
      regularPackagesCount: packages.length,
      finalCount: result.length,
    });
    return result;
  }, [searchResults, packages]);

  const handleSearch = useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults(null); 
        setIsSearchMode(false);
        return;
      }

      setIsSearchMode(true);
      setSearchLoading(true);
      try {
        const response = await searchPackages(query);

        const searchResultsArray = Array.isArray(response) ? response : [];

        setSearchResults(searchResultsArray);
      } catch (error) {
        console.error("Search error:", error);
        setError("Search failed. Please try again.");
        setSearchResults([]);

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
      const response = await getPackagesByDestination(id);

      let destinationPackages: Package[] = [];

      if (response && Array.isArray(response.packages)) {
        destinationPackages = response.packages;
      } else if (response && Array.isArray(response)) {
        destinationPackages = response;
      } else {
        console.warn(" Unexpected packages response structure:", response);
        destinationPackages = [];
      }

     
      setPackages(destinationPackages);
    } catch (error) {
      console.error("Failed to fetch destination packages:", error);
      setPackages([]);
    } finally {
      setPackagesLoading(false);
    }
  }, [id]);

  
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
      clearSearch();
    }
  }, [id, fetchDestinationPackages, clearSearch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-sky-200"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-sky-500 absolute top-0"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-900 font-semibold text-lg">
              Loading destination...
            </p>
            <p className="text-gray-600 text-sm">
              Preparing your adventure details
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-coral-100 rounded-full flex items-center justify-center">
            <MapPin className="w-10 h-10 text-coral-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Destination Not Found
          </h3>
          <p className="text-coral-500 mb-6">
            We couldn't find the destination you're looking for.
          </p>
          <button
            onClick={() => navigate("/destinations")}
            className="inline-flex items-center px-6 py-3 bg-sky-500 text-white font-semibold rounded-full hover:bg-sky-600 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="relative">
        {Array.isArray(destination.imageUrls) &&
        destination.imageUrls.length > 0 ? (
          <div className="relative h-screen overflow-hidden">
            <img
              src={
                destination.imageUrls[activeImageIndex] || "/placeholder.svg"
              }
              alt={destination.name}
              className="w-full h-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70"></div>

            {destination.imageUrls.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {destination.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeImageIndex
                        ? "bg-white shadow-lg w-8"
                        : "bg-white/50 hover:bg-white/75 w-2"
                    }`}
                  />
                ))}
              </div>
            )}

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
              <div className="mb-6 flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{destination.location}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight max-w-4xl">
                {destination.name}
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl font-light">
                Where White Dreams Meet Blue Horizons
              </p>

              <div className="flex gap-4 flex-wrap justify-center">
                <button className="px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-xl">
                  Book Now
                </button>
                <button
                  onClick={() => navigate("/destinations")}
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 border-2 border-white/50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Destinations
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
              <div className="mb-6 flex items-center gap-2 text-white/90 text-lg">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{destination.location}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight max-w-4xl">
                {destination.name}
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl font-light">
                Where White Dreams Meet Blue Horizons
              </p>

              <div className="flex gap-4 flex-wrap justify-center">
                <button className="px-8 py-4 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-full transition-all duration-300 hover:scale-105 shadow-xl">
                  Book Now
                </button>
                <button
                  onClick={() => navigate("/destinations")}
                  className="inline-flex items-center px-8 py-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold rounded-full transition-all duration-300 border-2 border-white/50"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Destinations
                </button>
              </div>
            </div>

            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-sky-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 left-1/3 w-48 h-48 bg-coral-500/20 rounded-full blur-2xl"></div>
          </div>
        )}
      </div>

      <div className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-coral-50 py-16 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg border border-white/40 p-8 hover:shadow-2xl transition-all duration-500">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-5 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-sky-500 to-coral-500 rounded-full mr-4"></div>
                Discover {destination.name}
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {destination.description}
              </p>
            </div>

            {Array.isArray(destination.imageUrls) &&
              destination.imageUrls.length > 1 && (
                <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg border border-white/40 p-8 hover:shadow-2xl transition-all duration-500">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <div className="w-2 h-6 bg-gradient-to-b from-coral-500 to-sky-500 rounded-full mr-4"></div>
                    Photo Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {destination.imageUrls.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative rounded-2xl overflow-hidden cursor-pointer group transform transition duration-500 hover:scale-105 hover:shadow-xl ${
                          idx === activeImageIndex ? "ring-4 ring-sky-400" : ""
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Image ${idx}`}
                          className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg border border-white/40 p-8 hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                  <div className="w-2 h-8 bg-gradient-to-b from-sky-500 to-coral-500 rounded-full mr-4"></div>
                  Travel Packages
                </h2>
                <div className="w-60">
                  <SearchBar
                    placeholder="Search packages..."
                    onSearch={handleSearch}
                  />
                </div>
              </div>

              {displayedPackages.length > 0 ? (
                <div className="space-y-6">
                  {displayedPackages.map((pkg) => (
                    <div
                      key={pkg._id || pkg.id}
                      className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-5">
                          <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-coral-500 rounded-2xl flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-xl">
                              {pkg.packageName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-xl font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                              {pkg.packageName}
                            </h4>
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {pkg.description}
                            </p>
                            <div className="text-sm text-gray-500 mt-2">
                              Duration: {pkg.duration} day
                              {pkg.duration !== 1 ? "s" : ""} |{" "}
                              <span className="font-semibold text-coral-500">
                                ₹{pkg.price.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            navigate("/timeline", {
                              state: { selectedPackage: pkg },
                            })
                          }
                          className="px-6 py-3 bg-gradient-to-r from-sky-500 to-coral-500 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-transform hover:scale-105"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <MapPin className="w-10 h-10 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-2xl font-semibold mb-2">
                    No Packages Found
                  </h3>
                  <p>Travel packages for this destination are coming soon!</p>
                </div>
              )}
            </div>
          </div>

          {/* Map Section */}
          <div className="space-y-10">
            <div className="backdrop-blur-lg bg-white/80 rounded-3xl shadow-lg border border-white/40 hover:shadow-2xl transition-all duration-500 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-extrabold text-gray-900 flex items-center">
                  <div className="w-2 h-6 bg-gradient-to-b from-sky-500 to-coral-500 rounded-full mr-4"></div>
                  Location Map
                </h3>
              </div>
              <div className="p-6">
                <div className="h-64 rounded-2xl overflow-hidden shadow-lg border border-white/60">
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
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker
                      position={[
                        destination.coordinates.lat,
                        destination.coordinates.lng,
                      ]}
                    >
                      <Popup>
                        <div className="text-center">
                          <h4 className="font-bold">{destination.name}</h4>
                          <p className="text-gray-600 text-sm">
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
  );
};
