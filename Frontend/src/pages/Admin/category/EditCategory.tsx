import React, { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!typeMain.trim()) {
      newErrors.typeMain = "Main type is required";
    }

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
        if (e.target?.result) {
          setImagePreview(e.target.result as string);
        }
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

    if (!validateForm()) {
      return;
    }

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
    <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Edit Category</h2>
          <button
            onClick={onClose}
            disabled={isSubmitDisabled}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category name"
              disabled={isSubmitDisabled}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter category description"
              disabled={isSubmitDisabled}
            />
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Image
            </label>

            <div className="space-y-3">
              {imagePreview && (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Category preview"
                    className="h-24 w-32 object-cover rounded-lg border border-gray-300"
                  />
                  {imageFile && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isSubmitDisabled}
                />
                <div
                  className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors ${
                    isSubmitDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }`}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    {isUploading
                      ? "Uploading..."
                      : "Click to upload new image or drag and drop"}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG up to 5MB
                  </p>
                </div>
              </div>
            </div>
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>

          <div>
            <MainCategorySelect typeMain={typeMain} setTypeMain={setTypeMain} />
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

        
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitDisabled}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="px-6 py-2 bg-black text-white rounded-lg blak:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitDisabled && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
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
        </form>
      </div>
    </div>
  );
};

export default EditCategory;
