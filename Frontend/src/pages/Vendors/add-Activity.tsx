import { z } from "zod";
import { toast } from "react-toastify";
import { FormBuilder, type FieldConfig } from "@/components/Modular/FormBuilderComponent"; 
import { createActivity } from "@/services/Activity/ActivityService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { ActivitySchema } from "@/Types/vendor/Package/Activity";
import { useEffect, useState } from "react";

type ActivityForm = z.infer<typeof ActivitySchema>;

export function AddActivity() {

  const [activityId, setActivityId] = useState<string | null>(null);

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

      if (data.imageUrl instanceof File) {
        imageUrl = await uploadToCloudinary(data.imageUrl);
      } else if (Array.isArray(data.imageUrl) && data.imageUrl[0] instanceof File) {
        imageUrl = await uploadToCloudinary(data.imageUrl[0]);
      }

      const response = await createActivity({ ...data, imageUrl });

      const id = response?.id || response?.data?.id;
      if (id) {
        setActivityId(id);
      }

      toast.success("Activity created successfully 🎉");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Error creating activity");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Add Activity</h2>
      {activityId && (
        <p className="text-green-600 mb-4">Activity ID: {activityId}</p>
      )}
      <FormBuilder<ActivityForm>
        schema={ActivitySchema}
        fields={fields}
        onSubmit={handleSubmit}
        submitLabel="Create Activity"
        defaultValues={defaultValues}
      />
    </div>
  );
}