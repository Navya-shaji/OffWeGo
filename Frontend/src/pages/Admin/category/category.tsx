import type React from "react";
import { useState } from "react";
import {  X } from "lucide-react";
import { addCategory } from "@/services/category/categoryService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import type { CategoryType } from "@/interface/categoryInterface";
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

      const category: CategoryType = { 
        name,
        description,
        imageUrl,
        type: {
          main: typeMain,
          sub: typeSub
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
   <div className="flex items-center justify-center pt-10">
  <div className="w-full max-w-3xl bg-white border border-black rounded-xl shadow-lg">
    
    <div className="bg-black text-white rounded-t-xl px-6 py-4">
      <h1 className="text-2xl font-bold">Add New Category</h1>
      <p className="text-sm text-blue-300">Create and manage your product categories</p>
    </div>

    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

     
      <div>
        <label className="block text-sm font-semibold text-black mb-1">
          Category Name *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="e.g. Electronics"
        />
      </div>

     
      <div>
        <label className="block text-sm font-semibold text-black mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          rows={3}
          placeholder="Short description of the category"
        />
      </div>

      
      <div>
        <label className="block text-sm font-semibold text-black mb-1">
          Category Image *
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
      </div>

    
      <MainCategorySelect typeMain={typeMain} setTypeMain={setTypeMain} />
      <SubCategory typeMain={typeMain} typeSub={typeSub} setTypeSub={setTypeSub} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-3 px-6 rounded-md font-semibold hover:bg-gray-900 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Add Category"}
      </button>

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-100 border border-red-300 rounded-md">
          {error}
        </div>
      )}
    </form>
  </div>
</div>

  );
};
