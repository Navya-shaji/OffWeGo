import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getsingleDestination } from "@/services/Destination/destinationService";
import { getPackagesByDestination } from "@/services/packages/packageService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import {
  MapPin,
  Calendar,
  ArrowLeft,
  ExternalLink,
  Star,
  Clock,
  Users,
} from "lucide-react";
import Navbar from "@/components/profile/navbar";
import { SearchBar } from "@/components/Modular/searchbar";
import { searchPackages } from "@/services/packages/packageService";
import type { Package } from "@/interface/PackageInterface";

export const DestinationDetail = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState<DestinationInterface | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<Package[] | null>(null);

  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(false);
  const [packagesPagination, setPackagesPagination] = useState({
    totalPackages: 0,
    totalPages: 0,
    currentPage: 1,
  });

  const navigate = useNavigate();
  const displayedPackages = searchResults ?? packages;

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }
      try {
        const response = await searchPackages(query, id);
        setSearchResults(response ?? []);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    },
    [id]
  );

  const fetchDestinationPackages = useCallback(
    async (page: number = 1, limit: number = 10) => {
      if (!id) return;

      setPackagesLoading(true);
      try {
        const response = await getPackagesByDestination(id, page, limit);
        setPackages(response.packages);
        setPackagesPagination({
          totalPackages: response.totalPackages,
          totalPages: response.totalPages,
          currentPage: response.currentPage,
        });
      } catch (error) {
        console.error("Failed to fetch destination packages:", error);
        setPackages([]);
      } finally {
        setPackagesLoading(false);
      }
    },
    [id]
  );
  // console.log(packages,"pack")

  useEffect(() => {
    if (id) {
      getsingleDestination(id)
        .then((res) => {
          setDestination(res);
        })
        .catch((err) => console.error("Failed to load destination", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDestinationPackages();
    }
  }, [id, fetchDestinationPackages]);

  const loadMorePackages = () => {
    if (packagesPagination.currentPage < packagesPagination.totalPages) {
      fetchDestinationPackages(packagesPagination.currentPage + 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-20 h-20 rounded-full border-4 border-indigo-100 animate-spin"></div>
            <div className="w-20 h-20 rounded-full border-4 border-t-indigo-600 absolute top-0 animate-spin"></div>
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-cyan-600 rounded-full absolute top-4 left-4 animate-pulse"></div>
          </div>
          <div className="space-y-3">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
              Discovering Your Adventure
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              Preparing breathtaking details of your next destination
            </p>
            <div className="flex justify-center space-x-1 mt-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-lg transform hover:scale-105 transition-transform duration-300">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
            <MapPin className="w-12 h-12 text-white" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Destination Not Found
          </h3>
          <p className="text-red-600 mb-8 text-lg">
            The destination you're looking for seems to have wandered off the
            map.
          </p>
          <button
            onClick={() => navigate("/destinations")}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Navbar />

      <div className="relative overflow-hidden">
        {Array.isArray(destination.imageUrls) &&
        destination.imageUrls.length > 0 ? (
          <div className="relative h-[60vh] md:h-[70vh] lg:h-[80vh]">
            <div className="absolute inset-0">
              <img
                src={
                  destination.imageUrls[activeImageIndex] || "/placeholder.svg"
                }
                alt={destination.name}
                className="w-full h-full object-cover transition-all duration-1000 scale-105 hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30"></div>

            {destination.imageUrls.length > 1 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
                {destination.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-4 h-4 rounded-full transition-all duration-500 transform hover:scale-125 ${
                      idx === activeImageIndex
                        ? "bg-white shadow-2xl scale-125"
                        : "bg-white/40 hover:bg-white/70 backdrop-blur-sm"
                    }`}
                  >
                    {idx === activeImageIndex && (
                      <div className="absolute inset-0 rounded-full bg-white animate-ping opacity-75"></div>
                    )}
                  </button>
                ))}
              </div>
            )}

            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                  <button
                    onClick={() => navigate("/destinations")}
                    className="group inline-flex items-center text-white/90 hover:text-white mb-6 transition-all duration-300 hover:translate-x-2"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-medium">Back to Destinations</span>
                  </button>

                  <div className="space-y-6">
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-none">
                      <span className="inline-block animate-fade-in-up">
                        {destination.name}
                      </span>
                    </h1>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-white/95 text-xl font-semibold bg-black/20 backdrop-blur-md rounded-full px-6 py-3">
                        <MapPin className="h-6 w-6 mr-3 text-cyan-400" />
                        <span>{destination.location}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[70vh] bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/3 w-60 h-60 bg-violet-500/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500/20 rounded-full blur-xl animate-pulse delay-2000"></div>

            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8 lg:p-12">
                <div className="max-w-7xl mx-auto">
                  <button
                    onClick={() => navigate("/destinations")}
                    className="group inline-flex items-center text-white/90 hover:text-white mb-6 transition-all duration-300"
                  >
                    <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform duration-300" />
                    <span className="font-medium">Back to Destinations</span>
                  </button>

                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight">
                    {destination.name}
                  </h1>

                  <div className="flex items-center text-white/95 text-xl font-semibold">
                    <MapPin className="h-6 w-6 mr-3 text-cyan-400" />
                    <span>{destination.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative -mt-32 px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10 transform hover:scale-[1.01] transition-all duration-500">
                <div className="flex items-center mb-8">
                  <div className="w-1 h-12 bg-gradient-to-b from-blue-600 to-cyan-600 rounded-full mr-6"></div>
                  <h2 className="text-4xl font-black text-slate-900">
                    Discover This Paradise
                  </h2>
                </div>
                <p className="text-slate-700 leading-relaxed text-lg lg:text-xl font-medium">
                  {destination.description}
                </p>
              </div>

              {Array.isArray(destination.imageUrls) &&
                destination.imageUrls.length > 1 && (
                  <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10 transform hover:scale-[1.01] transition-all duration-500">
                    <div className="flex items-center mb-8">
                      <div className="w-1 h-12 bg-gradient-to-b from-purple-600 to-pink-600 rounded-full mr-6"></div>
                      <h3 className="text-3xl font-black text-slate-900">
                        Photo Gallery
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {destination.imageUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className={`relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 hover:scale-110 hover:-rotate-1 ${
                            idx === activeImageIndex
                              ? "ring-4 ring-blue-500 ring-offset-4 scale-105"
                              : ""
                          }`}
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`${destination.name} ${idx + 1}`}
                            className="w-full h-32 object-cover transition-all duration-700 group-hover:scale-125"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                              <ExternalLink className="w-4 h-4 text-slate-700" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 p-8 lg:p-10 transform hover:scale-[1.01] transition-all duration-500">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
                  <div className="flex items-center">
                    <div className="w-1 h-12 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full mr-6"></div>
                    <h2 className="text-3xl font-black text-slate-900">
                      Travel Packages
                    </h2>
                  </div>
                  <div className="w-full lg:w-80">
                    <SearchBar
                      placeholder="Search packages..."
                      onSearch={handleSearch}
                    />
                  </div>
                </div>

                {packagesLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-indigo-200 rounded-full animate-spin"></div>
                      <div className="w-16 h-16 border-4 border-t-indigo-600 rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="text-slate-600 font-semibold text-lg">
                      Loading amazing packages...
                    </p>
                  </div>
                ) : displayedPackages.length > 0 ? (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r bg-black rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold">
                              {packagesPagination.totalPackages} Package
                              {packagesPagination.totalPackages !== 1
                                ? "s"
                                : ""}{" "}
                              Available
                            </h3>
                            {searchResults && (
                              <p className="text-blue-100">
                                Showing {displayedPackages.length} search
                                results
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {displayedPackages.map((pkg, index) => (
                        <div
                          key={pkg._id}
                          className="group relative p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-700 border border-white/40 hover:border-blue-200 transform hover:scale-[1.02] hover:-translate-y-1"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
                            <div className="flex items-center space-x-6">
                              <div className="relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-black to-gray-800 rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                                  <span className="text-white font-black text-2xl">
                                    {pkg.packageName.charAt(0)}
                                  </span>
                                 </div>
                              </div>

                              <div className="flex-1 space-y-1">
                                <h4 className="text-2xl font-black text-slate-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">
                                  {pkg.packageName}
                                </h4>
                                <p className="text-gray-600 text-sm truncate">
                                  {pkg.description}
                                </p>

                                <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                                  <span>💰 {pkg.price} INR</span>
                                  <span>
                                    ⏳ {pkg.duration} day
                                    {pkg.duration > 1 ? "s" : ""}
                                  </span>
                                  <span>
                                    🏨 {pkg.hotels?.length || 0} hotel(s)
                                  </span>
                                  <span>
                                    🎯 {pkg.activities?.length || 0} activity(s)
                                  </span>
                                  <span>
                                    🕒 {pkg.checkInTime} - {pkg.checkOutTime}
                                  </span>
                                </div>

                                {pkg.inclusions?.length > 0 && (
                                  <div className="mt-2 text-xs text-gray-400">
                                    Inclusions: {pkg.inclusions.join(", ")}
                                  </div>
                                )}
                              </div>
                            </div>

                            <button
                              className="group/btn relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:from-blue-700 hover:to-indigo-700 overflow-hidden"
                              onClick={() => {
                                navigate("/timeline", {
                                  state: { selectedPackage: pkg },
                                });
                              }}
                            >
                              <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700"></div>
                              <span className="relative mr-3">
                                Explore Package
                              </span>
                              <ExternalLink className="relative w-5 h-5 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:scale-110" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {!searchResults &&
                      packagesPagination.currentPage <
                        packagesPagination.totalPages && (
                        <div className="text-center pt-8">
                          <button
                            onClick={loadMorePackages}
                            className="group inline-flex items-center px-10 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-bold rounded-2xl hover:from-slate-800 hover:to-slate-900 transition-all duration-500 shadow-lg hover:shadow-2xl transform hover:scale-105"
                            disabled={packagesLoading}
                          >
                            {packagesLoading ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                                Loading More...
                              </>
                            ) : (
                              <>
                                <span className="mr-3">
                                  Load More Adventures
                                </span>
                                <span className="text-slate-300 group-hover:text-slate-100 transition-colors duration-300">
                                  ({packagesPagination.currentPage} of{" "}
                                  {packagesPagination.totalPages})
                                </span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="relative bg-gradient-to-br from-slate-100 to-blue-100 rounded-3xl shadow-inner border-2 border-dashed border-slate-300 p-20 text-center overflow-hidden">
                    <div className="absolute top-4 right-4 w-32 h-32 bg-blue-200/50 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-200/50 rounded-full blur-xl"></div>

                    <div className="relative z-10">
                      <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-12 h-12 text-slate-600" />
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">
                        {searchResults
                          ? "No Matches Found"
                          : "Packages Coming Soon"}
                      </h3>
                      <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                        {searchResults
                          ? "Try adjusting your search terms or browse all available packages."
                          : "Incredible travel experiences for this destination are being crafted just for you!"}
                      </p>
                      <div className="inline-flex items-center px-6 py-3 bg-blue-200 text-blue-800 rounded-full font-bold shadow-md">
                        <Calendar className="w-5 h-5 mr-3" />
                        {searchResults ? "Refine Search" : "Coming Soon"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Map */}
            <div className="space-y-8">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/30 overflow-hidden transform hover:scale-[1.02] transition-all duration-500">
                <div className="p-8 border-b border-slate-100">
                  <div className="flex items-center">
                    <div className="w-1 h-10 bg-gradient-to-b from-emerald-600 to-teal-600 rounded-full mr-6"></div>
                    <h3 className="text-2xl font-black text-slate-900">
                      Location
                    </h3>
                  </div>
                </div>

                <div className="p-8">
                  <div className="h-80 w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white relative group">
                    <MapContainer
                      center={[
                        destination.coordinates.lat,
                        destination.coordinates.lng,
                      ]}
                      zoom={13}
                      scrollWheelZoom={false}
                      className="h-full w-full transition-all duration-500 group-hover:brightness-110"
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
                          <div className="text-center p-4">
                            <h4 className="font-bold text-slate-900 text-lg mb-2">
                              {destination.name}
                            </h4>
                            <p className="text-slate-600">
                              {destination.location}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                  </div>

                  <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                    <div className="flex items-center justify-center space-x-3 text-emerald-700">
                      <MapPin className="w-6 h-6" />
                      <span className="font-bold text-lg">
                        {destination.location}
                      </span>
                    </div>
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
