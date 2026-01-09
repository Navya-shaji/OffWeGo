import type React from "react";
import { useState } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CategorySchema,
  type CategoryFormData,
} from "@/Types/Admin/category/categoryzodSchema";
import { addCategory as addCategoryService } from "@/services/category/categoryService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import type { CategoryType } from "@/interface/categoryInterface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainCategorySelect from "@/components/category/categorymapping";
import SubCategory from "@/components/category/subCategory";

import { useCategoryContext } from "@/contexts/CategoryContext";

interface CategoryFormProps {
  onCategoryCreated?: (newCategory: CategoryType) => void;
}

export const CategoryForm = ({ onCategoryCreated }: CategoryFormProps = {}) => {
  const { addCategory } = useCategoryContext();
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
  });

  const notify = () => toast.success("Category added ");
  const notifyTwo = () => toast.error("Category add failed");

  const typeMain = watch("typeMain");
  const typeSub = watch("typeSub");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImagePreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const removeImage = () => {
    setImagePreview("");
  };

  const onSubmit = async (data: CategoryFormData) => {
    setLoading(true);

    try {
      const imageUrl = await uploadToCloudinary(data.image);

      const category: CategoryType = {
        id: '', // Will be set by backend
        name: data.name,
        description: data.description,
        imageUrl,
        type: {
          main: data.typeMain,
          sub: data.typeSub || [],
        },
      };

      const result = await addCategoryService(category);
      notify();

      // Add the new category to the context state
      const newCategory = { ...category, id: Date.now().toString() }; // Fallback ID
      addCategory(newCategory);

      // Call the callback if provided
      if (onCategoryCreated) {
        onCategoryCreated(newCategory);
      }

      reset();
      setImagePreview("");
    } catch (err) {
      console.error(err);
      notifyTwo();
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <ToastContainer position="top-right" autoClose={3000} />

          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Category Name 
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g. family trip"
            />
            {errors.name && (
              <p className="text-red-600 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Description 
            </label>
            <textarea
              {...register("description")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              rows={3}
              placeholder="Short description of the category"
            />
            {errors.description && (
              <p className="text-red-600 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-1">
              Category Image 
            </label>
            {!imagePreview ? (
              <div className="relative border border-gray-300 rounded-md bg-gray-100 h-32 flex items-center justify-center text-gray-500 text-sm cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                Click to upload image (JPG/PNG)
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
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.image && (
              <p className="text-red-600 text-sm">{errors.image.message}</p>
            )}
          </div>

          <MainCategorySelect
            typeMain={typeMain}
            setTypeMain={(val) => setValue("typeMain", val)}
          />
          <SubCategory
            typeMain={typeMain}
            typeSub={typeSub || []}
            setTypeSub={(val) => {
              const newValue =
                typeof val === "function" ? val(typeSub || []) : val;
              setValue("typeSub", newValue);
            }}
          />
          {errors.typeMain && (
            <p className="text-red-600 text-sm">{errors.typeMain.message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-900 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Add Category"}
          </button>
        </form>
      </div>
    </div>
  );
};
