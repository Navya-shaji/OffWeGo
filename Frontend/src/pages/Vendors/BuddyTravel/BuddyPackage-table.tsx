import React, { useEffect, useState } from "react";
import { getBuddypackagesByvendor } from "@/services/BuddyTravel/buddytravelService";
import { 
  Loader2, 
  Calendar, 
  MapPin, 
  IndianRupee, 
  Users, 
  Tag, 
  Eye,
  Clock,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Package,
  Activity,
  Sparkles
} from "lucide-react";
import { useSelector } from "react-redux"; 
import type { RootState } from "@/store/store";

type BuddyPackage = {
  _id: string;
  title: string;
  category: string;
  price: number;
  startDate: string;
  endDate: string;
  status: string;
  description: string;
  destination: string;
  maxPeople: number;
  vendorId: string;
  isApproved: boolean;
  joinedUsers: string[];
  createdAt: string;
  updatedAt: string;
};

const VendorApprovedPackages: React.FC = () => {
  const vendorId = useSelector((state: RootState) => state.vendorAuth.vendor?.id);

  const [packages, setPackages] = useState<BuddyPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<BuddyPackage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const itemsPerPage = 9;

  useEffect(() => {
    if (!vendorId) return; 

    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await getBuddypackagesByvendor(vendorId);
        const data = response.data || response;
        const approvedPackages = data.filter(
          (pkg: BuddyPackage) => pkg.status === "APPROVED"
        );
        setPackages(approvedPackages);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [vendorId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return formatDate(dateString);
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPackages = filteredPackages.slice(startIndex, endIndex);

  const PackageDetailsModal = ({ pkg, onClose }: { pkg: BuddyPackage; onClose: () => void }) => {
    if (!pkg) return null;

    const occupancyRate = (pkg.joinedUsers.length / pkg.maxPeople) * 100;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold mb-3">
                    <Sparkles className="w-3 h-3 mr-1" />
                    APPROVED PACKAGE
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{pkg.title}</h2>
                  <p className="text-white/90 text-sm">Updated {getTimeAgo(pkg.updatedAt)}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-full transition"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

      
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            <div className="space-y-6">
             
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <IndianRupee className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-blue-900">₹{pkg.price.toLocaleString()}</p>
                  <p className="text-xs text-blue-700 mt-1">Per Person</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-green-900">{pkg.joinedUsers.length}/{pkg.maxPeople}</p>
                  <p className="text-xs text-green-700 mt-1">Occupancy</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-purple-900">{occupancyRate.toFixed(0)}%</p>
                  <p className="text-xs text-purple-700 mt-1">Filled</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">About This Package</h3>
                <p className="text-gray-700 leading-relaxed">{pkg.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-5 border-2 border-purple-100 hover:border-purple-300 transition">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Destination</p>
                      <p className="text-gray-900 font-bold">{pkg.destination}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-2 border-pink-100 hover:border-pink-300 transition">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Tag className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Category</p>
                      <p className="text-gray-900 font-bold">{pkg.category}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-2 border-blue-100 hover:border-blue-300 transition">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Start Date</p>
                      <p className="text-gray-900 font-bold">{formatDate(pkg.startDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-5 border-2 border-orange-100 hover:border-orange-300 transition">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <Calendar className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">End Date</p>
                      <p className="text-gray-900 font-bold">{formatDate(pkg.endDate)}</p>
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 font-semibold mb-1">Current Revenue</p>
                    <p className="text-3xl font-bold text-emerald-900">
                      ₹{(pkg.price * pkg.joinedUsers.length).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-700 font-semibold mb-1">Potential Revenue</p>
                    <p className="text-2xl font-bold text-emerald-700">
                      ₹{(pkg.price * pkg.maxPeople).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

        
              <div className="bg-gray-100 rounded-xl p-4 text-xs text-gray-600 space-y-1">
                <p><span className="font-semibold">Package ID:</span> <span className="font-mono">{pkg._id}</span></p>
                <p><span className="font-semibold">Created:</span> {formatDate(pkg.createdAt)}</p>
                <p><span className="font-semibold">Last Updated:</span> {formatDate(pkg.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <p className="text-gray-700 font-semibold text-lg">Loading your packages...</p>
        </div>
      </div>
    );
  }

  if (error) {
  const roastMessages = [
    "Bruh… your code tripped over itself. Try again. 😭",
    "Looks like your API took a coffee break ☕ — come back later.",
    "Well, that escalated quickly. 🚒 The server just rage quit.",
    "Error 404: Developer’s patience not found 😅",
    "Even your code needs therapy after this error 💀",
    "Somewhere in the backend, a server just screamed ‘WHY ME?!’ 😭",
  ];

  const randomRoast = roastMessages[Math.floor(Math.random() * roastMessages.length)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border-4 border-red-200">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-red-600 mb-2">Uh oh! 💥</h2>
        <p className="text-gray-700 font-semibold mb-4">{randomRoast}</p>
        <p className="text-gray-500 text-sm break-words italic">Error details: {error}</p>

        <button
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all"
        >
          Try Again 🔁
        </button>
      </div>
    </div>
  );
}

  if (!vendorId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Authentication Required</h2>
          <p className="text-gray-600">Please log in to view your packages.</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: packages.length,
    joined: packages.reduce((sum, pkg) => sum + pkg.joinedUsers.length, 0),
    capacity: packages.reduce((sum, pkg) => sum + pkg.maxPeople, 0),
    revenue: packages.reduce((sum, pkg) => sum + (pkg.price * pkg.joinedUsers.length), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Live Packages
              </h1>
              <p className="text-gray-600 text-sm">Track performance and manage your buddy travel offerings</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Active Packages</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Users Joined</p>
            <p className="text-3xl font-bold text-gray-900">{stats.joined}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Capacity</p>
            <p className="text-3xl font-bold text-gray-900">{stats.capacity}</p>
          </div>
          
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 hover:shadow-xl transition text-white">
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <IndianRupee className="w-6 h-6 text-white" />
              </div>
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-sm text-white/90 font-semibold mb-1">Total Revenue</p>
            <p className="text-3xl font-bold">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-5 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search packages by title, destination, or category..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-gray-700 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Packages Grid */}
        {currentPackages.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-4 border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {searchQuery ? 'No matching packages' : 'No packages yet'}
            </h3>
            <p className="text-gray-600 text-lg">
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Your approved packages will appear here'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {currentPackages.map((pkg) => {
                const occupancyRate = (pkg.joinedUsers.length / pkg.maxPeople) * 100;
                return (
                  <div
                    key={pkg._id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 border-transparent hover:border-purple-200"
                  >
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-5 text-white relative overflow-hidden">
                      <div className="absolute inset-0 bg-black opacity-10"></div>
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-2">
                          <div className="inline-flex items-center px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-xs font-bold">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            LIVE
                          </div>
                          <Clock className="w-4 h-4 opacity-75" />
                        </div>
                        <h3 className="text-xl font-bold line-clamp-2 mb-1">{pkg.title}</h3>
                        <p className="text-white/80 text-xs">{getTimeAgo(pkg.updatedAt)}</p>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Info Grid */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-semibold">Destination</p>
                            <p className="text-gray-900 font-bold truncate">{pkg.destination}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                            <Tag className="w-4 h-4 text-pink-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-semibold">Category</p>
                            <p className="text-gray-900 font-bold">{pkg.category}</p>
                          </div>
                        </div>

                        <div className="flex items-center text-sm">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Calendar className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 font-semibold">Duration</p>
                            <p className="text-gray-900 font-bold text-xs">
                              {formatDate(pkg.startDate)} - {formatDate(pkg.endDate)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Price & Capacity */}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-3 border border-emerald-200">
                          <p className="text-xs text-emerald-700 font-semibold mb-1">Price</p>
                          <p className="text-xl font-bold text-emerald-900">₹{pkg.price.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                          <p className="text-xs text-blue-700 font-semibold mb-1">Capacity</p>
                          <p className="text-xl font-bold text-blue-900">{pkg.joinedUsers.length}/{pkg.maxPeople}</p>
                        </div>
                      </div>

                      {/* Occupancy Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-semibold mb-2">
                          <span className="text-gray-600">Occupancy</span>
                          <span className={occupancyRate >= 80 ? 'text-green-600' : occupancyRate >= 50 ? 'text-yellow-600' : 'text-gray-600'}>
                            {occupancyRate.toFixed(0)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              occupancyRate >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 
                              occupancyRate >= 50 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : 
                              'bg-gradient-to-r from-gray-400 to-gray-500'
                            }`}
                            style={{ width: `${occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => {
                          setSelectedPackage(pkg);
                          setShowModal(true);
                        }}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition shadow-lg hover:shadow-xl"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        View Full Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-xl bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition border-2 border-gray-200"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-700" />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-5 py-3 rounded-xl font-bold transition ${
                        currentPage === i + 1
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xl scale-110'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow-lg border-2 border-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-xl bg-white shadow-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition border-2 border-gray-200"
                >
                  <ChevronRight className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            )}
          </>
        )}

        {showModal && selectedPackage && (
          <PackageDetailsModal
            pkg={selectedPackage}
            onClose={() => {
              setShowModal(false);
              setSelectedPackage(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default VendorApprovedPackages;