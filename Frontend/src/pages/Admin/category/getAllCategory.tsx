import { useCallback, useEffect, useState, useMemo } from "react";
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
import toast from "react-hot-toast";
import { SearchBar } from "@/components/Modular/searchbar";
import { DeleteConfirmationModal } from "./DeleteConfirmation";
import { useCategoryContext } from "@/contexts/CategoryContext";

interface CellInfo<T> {
  getValue?: () => unknown;
  row?: { original: T };
}

export const CategoryTable = () => {
  const { categories, setCategories, removeCategory, loading, setLoading } = useCategoryContext();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCategory(page, 5);
      setCategories(response.categories || []);
      const total = Number(response?.totalCategories || 0);
      setTotalPages(Math.ceil(total / 5));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, [page, setCategories, setLoading]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.trim()) {
        try {
          setLoading(true);
          const response = await searchCategory(searchQuery);
          setCategories(response || []);
          setTotalPages(1);
          setPage(1);
        } catch (error) {
          console.error("Search failed:", error);
          setCategories([]);
          setTotalPages(1);
        } finally {
          setLoading(false);
        }
      } else {
        fetchCategories();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, page, fetchCategories, setCategories, setLoading]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
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

      // Immediately remove the deleted category from the context state
      removeCategory(categoryToDelete.id);

      setIsDeleteConfirmOpen(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to delete category";
      toast.error(errorMessage);
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

      setCategories((prevCategories: CategoryType[]) =>
        prevCategories.map((cat: CategoryType) =>
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
  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDelete = (category: CategoryType) => {
    setCategoryToDelete(category);
    setIsDeleteConfirmOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "imageUrl",
        header: "Image",
        cell: (info: CellInfo<CategoryType>) => {
          const imageUrl = info.getValue
            ? String(info.getValue())
            : "/placeholder-image.png";

          return (
            <img
              src={imageUrl || "/placeholder-image.png"}
              alt="category"
              className="h-10 w-16 object-cover rounded"
              onError={(e) => {
                e.currentTarget.src = "/placeholder-image.png";
              }}
            />
          );
        },
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

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Category Listing</h1>
      </div>

      <div className="flex justify-end mb-4">
        <div className="w-60">
          <SearchBar
            placeholder="Search categories..."
            onSearch={handleSearch}
          />
        </div>
      </div>

      <ReusableTable data={categories} columns={columns} loading={loading} />

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
