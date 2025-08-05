import type React from "react";
import { useState } from "react";
import { Upload, X } from "lucide-react";
import { addCategory } from "@/services/category/categoryService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import type { Category } from "@/interface/categoryInterface";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MainCategorySelect from "@/components/category/categorymapping";
import SubCategory from "@/components/category/subCategory";

export const CategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [typeMain, setTypeMain] = useState("");
  const [typeSub, setTypeSub] = useState<string[]>([]);

  const notify = () => toast("Category added ");
  const notifyTwo = () => toast("Category Added failed");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) setImagePreview(e.target.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !description || !image || !typeMain) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(image);

      const category: Category = {
        name,
        description,
        imageUrl,
        type: {
          main: typeMain,
          sub: typeSub,
        },
      };

      await addCategory(category);
      notify();

      setName("");
      setDescription("");
      setImage(null);
      setImagePreview("");
      setTypeMain("");
      setTypeSub([]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        notifyTwo();
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="relative bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent mb-2">
              Add Category
            </h1>
            <p className="text-slate-400">
              Create a new category for your collection
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <ToastContainer position="top-right" autoClose={3000} />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Category Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter category name"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter category description"
                rows={3}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-300">
                Category Image *
              </label>
              {!imagePreview ? (
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600/50 rounded-xl bg-slate-900/30">
                    <Upload className="w-6 h-6 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-400">
                      Click to upload image
                    </p>
                    <p className="text-xs text-slate-500">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-xl border border-slate-600/50"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <MainCategorySelect typeMain={typeMain} setTypeMain={setTypeMain} />

            <SubCategory
              typeMain={typeMain}
              typeSub={typeSub}
              setTypeSub={setTypeSub}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl font-semibold disabled:opacity-50 transition-all"
            >
              {loading ? "Creating..." : "Create Category"}
            </button>

            {error && (
              <div className="p-3 bg-red-500/20 text-red-300 text-sm rounded-md border border-red-500/30">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
