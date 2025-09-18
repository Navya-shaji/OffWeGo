import { z } from "zod";
import { toast } from "react-toastify";
import { FormBuilder, type FieldConfig } from "@/components/Modular/FormBuilderComponent";
import { createActivity } from "@/services/Activity/ActivityService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { ActivitySchema } from "@/Types/vendor/Package/Activity";
import { useState } from "react";

type ActivityForm = z.infer<typeof ActivitySchema>;

export function AddActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  
  const notifySuccess = () => toast.success("✅ Activity created successfully! 🎉");
  const notifyError = (msg: string) => toast.error(`❌ ${msg}`);

  const fields: FieldConfig[] = [
    { name: "title", label: "Title", type: "text", placeholder: "Enter title" },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter description",
    },
    { name: "imageUrl", label: "Image", type: "file" },
  ];

  const defaultValues = {
    title: "",
    description: "",
    imageUrl: null,
  };

  const handleSubmit = async (data: ActivityForm) => {
    try {
      let imageUrl = "";

      // Handle image upload
      if (data.imageUrl instanceof File) {
        imageUrl = await uploadToCloudinary(data.imageUrl);
      } else if (Array.isArray(data.imageUrl) && data.imageUrl[0] instanceof File) {
        imageUrl = await uploadToCloudinary(data.imageUrl[0]);
      } else {
        notifyError("No valid file provided for upload");
        return;
      }

      // Create activity
      const response = await createActivity({ ...data, imageUrl });
      
      const id = response?.id || response?.data?.id;
      if (id) {
        setActivityId(id);
        notifySuccess(); // Show success toast
      } else {
        notifyError("Failed to create activity. Please try again.");
      }
    } catch (err: any) {
      console.error("Error creating activity:", err);
      
      // Handle different error scenarios
      const errorMessage = 
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Error creating activity";
      
      notifyError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add Activity</h2>

      <FormBuilder<ActivityForm>
        schema={ActivitySchema}
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Create Activity"
        defaultValues={defaultValues}
      />

      {activityId && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800 text-sm">
            Activity created successfully! ID: {activityId}
          </p>
        </div>
      )}
    </div>
  );
}