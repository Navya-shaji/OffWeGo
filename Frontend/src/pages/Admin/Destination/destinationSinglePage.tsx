import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getsingleDestination } from "@/services/Destination/destinationService";
import { getPackagesByDestination } from "@/services/packages/packageService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { MapPin, ArrowLeft, Search, Loader2, Clock, ChevronRight } from "lucide-react";
import Navbar from "@/components/profile/navbar";
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
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [error, setError] = useState("");
  
  console.log(packagesLoading, searchLoading, error);
  console.log(searchQuery, isSearchMode);
  
  const navigate = useNavigate();

  const displayedPackages = useMemo(() => {
    const result = searchResults ?? packages;
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
        console.warn("Unexpected packages response structure:", response);
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

  useEffect(() => {
    if (id) {
      getsingleDestination(id)
        .then((res) => {
          const destinationData = res.data || res;
          setDestination(destinationData);
        })
        .catch((err) => console.error("Failed to load destination", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      setSearchResults(null);
      setSearchQuery("");
      setIsSearchMode(false);
      setError("");
      fetchDestinationPackages();
    }
  }, [id, fetchDestinationPackages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-black/60 animate-spin mx-auto mb-4" />
          <p className="text-black/80 font-light">Loading...</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <MapPin className="w-16 h-16 text-black/20 mx-auto mb-4" />
          <h3 className="text-2xl font-light text-black mb-3">Destination Not Found</h3>
          <p className="text-black/60 mb-6 font-light">We couldn't find what you're looking for.</p>
          <button
            onClick={() => navigate("/destinations")}
            className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold hover:bg-black/80 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section with Overlay Content */}
      <div className="relative h-screen overflow-hidden">
        {/* Background Image */}
        {Array.isArray(destination.imageUrls) && destination.imageUrls.length > 0 ? (
          <>
            <img
              src={destination.imageUrls[activeImageIndex] || "/placeholder.svg"}
              alt={destination.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
            
            {destination.imageUrls.length > 1 && (
              <div className="absolute bottom-8 right-8 flex gap-2 z-20">
                {destination.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${idx === activeImageIndex ? "bg-white w-8" : "bg-white/50 w-2"}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
            <div className="absolute inset-0 bg-black/30"></div>
          </>
        )}

        {/* Overlay Content Container */}
        <div className="relative z-10 h-full flex flex-col">
          <div className="flex-1 flex items-start pt-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <button
                onClick={() => navigate("/destinations")}
                className="inline-flex items-center px-4 py-2 border border-white/50 text-white text-sm font-medium backdrop-blur-sm hover:bg-white/10 transition-all mb-6 rounded"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Destinations
              </button>
              
              <p className="text-white/80 text-sm tracking-widest uppercase mb-3 font-medium">
                {destination.location}
              </p>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
                {destination.name}
              </h1>
              <p className="text-xl text-white/90 font-light leading-relaxed max-w-xl">
                {destination.description}
              </p>
            </div>
          </div>

          {/* Bottom Cards Section - Most Popular Packages */}
          <div className="px-6 md:px-12 pb-8 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold tracking-wide">MOST POPULAR</h2>
              <button className="text-white/80 hover:text-white transition-colors">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Horizontal Scrolling Cards */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {displayedPackages.slice(0, 4).map((pkg) => (
                <div
                  key={pkg._id || pkg.id}
                  onClick={() => navigate("/timeline", { state: { selectedPackage: pkg } })}
                  className="flex-shrink-0 w-64 bg-white rounded-lg overflow-hidden shadow-xl cursor-pointer hover:shadow-2xl transition-all group"
                >
                  <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-600 relative overflow-hidden">
                    {destination.imageUrls && destination.imageUrls[0] && (
                      <img 
                        src={destination.imageUrls[0]} 
                        alt={pkg.packageName}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-base mb-2 line-clamp-1">{pkg.packageName}</h3>
                    <div className="flex items-center gap-2 text-sm text-black/60 mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration} day{pkg.duration !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-xs text-black/50">per person</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar Section */}
      <div className="sticky top-0 z-30 bg-white border-b border-black/10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search all packages..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-black/10 rounded-lg focus:outline-none focus:border-black/40 transition-colors"
              />
            </div>
            <span className="text-sm text-black/60 whitespace-nowrap">
              {displayedPackages.length} packages
            </span>
          </div>
        </div>
      </div>

      {/* All Packages Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-light mb-2">All Travel Packages</h2>
          <p className="text-black/60 font-light">Explore all available packages for {destination.name}</p>
        </div>

        {displayedPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPackages.map((pkg) => (
              <div
                key={pkg._id || pkg.id}
                onClick={() => navigate("/timeline", { state: { selectedPackage: pkg } })}
                className="bg-white border border-black/10 rounded-lg overflow-hidden hover:shadow-xl hover:border-black/30 transition-all cursor-pointer group"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-600 relative overflow-hidden">
                  {destination.imageUrls && destination.imageUrls[0] && (
                    <img 
                      src={destination.imageUrls[0]} 
                      alt={pkg.packageName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-2 group-hover:translate-x-1 transition-transform">
                    {pkg.packageName}
                  </h3>
                  <p className="text-black/60 text-sm font-light mb-4 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-black/5">
                    <div className="flex items-center gap-2 text-sm text-black/60">
                      <Clock className="w-4 h-4" />
                      <span>{pkg.duration} days</span>
                    </div>
                    <span className="text-xl font-bold">₹{pkg.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-black/10 rounded-lg">
            <MapPin className="w-16 h-16 mx-auto mb-4 text-black/20" />
            <h3 className="text-xl font-light mb-2">No Packages Found</h3>
            <p className="text-black/60 font-light">Travel packages coming soon</p>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="bg-black/[0.02] py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-light mb-6">Location</h2>
          <div className="h-[450px] rounded-lg overflow-hidden border border-black/10">
            {destination.coordinates?.lat && destination.coordinates?.lng ? (
              <MapContainer
                center={[destination.coordinates.lat, destination.coordinates.lng]}
                zoom={10}
                scrollWheelZoom={true}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[destination.coordinates.lat, destination.coordinates.lng]}>
                  <Popup>
                    <div className="text-center">
                      <h4 className="font-bold">{destination.name}</h4>
                      <p className="text-gray-600 text-sm">{destination.location}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-black/20" />
                  <p className="text-black/40 font-light">Map coordinates not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};