import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { CategoryType } from "@/interface/categoryInterface";
import { AdminRoutes, ADMIN_ROUTES_BASE } from "@/constants/apiRoutes";

export const addCategory = async (data: CategoryType) => {
  console.log("addCategory service triggered with data:", data);
  try {
    const res = await axiosInstance.post(`${ADMIN_ROUTES_BASE}${AdminRoutes.CREATE_CATEGORY}`, data);
    console.log("addCategory service response:", res.data);
    return res.data;
  } catch (error) {
    console.error("error adding category in service:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "failed to add Category");
    }
    throw new Error("An unexpected error occured while adding category");
  }
};

export const getCategory = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  categories: CategoryType[];
  totalCategories: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const res = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.GET_ALL_CATEGORIES}`, {
      params: { page, limit },
    });
    return {
      categories: res.data.data.categories,
      totalCategories: res.data.totalCategories,
      totalPages: res.data.totalPages,
      currentPage: res.data.currentPage,
    };

  } catch (error) {
    if (isAxiosError(error)) {

      throw new Error(
        error.response?.data?.error || "Failed to fetch categories"
      );
    }
    throw new Error("An unexpected error occurred while fetching categories");
  }
};

export const editCategory = async (id: string, updatedData: CategoryType) => {
  try {
    const res = await axiosInstance.put(`${ADMIN_ROUTES_BASE}${AdminRoutes.EDIT_CATEGORY.replace(":categoryId", id)}`, updatedData);

    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to edit category");
    }
    throw new Error("Unexpected error while editing category");
  }
};
export const deleteCategory = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`${ADMIN_ROUTES_BASE}${AdminRoutes.DELETE_CATEGORY.replace(":categoryId", id)}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to delete category");
    }
    throw new Error("Failed to delete category");
  }
};
export const searchCategory = async (query: string) => {
  try {
    const response = await axiosInstance.get(`${ADMIN_ROUTES_BASE}${AdminRoutes.SEARCH_CATEGORY}`, {
      params: { q: query },
    });

    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to search category");
    }
    throw new Error("Failed to search category");
  }
};

