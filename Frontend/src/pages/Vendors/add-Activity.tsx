import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FormBuilder,
  type FieldConfig,
} from "@/components/Modular/FormBuilderComponent";
import { createActivity } from "@/services/Activity/ActivityService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { ActivitySchema } from "@/Types/vendor/Package/Activity";
import { useState } from "react";

type ActivityForm = z.infer<typeof ActivitySchema>;

export function AddActivity() {
  const [activityId, setActivityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const notifySuccess = () => toast.success("Activity added successfully!");
  const notifyError = (msg: string) => toast.error(msg);

  const fields: FieldConfig[] = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter activity title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Enter activity description",
    },
    { name: "imageUrl", label: "Activity Image", type: "file" },
  ];

  const defaultValues = {
    title: "",
    description: "",
    imageUrl: null,
  };

  const handleSubmit = async (data: ActivityForm) => {
    if (!data.title || !data.description) {
      notifyError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = "";

      if (data.imageUrl instanceof File) {
        imageUrl = await uploadToCloudinary(data.imageUrl);
      } else if (
        Array.isArray(data.imageUrl) &&
        data.imageUrl[0] instanceof File
      ) {
        imageUrl = await uploadToCloudinary(data.imageUrl[0]);
      } else {
        notifyError("Please select a valid image file");
        return;
      }

      const response = await createActivity({ ...data, imageUrl });

      const id = response?.id || response?.data?.id;
      if (id) {
        setActivityId(id);
        notifySuccess();
      } else {
        notifySuccess();
      }
    } catch (err: any) {
      console.error("Error creating activity:", err);
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Failed to create activity";

      notifyError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="bg-black text-white px-6 py-5 rounded-t-2xl">
          <h2 className="text-2xl font-bold">Create Activity</h2>
          <p className="text-sm text-gray-300 mt-1">
            Add a new activity to the system
          </p>
        </div>

        <div className="p-6">
          <FormBuilder<ActivityForm>
            schema={ActivitySchema}
            fields={fields}
            onSubmit={handleSubmit}
            submitLabel={loading ? "Creating..." : "Create Activity"}
            defaultValues={defaultValues}
            disabled={loading}
          />

          {activityId && (
            <div className="mt-6 p-4 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">
                    Activity Created Successfully!
                  </h3>
                  <div className="mt-1 text-sm text-green-700">
                    Activity ID: <span className="font-mono">{activityId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
