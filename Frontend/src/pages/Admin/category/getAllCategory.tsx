import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import {
  editCategory,
  getCategory,
  deleteCategory,
  searchCategory,
} from "@/services/category/categoryService";
import type { CategoryType } from "@/interface/categoryInterface";
import ReusableTable from "@/components/Modular/Table";
import { Edit, Trash } from "lucide-react";
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
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);

  const hasInitialized = useRef(false);
  const isLoadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCategories = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (isLoadingRef.current) return;

    try {
      isLoadingRef.current = true;
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getCategory(pageNum, 10);
      const fetchedCategories = response.categories || [];
      const total = Number(response?.totalCategories || 0);

      if (append) {
        setCategories((prev: CategoryType[]) => [...prev, ...fetchedCategories]);
      } else {
        setCategories(fetchedCategories);
      }

      setHasMore(pageNum < Math.ceil(total / 10));
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      isLoadingRef.current = false;
      setLoading(false);
      setLoadingMore(false);
    }
  }, [setCategories, setLoading]);

  /* ---------------- Search Categories ---------------- */
  const handleSearch = useCallback(
    async (query: string) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      setSearchQuery(query);

      searchTimeoutRef.current = setTimeout(async () => {
        if (!query.trim()) {
          setIsSearchMode(false);
          setPage(1);
          setHasMore(true);
          fetchCategories(1, false);
          return;
        }

        setIsSearchMode(true);
        setLoading(true);
        try {
          const response = await searchCategory(query);
          const searchResults = Array.isArray(response) ? response : [];
          setCategories(searchResults);
          setHasMore(false);
        } catch (error) {
          console.error("Search failed:", error);
          setCategories([]);
        } finally {
          setLoading(false);
        }
      }, 500);
    },
    [fetchCategories, setCategories, setLoading]
  );

  /* ---------------- Load More Categories ---------------- */
  const loadMoreCategories = useCallback(() => {
    if (!isSearchMode && hasMore && !isLoadingRef.current) {
      fetchCategories(page + 1, true);
    }
  }, [page, hasMore, isSearchMode, fetchCategories]);


  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchCategories(1, false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <ReusableTable data={categories} columns={columns} loading={false} />

      {/* Load More Button */}
      {!isSearchMode && hasMore && categories.length > 0 && !loading && (
        <div className="py-8 px-4 text-center border-t border-gray-100 bg-gray-50/30">
          <button
            onClick={loadMoreCategories}
            disabled={loadingMore}
            className={`group relative px-10 py-3 bg-black text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 font-semibold flex items-center gap-3 mx-auto overflow-hidden ${loadingMore ? "opacity-80 cursor-not-allowed" : ""
              }`}
          >
            {loadingMore ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full" />
                <span>Fetching Categories...</span>
              </>
            ) : (
              <>
                <span>Load More Categories</span>
                <svg className="w-4 h-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}

      {/* End of list message */}
      {!hasMore && categories.length > 0 && !isSearchMode && (
        <div className="p-8 text-center text-sm text-gray-500 bg-gray-50/30 border-t border-gray-100 italic">
          You've reached the end of the category list
        </div>
      )}

      {/* No results message */}
      {categories.length === 0 && !loading && (
        <div className="p-8 text-center text-gray-500">
          {searchQuery ? "No categories found matching your search" : "No categories available"}
        </div>
      )}

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

    </div>
  );
};
