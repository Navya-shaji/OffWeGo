import React, { useEffect, useState } from "react";
import ReusableTable from "@/components/Modular/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { getActivities } from "@/services/Activity/ActivityService"; 
import { toast } from "react-toastify";

export interface Activity {
  activityId?: string;
  title: string;
  description: string;
  destinationId?: string;
  imageUrl: string;
}

const ActivitiesTable: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await getActivities();
      console.log("Activities API Response:", response.data);

      const activityData = response.data.data || response.data || [];
      setActivities(activityData);
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error("Failed to load activities");
    } finally {
      setLoading(false);
    }
  };
console.log(fetchActivities)
  useEffect(() => {
    fetchActivities();
  }, []);

  const columns: ColumnDef<Activity>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
    },
   
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
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert(`Edit activity: ${row.original.activityId}`)}
          >
            Edit
          </Button>
          {/* <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.original.activityId)}
          >
            Delete
          </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Activities List</h2>
      {loading ? (
        <p>Loading activities...</p>
      ) : (
        <ReusableTable data={activities} columns={columns} />
      )}
    </div>
  );
};

export default ActivitiesTable;
