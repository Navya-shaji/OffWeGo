import React, { useState, useEffect } from "react";
import { X, Upload, Image as ImageIcon, Tag } from "lucide-react";
import type { CategoryType } from "@/interface/categoryInterface";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import MainCategorySelect from "@/components/category/categorymapping";
import SubCategory from "@/components/category/subCategory";

interface Props {
  category: CategoryType;
  onClose: () => void;
  onSubmit: (updatedCategory: CategoryType) => void;
  loading?: boolean;
}

const EditCategory: React.FC<Props> = ({
  category,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CategoryType>(category);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    category.imageUrl || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [typeMain, setTypeMain] = useState<string>(category.type?.main || "");
  const [typeSub, setTypeSub] = useState<string[]>(
    Array.isArray(category.type?.sub)
      ? category.type.sub
      : category.type?.sub
      ? [category.type.sub]
      : []
  );

  useEffect(() => {
    setFormData(category);
    setImagePreview(category.imageUrl || "");
    setTypeMain(category.type?.main || "");
    setTypeSub(
      Array.isArray(category.type?.sub)
        ? category.type.sub
        : category.type?.sub
        ? [category.type.sub]
        : []
    );
  }, [category]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!typeMain.trim()) newErrors.typeMain = "Main type is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      type: {
        main: typeMain,
        sub: typeSub,
      },
    }));
    if (typeMain && errors.typeMain) {
      setErrors((prev) => ({ ...prev, typeMain: "" }));
    }
  }, [typeMain, typeSub, errors.typeMain]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please select a valid image file",
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      setImageFile(file);
      setErrors((prev) => ({ ...prev, image: "" }));

      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImagePreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(formData.imageUrl || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const updatedCategory = { ...formData };
      if (imageFile) {
        setIsUploading(true);
        try {
          const imageUrl = await uploadToCloudinary(imageFile);
          updatedCategory.imageUrl = imageUrl;
        } catch (error) {
          console.error(error);
          setErrors((prev) => ({
            ...prev,
            image: "Failed to upload image. Please try again.",
          }));
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }
      onSubmit(updatedCategory);
    } catch (error) {
      console.error("Submit error:", error);
    }
  };

  const isSubmitDisabled = loading || isUploading;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl overflow-hidden transform transition-all duration-300 scale-100">
        <div className="relative bg-gradient-to-r bg-gray-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 backdrop-blur-sm rounded-lg">
                <Tag className="w-4 h-4 text-black" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black">Edit Category</h2>
                <p className="text-black text-xs">Update category details</p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitDisabled}
              className="p-1 hover:bg-white/20 rounded-lg transition-all duration-200 group disabled:opacity-50"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Two Column Layout - No Scroll */}
        <form onSubmit={handleSubmit} className="p-5">
          <div className="grid grid-cols-5 gap-5">
            {/* Left Column - Image (2 columns) */}
            <div className="col-span-2 space-y-3">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                <ImageIcon className="w-3 h-3 text-blue-600" />
                Category Image
              </label>

              {imagePreview ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 group">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    <label
                      htmlFor="image-upload"
                      className="px-3 py-1.5 bg-white text-gray-900 rounded-lg text-xs font-medium cursor-pointer hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3 h-3" />
                      Change Image
                    </label>
                    {imageFile && (
                      <button
                        type="button"
                        onClick={removeImage}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center gap-1.5"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/30 transition-all duration-200 cursor-pointer group"
                >
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Upload className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-xs font-medium text-gray-700 mt-2">
                    {isUploading ? "Uploading..." : "Upload Image"}
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                </label>
              )}

              <input
                type="file"
                accept="image/*"
                id="image-upload"
                className="hidden"
                onChange={handleImageChange}
                disabled={isSubmitDisabled}
              />

              {errors.image && (
                <p className="text-red-500 text-xs">{errors.image}</p>
              )}
            </div>

            <div className="col-span-3 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 transition ${
                    errors.name ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter category name"
                  disabled={isSubmitDisabled}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className={`w-full px-3 py-2 text-sm border-2 rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-500 resize-none transition ${
                    errors.description ? "border-red-500" : "border-gray-200"
                  }`}
                  placeholder="Enter category description"
                  disabled={isSubmitDisabled}
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <MainCategorySelect
                  typeMain={typeMain}
                  setTypeMain={setTypeMain}
                />
                {errors.typeMain && (
                  <p className="text-red-500 text-xs mt-1">{errors.typeMain}</p>
                )}
              </div>

              <div>
                <SubCategory
                  typeMain={typeMain}
                  typeSub={typeSub}
                  setTypeSub={setTypeSub}
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitDisabled}
                  className="px-5 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 text-sm font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  className="px-5 py-2 bg-gradient-to-r bg-black  text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitDisabled && (
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                  )}
                  <span>
                    {loading
                      ? "Saving..."
                      : isUploading
                      ? "Uploading..."
                      : "Save Changes"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
