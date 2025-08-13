import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { deleteActivity, getActivities, updateActivity } from "@/services/Activity/ActivityService";
import { toast, ToastContainer } from "react-toastify";
import { Edit, Trash } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export interface Activity {
  _id:string,
  activityId?: string;
  title: string;
  description: string;
  destinationId?: string;
  imageUrl: string;
}
const ActivitiesTable: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", imageUrl: "" });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      const activityData = response?.data?.data || [];
      setActivities(Array.isArray(activityData) ? activityData : []);
    } catch (error) {
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);


  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description,
      imageUrl: activity.imageUrl,
    });
    setIsEditModalOpen(true);
  };


const handleUpdate = async () => {
  if (!selectedActivity?._id) return toast.error("Invalid ID");

  try {
    await updateActivity(selectedActivity._id, formData);


    setActivities(prev =>
      prev.map(act =>
        act._id === selectedActivity._id ? { ...act, ...formData } : act
      )
    );

    toast.success("Activity updated successfully");
    setIsEditModalOpen(false);
  } catch {
    toast.error("Failed to update activity");
  }
};

const handleDelete = async (_id?: string) => {
  if (!_id) return toast.error("Invalid ID");
  if (!window.confirm("Delete this activity?")) return;

  try {
    await deleteActivity(_id);

    setActivities(prev => prev.filter(act => act._id !== _id));

    toast.success("Activity deleted successfully");
  } catch (err) {
    console.error(err);
    toast.error("Failed to delete activity");
  }
};


  const columns: ColumnDef<Activity>[] = [
    { accessorKey: "title", header: "Title" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "imageUrl",
      header: "Image",
      cell: ({ row }) => (
        <img src={row.original.imageUrl} alt={row.original.title} className="h-12 w-12 object-cover rounded" />
      ),
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const act = row.original;
        return (
          <div className="flex items-center space-x-2">
            <button onClick={() => handleEdit(act)} className="p-2 hover:bg-blue-50 rounded-lg">
              <Edit size={16} />
            </button>
            <button onClick={() => handleDelete(act._id)} className="p-2 hover:bg-red-50 rounded-lg">
              <Trash size={16} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-xl font-bold mb-4">Activities List</h2>

      {loading ? <p>Loading activities...</p> : <ReusableTable data={activities} columns={columns} />}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Edit Activity</h3>
            <input
              className="border p-2 w-full mb-2"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title"
            />
            <textarea
              className="border p-2 w-full mb-2"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description"
            />
        
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-blue-500 text-white rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ActivitiesTable