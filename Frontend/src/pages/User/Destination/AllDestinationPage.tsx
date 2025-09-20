import { useEffect, useState } from "react";
import { Search, MapPin, Star, Grid, List } from "lucide-react";
import { fetchAllDestinations } from "@/services/Destination/destinationService";

export const DestinationListPage = () => {
  const [destinations, setDestinations] = useState([]);
  const [filteredDestinations, setFilteredDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await fetchAllDestinations(1, 1000);
        setDestinations(data.destinations);
        setFilteredDestinations(data.destinations);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch destinations");
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    let filtered = [...destinations];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((dest) => dest.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "visitors":
          return parseFloat(b.visitors || "0") - parseFloat(a.visitors || "0");
        case "newest":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        default:
          return 0;
      }
    });

    setFilteredDestinations(filtered);
  }, [destinations, searchQuery, selectedCategory, sortBy]);

  const categories = [
    "all",
    ...Array.from(new Set(destinations.map((dest) => dest.category).filter(Boolean))),
  ];

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const searchResults = await searchDestination(query);
        setFilteredDestinations(searchResults);
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-600 text-lg font-medium">Discovering destinations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="text-red-500 text-xl mb-4 font-semibold">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      {/* Hero Header */}
      <div className="relative bg-white shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Discover Amazing Places
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Explore breathtaking destinations around the world and create unforgettable memories
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-6 w-6" />
              <input
                type="text"
                placeholder="Where do you want to explore?"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-4 text-lg border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Controls */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
           
            <div className="flex flex-wrap items-center gap-4">
       
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-medium"
              >
                <option value="name">Sort by Name</option>
                <option value="location">Sort by Location</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Right side controls */}
            <div className="flex items-center justify-between space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-slate-600 font-medium">
                  {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? "s" : ""}
                </span>
                <div className="h-1 w-1 bg-slate-400 rounded-full"></div>
                <span className="text-indigo-600 font-semibold">Found</span>
              </div>

         
              <div className="flex bg-slate-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-md"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Destinations Grid/List */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
              <MapPin className="h-16 w-16 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-700 mb-3">
                No destinations found
              </h3>
              <p className="text-slate-500 text-lg">
                Try adjusting your search criteria or explore different categories
              </p>
            </div>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "space-y-6"
            }
          >
            {filteredDestinations.map((dest, idx) => (
              <div
                key={dest.id || idx}
                onClick={() => {
       
                  
                }}
                className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                  viewMode === "list" ? "bg-white rounded-2xl shadow-lg hover:shadow-2xl" : ""
                }`}
              >
                {viewMode === "grid" ? (
                  // Grid View - Enhanced Cards
                  <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      {dest.imageUrls?.length > 0 ? (
                        <>
                          <img
                            src={dest.imageUrls[0]}
                            alt={dest.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <MapPin className="h-16 w-16 text-slate-400" />
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      {dest.category && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-slate-700 text-sm font-semibold px-3 py-1 rounded-full">
                            {dest.category}
                          </span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      {dest.rating && (
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-bold text-slate-700">{dest.rating}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="mb-3">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                          {dest.name}
                        </h3>
                        {dest.location && (
                          <div className="flex items-center text-slate-500">
                            <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                            <span className="text-sm font-medium">{dest.location}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
                        {dest.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                          Explore →
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // List View - Enhanced Layout
                  <div className="flex space-x-6 p-6">
                    <div className="w-60 h-40 flex-shrink-0 overflow-hidden rounded-xl">
                      {dest.imageUrls?.length > 0 ? (
                        <img
                          src={dest.imageUrls[0]}
                          alt={dest.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center">
                          <MapPin className="h-12 w-12 text-slate-400" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                            {dest.name}
                          </h3>
                          {dest.location && (
                            <div className="flex items-center text-slate-500 mb-2">
                              <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
                              <span className="font-medium">{dest.location}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {dest.rating && (
                            <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                              <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                              <span className="font-bold text-slate-700">{dest.rating}</span>
                            </div>
                          )}
                          {dest.category && (
                            <span className="bg-indigo-50 text-indigo-700 text-sm font-semibold px-4 py-2 rounded-full">
                              {dest.category}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-slate-600 mb-4 leading-relaxed line-clamp-2">
                        {dest.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-indigo-600 font-bold group-hover:text-indigo-700 transition-colors">
                          <span className="mr-2">View Details</span>
                          <div className="transform group-hover:translate-x-1 transition-transform">→</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}