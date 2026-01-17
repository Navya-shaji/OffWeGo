import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategorySchema,
  type CategoryFormData,
} from "@/Types/Admin/category/categoryzodSchema";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import type { CategoryType } from "@/interface/categoryInterface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainCategorySelect from "@/components/category/categorymapping";
import SubCategory from "@/components/category/subCategory";
import { addCategory } from "@/services/category/categoryService";

import { useCategoryContext } from "@/contexts/CategoryContext";

interface CategoryFormProps {
  onCategoryCreated?: (newCategory: CategoryType) => void;
}

export const CategoryForm = ({ onCategoryCreated }: CategoryFormProps = {}) => {
  const { addCategory: addCategoryToState } = useCategoryContext();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    mode: "onChange", // Optional: better UX for reactive validation
  });

  const typeMain = watch("typeMain");
  const typeSub = watch("typeSub");

  const notify = () => toast.success("Category added successfully!");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImagePreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("image", undefined as any, { shouldValidate: true });
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);
    try {
      const imageUrl = await uploadToCloudinary(data.image);
      const category: CategoryType = {
        name: data.name.trim(),
        description: data.description.trim(),
        imageUrl,
        type: {
          main: data.typeMain,
          sub: data.typeSub || [],
        },
      };

      console.log("Constructed category data:", category);
      console.log("Calling addCategory API...");
      const res = await addCategory(category);
      console.log("API Response received:", res);

      notify();

      if (res?.data) {
        console.log("Updating context state with new category:", res.data);
        addCategoryToState(res.data);
      }

      if (onCategoryCreated && res?.data) {
        console.log("Calling onCategoryCreated callback with:", res.data);
        onCategoryCreated(res.data);
      }

      // Reset form and UI state
      reset();
      setImagePreview("");
    } catch (err: any) {
      console.error("Category submission error:", err);
      toast.error(err.message || "Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-10">
      <div className="w-full max-w-3xl bg-white border border-black rounded-xl shadow-lg">
        <div className="bg-black text-white rounded-t-xl px-6 py-4">
          <h1 className="text-2xl font-bold">Add New Category</h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, (errs) => console.log("Form Errors:", errs))}
          className="p-6 space-y-6"
        >
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Category Name
            </label>
            <input
              type="text"
              {...register("name")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${errors.name ? "border-red-600" : "border-gray-300"
                }`}
              placeholder="e.g. family trip"
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-black ${errors.description ? "border-red-600" : "border-gray-300"
                }`}
              rows={3}
              placeholder="Short description of the category"
            />
            {errors.description && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Category Image
            </label>
            {!imagePreview ? (
              <div className="relative border border-gray-300 border-dashed rounded-md bg-gray-50 h-32 flex items-center justify-center text-gray-500 text-sm cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <p>Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG allowed</p>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow-md"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.image && (
              <p className="text-red-600 text-sm mt-1">{errors.image.message}</p>
            )}
          </div>

          {/* Category Mapping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <MainCategorySelect
                typeMain={typeMain}
                setTypeMain={(val) => setValue("typeMain", val, { shouldValidate: true })}
              />
              {errors.typeMain && (
                <p className="text-red-600 text-sm mt-1">{errors.typeMain.message}</p>
              )}
            </div>

            <SubCategory
              typeMain={typeMain}
              typeSub={typeSub || []}
              setTypeSub={(val) => {
                const newValue = typeof val === "function" ? val(typeSub || []) : val;
                setValue("typeSub", newValue, { shouldValidate: true });
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-900 disabled:opacity-50 transition-all active:scale-[0.98]"
          >
            {loading ? "Creating Category..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};
