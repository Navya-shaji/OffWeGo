import { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Check, 
  X, 
  Clock, 
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  Tag,
  Building2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { getBuddyTravelPackages, updateBuddyPackageStatus } from '@/services/BuddyTravel/buddytravelService';

const IncomingBuddyRequests = ({ filter = 'pending'}) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(filter);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setStatusFilter(filter);
    setCurrentPage(1);
    setSearchQuery('');
  }, [filter]);

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const apiStatus = statusFilter.toUpperCase();
      const data = await getBuddyTravelPackages(apiStatus);
      setRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError(error.message || 'Failed to load requests');
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (requestId, newStatus, notes = '') => {
    try {
      setUpdatingId(requestId);

      await updateBuddyPackageStatus(requestId, newStatus === 'approved' ? 'approve' : 'reject');

      setShowModal(false);
      setSelectedRequest(null);
      
      await fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert(error.message || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Pending Review' },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: Check, label: 'Approved' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: X, label: 'Rejected' }
    };
    
    const badge = badges[statusLower] || badges.pending;
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-4 h-4 mr-1" />
        {badge.label}
      </span>
    );
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.destination?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays === 0) {
      return diffHours === 0 ? 'Just now' : `${diffHours}h ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return formatDate(dateString);
    }
  };

  const RequestDetailsModal = ({ request, onClose }) => {
    const [reviewNotes, setReviewNotes] = useState(request?.reviewNotes || '');

    if (!request) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{request.title}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Submitted {getTimeAgo(request.createdAt)}
                  </span>
                  {getStatusBadge(request.status)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition ml-4"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {request.vendorId && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-indigo-600" />
                  Vendor Information
                </h3>
                <div className="text-sm">
                  <span className="text-gray-600">Vendor ID:</span>
                  <p className="font-medium text-gray-900 font-mono">{request.vendorId}</p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Package Description</h3>
              <p className="text-gray-600 leading-relaxed">{request.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                  Category
                </h3>
                <p className="text-gray-900 font-medium">{request.category}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-indigo-600" />
                  Destination
                </h3>
                <p className="text-gray-900 font-medium">{request.destination}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
                  Price per Person
                </h3>
                <p className="text-gray-900 font-medium text-lg">₹{request.price.toLocaleString()}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-indigo-600" />
                  Maximum Capacity
                </h3>
                <p className="text-gray-900 font-medium text-lg">{request.maxPeople} people</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  Start Date
                </h3>
                <p className="text-gray-900 font-medium">{formatDate(request.startDate)}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-600" />
                  End Date
                </h3>
                <p className="text-gray-900 font-medium">{formatDate(request.endDate)}</p>
              </div>
            </div>

            {request.status?.toLowerCase() !== 'pending' && request.reviewNotes && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-blue-900 mb-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Review Notes
                </h3>
                <p className="text-blue-800 text-sm">{request.reviewNotes}</p>
              </div>
            )}

            {request.status?.toLowerCase() === 'pending' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Review Notes (Optional)
                </label>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add any notes or feedback for the vendor..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows="3"
                />
              </div>
            )}

            {request.status?.toLowerCase() === 'pending' && (
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleStatusUpdate(request._id, 'approved', reviewNotes)}
                  disabled={updatingId === request._id}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingId === request._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Approve & Publish
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleStatusUpdate(request._id, 'rejected', reviewNotes)}
                  disabled={updatingId === request._id}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingId === request._id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <X className="w-5 h-5 mr-2" />
                      Reject Request
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const stats = {
    pending: requests.filter(r => r.status?.toLowerCase() === 'pending').length,
    approved: requests.filter(r => r.status?.toLowerCase() === 'approved').length,
    rejected: requests.filter(r => r.status?.toLowerCase() === 'rejected').length,
    total: requests.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading incoming requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Requests</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchRequests}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Buddy Travel Requests
          </h1>
          <p className="text-gray-600">
            {statusFilter === 'pending' && 'Review and approve vendor-submitted buddy travel packages'}
            {statusFilter === 'approved' && 'View all approved buddy travel packages'}
            {statusFilter === 'rejected' && 'View all rejected buddy travel packages'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <TrendingUp className="w-10 h-10 text-indigo-600 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <Check className="w-10 h-10 text-green-600 opacity-80" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Rejected</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <X className="w-10 h-10 text-red-600 opacity-80" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by title, destination, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {currentRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No requests found
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? 'Try adjusting your search'
                : `No ${statusFilter} requests available yet`}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {currentRequests.map((request) => (
                <div
                  key={request._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 flex-1 pr-2 line-clamp-2">
                        {request.title}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                      <Building2 className="w-4 h-4" />
                      <span className="font-medium truncate font-mono text-xs">{request.vendorId}</span>
                      <span className="text-gray-400">•</span>
                      <span>{getTimeAgo(request.createdAt)}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {request.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                        <span className="truncate">{request.destination}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                        {request.category}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-indigo-600 flex-shrink-0" />
                        {formatDate(request.startDate)} - {formatDate(request.endDate)}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center text-gray-600">
                          <DollarSign className="w-4 h-4 mr-1 text-indigo-600" />
                          ₹{request.price.toLocaleString()}
                        </span>
                        <span className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-1 text-indigo-600" />
                          Max {request.maxPeople}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowModal(true);
                        }}
                        className="flex-1 flex items-center justify-center px-4 py-2 bg-indigo-50 text-indigo-600 font-medium rounded-lg hover:bg-indigo-100 transition"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </button>
                      
                      {request.status?.toLowerCase() === 'pending' && (
                        <div className="flex gap-2">
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                handleStatusUpdate(request._id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                            disabled={updatingId === request._id}
                            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <option value="">Change Status</option>
                            <option value="approved">✓ Approve</option>
                            <option value="rejected">✕ Reject</option>
                          </select>
                          
                          {updatingId === request._id && (
                            <div className="flex items-center px-3">
                              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === i + 1
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}

        {showModal && (
          <RequestDetailsModal
            request={selectedRequest}
            onClose={() => {
              setShowModal(false);
              setSelectedRequest(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default IncomingBuddyRequests;