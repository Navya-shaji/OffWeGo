import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getsingleDestination } from "@/services/Destination/destinationService";
import { getPackagesByDestination } from "@/services/packages/packageService";
import type { DestinationInterface } from "@/interface/destinationInterface";
import { MapPin, ArrowLeft, Search, Loader2, Clock, Calendar, Star, Users } from "lucide-react";
import Header from "@/components/home/navbar/Header";
import { searchPackages } from "@/services/packages/packageService";
import type { Package } from "@/interface/PackageInterface";

export const DestinationDetail = () => {
  const id = useParams().id;
  const [destination, setDestination] = useState<DestinationInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Package[] | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const navigate = useNavigate();

  const displayedPackages = useMemo(() => {
    return searchResults ?? packages;
  }, [searchResults, packages]);

  const handleSearch = useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setSearchResults(null);
        return;
      }

      try {
        const response = await searchPackages(query);
        const searchResultsArray = Array.isArray(response) ? response : [];
        setSearchResults(searchResultsArray);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      }
    }, 400);
  }, []);

  const fetchDestinationPackages = useCallback(async () => {
    if (!id) return;

    try {
      const response = await getPackagesByDestination(id);
      let destinationPackages: Package[] = [];

      if (response && Array.isArray(response.packages)) {
        destinationPackages = response.packages;
      } else if (response && Array.isArray(response)) {
        destinationPackages = response;
      }

      setPackages(destinationPackages);
    } catch (error) {
      console.error("Failed to fetch destination packages:", error);
      setPackages([]);
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
      fetchDestinationPackages();
    }
  }, [id, fetchDestinationPackages]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MapPin className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-gray-900">Destination Not Found</h3>
          <button
            onClick={() => navigate("/destinations")}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl mt-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Destinations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      <Header forceSolid />

      {/* Hero Section with Full-Screen Background */}
      <div className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Image */}
        {Array.isArray(destination.imageUrls) && destination.imageUrls.length > 0 ? (
          <img
            src={destination.imageUrls[0]}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-400 to-blue-500" />
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12">
          {/* Top - Back Button */}
          <div>
            <button
              onClick={() => navigate("/destinations")}
              className="inline-flex items-center px-5 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-all text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Destinations
            </button>
          </div>

          {/* Bottom - Destination Info */}
          <div className="text-white space-y-6 pb-20">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {destination.location}
              </div>
              <div className="px-5 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">
                {packages.length} Tour Packages
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
              {destination.name}
            </h1>

            <p className="text-xl sm:text-2xl text-white/90 leading-relaxed max-w-3xl font-light">
              {destination.description}
            </p>


          </div>
        </div>


        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
      </div>


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 pb-16">


        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-16">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages by name, duration, or activities..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="px-5 py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-lg">
                {displayedPackages.length} Results
              </span>
            </div>
          </div>
        </div>

        <div className="mb-10">

          <p className="text-gray-600 text-lg">Discover curated experiences for your journey</p>
        </div>

        {displayedPackages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {displayedPackages.map((pkg) => (
              <div
                key={pkg._id || pkg.id}
                onClick={() => navigate("/timeline", { state: { selectedPackage: pkg } })}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
              >
                <div className="relative h-56 overflow-hidden">
                  {(pkg.images && pkg.images.length > 0) || (destination.imageUrls && destination.imageUrls.length > 0) ? (
                    <img
                      src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : destination.imageUrls[0]}
                      alt={pkg.packageName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-blue-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  <div className="absolute top-4 right-4 px-4 py-2 bg-white rounded-full shadow-lg">
                    <span className="text-indigo-600 font-bold text-lg">₹{pkg.price.toLocaleString()}</span>
                  </div>

                 
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {pkg.packageName}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {pkg.description}
                  </p>

             

                  <button className="w-full mt-4 py-3 bg-gray-50 group-hover:bg-indigo-600 text-gray-900 group-hover:text-white font-medium rounded-xl transition-all">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl shadow-lg mb-20">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900">No Packages Available</h3>
            <p className="text-gray-600 text-lg">Check back soon for new travel packages</p>
          </div>
        )}

        <div>
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Location Map</h2>
            <p className="text-gray-600 text-lg">Explore the destination on the map</p>
          </div>

          <div className="h-96 rounded-2xl overflow-hidden shadow-2xl">
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
                    <div className="text-center p-2">
                      <h4 className="font-bold text-lg mb-1">{destination.name}</h4>
                      <p className="text-gray-600 text-sm">{destination.location}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            ) : (
              <div className="h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50">
                <div className="text-center">
                  <MapPin className="w-16 h-16 mx-auto mb-3 text-indigo-300" />
                  <p className="text-gray-500 font-medium text-lg">Map not available</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};