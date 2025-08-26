import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  editCategory,
  getCategory,
  deleteCategory,
  searchCategory,
} from "@/services/category/categoryService";
import type { CategoryType } from "@/interface/categoryInterface";
import ReusableTable from "@/components/Modular/Table";
import { Edit, Trash } from "lucide-react";
import Pagination from "@/components/pagination/pagination";
import EditCategory from "./EditCategory";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchBar } from "@/components/Modular/searchbar";

interface CellInfo<T> {
  getValue?: () => unknown;
  row?: { original: T };
}

// ✅ Inline Delete Confirmation Modal (inside same file)
interface DeleteModalProps {
  isOpen: boolean;
  category?: CategoryType | null;
  onCancel: () => void;
  onConfirm: () => void;
  loading: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteModalProps> = ({
  isOpen,
  category,
  onCancel,
  onConfirm,
  loading,
}) => {
  if (!isOpen || !category) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Confirm Delete
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete the category "
            <span className="font-medium">{category.name}</span>"? This action
            cannot be undone.
          </p>

          <div className="flex justify-end space-x-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoryTable = () => {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategory(page, 5);

      setCategory(response.categories || []);
      const total = Number(response?.totalCategories || 0);
      const newTotalPages = Math.ceil(total / 5);
      setTotalPages((prev) => (prev !== newTotalPages ? newTotalPages : prev));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchCategories();
    }
  }, [page, searchQuery, fetchCategories]);

  // ✅ handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await searchCategory(query);
      setCategory(response || []);
      setTotalPages(1);
      setPage(1);
    } catch (error) {
      console.error("Error during search:", error);
      setCategory([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory({ ...category });
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete?.id) {
      toast.error("Invalid category selected");
      return;
    }

    try {
      setLoading(true);
      await deleteCategory(categoryToDelete.id);
      toast.success("Category deleted successfully");

      if (searchQuery.trim()) {
        await handleSearch(searchQuery);
      } else {
        await fetchCategories();
      }

      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete category");
    } finally {
      setLoading(false);
    }
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setCategoryToDelete(null);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleCategoryUpdate = async (updatedCategory: CategoryType) => {
    if (!updatedCategory?.id) {
      toast.error("Missing category ID");
      return;
    }

    try {
      setLoading(true);
      await editCategory(updatedCategory.id, updatedCategory);
      toast.success("Category updated successfully");

      setCategory((prevCategories) =>
        prevCategories.map((cat) =>
          cat.id === updatedCategory.id ? updatedCategory : cat
        )
      );

      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update category");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Memoized columns
  const columns = useMemo(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info: CellInfo<CategoryType>) => (
          <img
            src={info.getValue ? String(info.getValue()) : ""}
            alt="category"
            className="h-10 w-16 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-image.png";
            }}
          />
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: (info: CellInfo<CategoryType>) => (
          <span className="font-medium">
            {info.getValue ? String(info.getValue()) : ""}
          </span>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: (info: CellInfo<CategoryType>) => (
          <span className="text-sm text-gray-600 max-w-xs truncate block">
            {info.getValue ? String(info.getValue()) : ""}
          </span>
        ),
      },
      {
        header: "Type",
        cell: (info: CellInfo<CategoryType>) => (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {info.row?.original.type?.main || "No Type"}
          </span>
        ),
      },
      {
        header: "Sub Types",
        cell: (info: CellInfo<CategoryType>) => {
          const sub = info.row?.original.type?.sub;
          const subTypes = Array.isArray(sub)
            ? sub.join(", ")
            : typeof sub === "string"
            ? sub
            : "";

          return (
            <span className="text-sm text-gray-600 max-w-xs truncate block">
              {subTypes || "No subtypes"}
            </span>
          );
        },
      },
      {
        header: "Actions",
        cell: (info: CellInfo<CategoryType>) => {
          const category = info.row?.original;
          if (!category) return null;

          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="p-2 hover:bg-blue-100 rounded-md transition-colors"
                title="Edit Category"
                disabled={loading}
              >
                <Edit size={16} className="text-blue-600" />
              </button>
              <button
                onClick={() => handleDelete(category)}
                className="p-2 hover:bg-red-100 rounded-md transition-colors"
                title="Delete Category"
                disabled={loading}
              >
                <Trash size={16} className="text-red-600" />
              </button>
            </div>
          );
        },
      },
    ],
    [loading]
  );

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Category Listing</h1>
      </div>

      <div className="flex justify-end mb-4">
        <div className="w-60">
          <SearchBar placeholder="Search categories..." onSearch={handleSearch} />
        </div>
      </div>

      <ReusableTable data={category} columns={columns} loading={loading} />

      {isEditModalOpen && selectedCategory && (
        <EditCategory
          category={selectedCategory}
          onClose={handleModalClose}
          onSubmit={handleCategoryUpdate}
          loading={loading}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        category={categoryToDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        loading={loading}
      />

      <Pagination total={totalPages} current={page} setPage={setPage} />
    </div>
  );
};
