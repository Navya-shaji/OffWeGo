import React, { useEffect, useState, useMemo } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  deleteActivity,
  getActivities,
  updateActivity,
  searchActivity,
} from "@/services/Activity/ActivityService";
import { toast, ToastContainer } from "react-toastify";
import { Edit, Trash } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Pagination from "@/components/pagination/pagination";
import { SearchBar } from "@/components/Modular/searchbar";
import type { Activity } from "@/interface/PackageInterface";

const ActivitiesTable: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 5;

  useEffect(() => {
    loadActivities();
  }, [page, query]);
const loadActivities = async () => {
  setLoading(true);
  try {
    let activitiesList: Activity[] = [];
    let total = 1;

    if (query.trim()) {
      const response = await searchActivity(query);
     

      activitiesList = response.activities ?? [];
      total = response.totalPages ?? 1;
    } else {
      const response = await getActivities(page, limit);
      console.log("Get activities response:", response);

      activitiesList = response.activities ?? [];
      total = response.totalPages ?? 1;
    }

    // Normalize activityId to _id for table consistency
    const normalized = activitiesList.map((act) => ({
      ...act,
      _id: act._id || act.activityId,
    }));

    setActivities(normalized);
    setTotalPages(total);
  } catch (err) {
    console.error(err);
    toast.error("Failed to load activities");
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (activity: Activity) => {
    setSelectedActivity({
      ...activity,
      _id: activity._id || activity.activityId,
    });

    setFormData({
      title: activity.title,
      description: activity.description,
      imageUrl: activity.imageUrl,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity?._id) return toast.error("Invalid ID");

    try {
      await updateActivity(selectedActivity._id, formData);
      toast.success("Activity updated successfully");
      setIsEditModalOpen(false);
      setSelectedActivity(null);
      await loadActivities(); // refresh table
    } catch (err) {
      console.error(err);
      toast.error("Failed to update activity");
    }
  };

  const handleDeleteClick = (activity: Activity) => {
    setActivityToDelete(activity);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!activityToDelete?._id) return toast.error("Invalid ID");

    try {
      await deleteActivity(activityToDelete._id);
      toast.success("Activity deleted successfully");
      setActivities((prev) =>
        prev.filter((act) => act._id !== activityToDelete._id)
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete activity");
    } finally {
      setIsDeleteModalOpen(false);
      setActivityToDelete(null);
    }
  };

  const handleSearch = (q: string) => {
    setQuery(q);
    setPage(1); 
  };

  const columns: ColumnDef<Activity>[] = useMemo(
    () => [
      { accessorKey: "title", header: "Title" },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => (
          <img
            src={row.original.imageUrl}
            alt={row.original.title}
            className="h-12 w-12 object-cover rounded"
          />
        ),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-2 hover:bg-blue-50 rounded-lg"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => handleDeleteClick(row.original)}
              className="p-2 hover:bg-red-50 rounded-lg"
            >
              <Trash size={16} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4">Activities List</h2>

      <div className="flex justify-end mb-4">
        <div className="w-60">
          <SearchBar placeholder="Search Activities..." onSearch={handleSearch} />
        </div>
      </div>

      {loading ? (
        <p>Loading activities...</p>
      ) : (
        <ReusableTable data={activities} columns={columns} />
      )}
{/* Edit Modal */}
{isEditModalOpen && selectedActivity && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-center">Edit Activity</h3>
      <form onSubmit={handleUpdate} className="space-y-3">
        <input
          className="border p-2 w-full rounded"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          placeholder="Title"
        />
        <textarea
          className="border p-2 w-full rounded"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Description"
        />
        <div className="flex justify-end gap-2 pt-3">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{/* Delete Modal */}
{isDeleteModalOpen && activityToDelete && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
    {/* Popup Content */}
    <div className="relative bg-white rounded-2xl shadow-2xl w-96 p-6 animate-scaleIn">
      {/* Close Button */}
      <button
        onClick={() => setIsDeleteModalOpen(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition"
      >
        ✕
      </button>

      <h3 className="text-xl font-bold mb-4 text-center text-gray-800">
        Confirm Delete
      </h3>
      <p className="text-center text-gray-600 mb-6">
        Are you sure you want to delete{" "}
        <span className="font-semibold text-red-600">
          {activityToDelete.title}
        </span>
        ?
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsDeleteModalOpen(false)}
          className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={confirmDelete}
          className="px-5 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}

      {/* Pagination */}
      {!query && (
        <div className="mt-4 flex justify-center">
          <Pagination total={totalPages} current={page} setPage={setPage} />
        </div>  
      )}
    </div>
  );
};

export default ActivitiesTable;
