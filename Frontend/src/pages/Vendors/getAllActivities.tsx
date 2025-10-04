import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  deleteActivity,
  getActivities,
  updateActivity,
  searchActivity,
} from "@/services/Activity/ActivityService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload"; 
import { toast, ToastContainer } from "react-toastify";
import { Edit, Trash, X, Upload } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/pagination/pagination";
import { SearchBar } from "@/components/Modular/searchbar";
import type { Activity } from "@/interface/PackageInterface";

const ActivitiesTable: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [originalActivities, setOriginalActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const limit = 5;

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout>(null);

  const normalizeActivity = useCallback((activity:Activity): Activity => ({
    ...activity,
    id:  activity.id || activity.activityId,
    imageUrl: activity.imageUrl || "",
  }), []);

  // Load activities function - Fixed to match your service structure
  const loadActivities = useCallback(async (pageNum: number = 1) => {
    if (isLoadingRef.current) return;
    
    try {
      isLoadingRef.current = true;
      setLoading(true);
      setError("");
      
      const response = await getActivities(pageNum, limit);
      
      if (!response || typeof response !== 'object') {
        throw new Error('Invalid response from server');
      }

      const activitiesList = Array.isArray(response.activities) ? response.activities : [];
      const normalized = activitiesList.map(normalizeActivity);

      setActivities(normalized);
      setOriginalActivities(normalized);
      setTotalPages(Math.max(response.totalPages || 1, 1));
      setTotalActivities(response.totalActivities || normalized.length);
      setPage(pageNum);
      
    } catch (err) {
      console.error("Error loading activities:", err);
      const  errorMessage = "Failed to load activities";
      setError(errorMessage);
      setActivities([]);
      setOriginalActivities([]);
      toast.error(errorMessage);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
    }
  }, [normalizeActivity]);

  const handleSearch = useCallback(async (query: string) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    setSearchQuery(query);

    searchTimeoutRef.current = setTimeout(async () => {
      if (!query.trim()) {
        setIsSearchMode(false);
        setActivities(originalActivities);
        setTotalPages(Math.ceil(totalActivities / limit));
        setPage(1);
        return;
      }

      setIsSearchMode(true);
      try {
        setLoading(true);
        const response = await searchActivity(query);
        
        if (!response || typeof response !== 'object') {
          throw new Error('Invalid search response');
        }

        const searchResults = Array.isArray(response.activities) ? response.activities : [];
        const normalized = searchResults.map(normalizeActivity);
        
        setActivities(normalized);
        setTotalPages(Math.max(Math.ceil(normalized.length / limit), 1));
        setPage(1);
        
      } catch (err) {
       if (err instanceof Error)
        console.error("Search error:", err);
        const errorMessage = "Search failed";
        setError(errorMessage);
        setActivities([]);
        setTotalPages(1);
        toast.error(errorMessage);
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [originalActivities, totalActivities, normalizeActivity]);

  const handlePageChange = useCallback((newPage: number) => {
    if (newPage === page || newPage < 1 || newPage > totalPages) return;
    
    setPage(newPage);
    
    if (!isSearchMode) {
      loadActivities(newPage);
    }
  }, [page, totalPages, isSearchMode, loadActivities]);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      loadActivities(1);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [loadActivities]);

  const getCurrentPageData = useMemo(() => {
    if (!isSearchMode) {
      return activities;
    } else {
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      return activities.slice(startIndex, endIndex);
    }
  }, [activities, page, limit, isSearchMode]);

  const getUrlFromImgTag = useCallback((html: string): string => {
    if (!html) return "";
    const match = html.match(/src="([^"]+)"/);
    return match ? match[1] : html;
  }, []);

  const handleEdit = useCallback((activity: Activity) => {
    if (!activity) {
      toast.error("Invalid activity data");
      return;
    }

    const normalizedActivity = normalizeActivity(activity);
    
    setSelectedActivity(normalizedActivity);
    setFormData({
      title: normalizedActivity.title || "",
      description: normalizedActivity.description || "",
      imageUrl: normalizedActivity.imageUrl || "",
    });
    
    const imageUrl = getUrlFromImgTag(normalizedActivity.imageUrl || "");
    setImagePreview(imageUrl);
    setNewImageFile(null);
    setIsEditModalOpen(true);
  }, [normalizeActivity, getUrlFromImgTag]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }

      setNewImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.onerror = () => {
        toast.error("Failed to read image file");
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedActivity?.id) {
      toast.error("Invalid activity ID");
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error("Title and description are required");
      return;
    }

    setIsUpdating(true);
    try {
      let finalImageUrl = formData.imageUrl;
      
      if (newImageFile) {
        try {
          finalImageUrl = await uploadToCloudinary(newImageFile);
        } catch  {
          toast.error("Failed to upload image. Please try again.");
          setIsUpdating(false);
          return;
        }
      }

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        imageUrl: finalImageUrl,
      };

      const response = await updateActivity(selectedActivity.id, updateData);
      
      const updatedActivity = response?.data ? normalizeActivity(response.data) : { ...selectedActivity, ...updateData };
      
      toast.success("Activity updated successfully");

      const updateActivityInList = (list: Activity[]) =>
        list.map((act) =>
          act.id === selectedActivity.id ? updatedActivity : act
        );

      setActivities(updateActivityInList);
      if (!isSearchMode) {
        setOriginalActivities(updateActivityInList);
      }

      setIsEditModalOpen(false);
      setSelectedActivity(null);
      setNewImageFile(null);
      setImagePreview("");
      setFormData({ title: "", description: "", imageUrl: "" });
      
    } catch (err) {
      if (err instanceof Error)
      console.error("Update error:", err);
      
      const  errorMessage = "Failed to update activity";
      setError(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsUpdating(false);
    }
  }, [selectedActivity, formData, newImageFile, isSearchMode, normalizeActivity]);

  const handleDeleteClick = useCallback((activity: Activity) => {
    if (!activity) {
      toast.error("Invalid activity data");
      return;
    }

    setActivityToDelete(normalizeActivity(activity));
    setIsDeleteModalOpen(true);
  }, [normalizeActivity]);

  const confirmDelete = useCallback(async () => {
    if (!activityToDelete?.id) {
      toast.error("Invalid activity ID");
      return;
    }

    try {
      await deleteActivity(activityToDelete.id);
      toast.success("Activity deleted successfully");

      const updatedActivities = activities.filter(
        (act) => act.id !== activityToDelete.id
      );
      const updatedOriginalActivities = originalActivities.filter(
        (act) => act.id !== activityToDelete.id
      );

      setActivities(updatedActivities);
      if (!isSearchMode) {
        setOriginalActivities(updatedOriginalActivities);
        setTotalActivities(prev => Math.max(prev - 1, 0));
        setTotalPages(Math.max(Math.ceil((totalActivities - 1) / limit), 1));
        
        if (updatedActivities.length === 0 && page > 1) {
          setPage(page - 1);
          loadActivities(page - 1);
        }
      } else {
        setTotalPages(Math.max(Math.ceil(updatedActivities.length / limit), 1));
        
        if (updatedActivities.length > 0 && Math.ceil(updatedActivities.length / limit) < page) {
          setPage(Math.ceil(updatedActivities.length / limit));
        }
      }
      
    } catch (err) {
      if (err instanceof Error)
      console.error("Delete error:", err);
      
      const  errorMessage = "Failed to delete activity";  
      setError(errorMessage);
      toast.error(errorMessage);
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
    }
  }, [activityToDelete, activities, originalActivities, isSearchMode, totalActivities, page, loadActivities]);

  const columns: ColumnDef<Activity>[] = useMemo(
    () => [
      { 
        header: "#", 
        cell: ({ row }) => {
          const baseIndex = (page - 1) * limit;
          return baseIndex + row.index + 1;
        }
      },
      { 
        accessorKey: "title", 
        header: "Title",
        cell: ({ row }) => (
          <div className="font-medium text-gray-900" title={row.original.title}>
            {row.original.title}
          </div>
        )
      },
      { 
        accessorKey: "description", 
        header: "Description",
        cell: ({ row }) => (
          <div className="max-w-xs truncate text-gray-600" title={row.original.description}>
            {row.original.description}
          </div>
        )
      },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => {
          const imageUrl = getUrlFromImgTag(row.original.imageUrl);
          return (
            <img
              src={imageUrl || "/placeholder-activity.png"}
              alt={row.original.title}
              className="h-12 w-12 object-cover rounded border border-gray-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-activity.png";
              }}
            />
          );
        },
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit activity"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete activity"
            >
              <Trash size={16} />
            </button>
          </div>
        ),
      },
    ],
    [page, handleEdit, handleDeleteClick, getUrlFromImgTag]
  );

  // Loading state
  if (loading && activities.length === 0) {
    return (
      <div className="p-4">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading activities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Activities List</h2>
          <p className="text-sm text-gray-600 mt-1">
            {isSearchMode 
              ? `Found ${activities.length} activit${activities.length !== 1 ? 'ies' : 'y'} for "${searchQuery}"`
              : `${totalActivities} total activities`
            }
          </p>
        </div>

        <div className="w-full sm:w-60">
          <SearchBar
            placeholder="Search Activities..."
            onSearch={handleSearch}
            // value={searchQuery}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError("")}
              className="text-red-800 hover:text-red-900 ml-2"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {getCurrentPageData.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ReusableTable data={getCurrentPageData} columns={columns} />
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination 
                total={totalPages} 
                current={page} 
                setPage={handlePageChange}
              />
            </div>
          )}

          {/* Stats */}
          <div className="text-center text-sm text-gray-500">
            {isSearchMode 
              ? `Showing ${Math.min((page - 1) * limit + 1, activities.length)}-${Math.min(page * limit, activities.length)} of ${activities.length} search results`
              : `Showing ${Math.min((page - 1) * limit + 1, totalActivities)}-${Math.min(page * limit, totalActivities)} of ${totalActivities} activities`
            }
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="w-16 h-16 mx-auto mb-4 text-gray-300 text-6xl">
            🎯
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Activities Found
          </h3>
          <p className="text-gray-600">
            {searchQuery 
              ? `No activities match your search for "${searchQuery}"`
              : "No activities are available at the moment"
            }
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch("")}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Enhanced Edit Modal */}
      {isEditModalOpen && selectedActivity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Edit Activity
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isUpdating}
              >
                <X size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Activity title"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Activity description"
                  required
                  disabled={isUpdating}
                />
              </div>

              {/* Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                
                {/* Current/Preview Image */}
                {imagePreview && (
                  <div className="mb-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center space-x-2">
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUpdating}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                      isUpdating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <Upload size={16} />
                    Choose New Image
                  </label>
                  {newImageFile && (
                    <span className="text-sm text-green-600">
                      New image selected: {newImageFile.name}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Maximum file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating || !formData.title.trim() || !formData.description.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && activityToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="relative bg-white rounded-2xl shadow-2xl w-96 p-6">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
            >
              ✕
            </button>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Trash className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold mb-2 text-gray-800">
                Confirm Delete
              </h3>
              
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this activity?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                <p className="font-semibold text-red-800 text-lg">
                  {activityToDelete.title}
                </p>
                <p className="text-red-600 text-sm mt-1">
                  {activityToDelete.description}
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
                Delete Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivitiesTable;