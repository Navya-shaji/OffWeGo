import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  );
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const limit = 5;

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      if (query.trim()) {
        const response = await searchActivity(query);
        setActivities(response ?? []);
        setTotalPages(1);
      } else {
        const response = await getActivities(page, limit);
        setActivities(response.activities);
        const total = Number(response?.totalActivities || 0);
        setTotalPages(Math.ceil(total / limit));
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  }, [page, limit, query]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

const handleEdit = (activity: Activity) => {
  setSelectedActivity(activity);   // ✅ sets the activity object
  setFormData({
    title: activity.title,
    description: activity.description,
    imageUrl: activity.imageUrl,
   
  });
  setIsEditModalOpen(true);
  console.log("Editing:", activity);
};


  console.log("activities",activities)
const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  console.log("Selected Activity:", selectedActivity);  // ✅ check if it has _id

  if (!selectedActivity?._id) {
    return toast.error("Invalid ID");  // will trigger if no _id
  }

  try {
    await updateActivity(selectedActivity._id, formData);
    setActivities((prev) =>
      prev.map((act) =>
        act._id === selectedActivity._id ? { ...act, ...formData } : act
      )
    );
    toast.success("Activity updated successfully");
    setIsEditModalOpen(false);
    setSelectedActivity(null); // ✅ clear after success
  } catch (err) {
    console.error(err);
    toast.error("Failed to update activity");
  }
};



  const handleDelete = async (activityId?: string) => {
    console.log("activityId",activityId)
    if (!activityId) return toast.error("Invalid ID");
    if (!window.confirm("Delete this activity?")) return;

    try {
      await deleteActivity(activityId);
      setActivities((prev) => prev.filter((act) => act.activityId !== activityId));
      toast.success("Activity deleted successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete activity");
    }
  };

  const handleSearch = async (q: string) => {
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
        cell: ({ row }) => {
          const act = row.original;
          return (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleEdit(act)}
                className="p-2 hover:bg-blue-50 rounded-lg"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => handleDelete(act._id)}
                className="p-2 hover:bg-red-50 rounded-lg"
              >
                <Trash size={16} />
              </button>
            </div>
          );
        },
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
          <SearchBar
            placeholder="Search Activities..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading activities...</p>
      ) : (
        <ReusableTable data={activities} columns={columns} />
      )}

      {isEditModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Activity</h3>
            <form onSubmit={handleUpdate}>
              <input
                className="border p-2 w-full mb-2"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Title"
              />
              <textarea
                className="border p-2 w-full mb-2"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Description"
              />
              <input
                className="border p-2 w-full mb-2"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
                placeholder="Image URL"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!query && (
        <div className="mt-4 flex justify-center">
          <Pagination total={totalPages} current={page} setPage={setPage} />
        </div>
      )}
    </div>
  );
};

export default ActivitiesTable;
