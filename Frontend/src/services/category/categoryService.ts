import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { CategoryType } from "@/interface/categoryInterface";

export const addCategory = async (data: CategoryType) => {
  try {
    console.log("Sending category data:", data);
    const res = await axiosInstance.post("/api/admin/create-categories", data);
    console.log(res);
    return res.data;
  } catch (error) {
    console.error("error adding category", error);
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
    const res = await axiosInstance.get("/api/admin/categories", {
      params: { page, limit },
    });
    return {
      categories: res.data.categories,
      totalCategories: res.data.totalCategories,
      totalPages: res.data.totalPages,
      currentPage: res.data.currentPage,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("err");
      throw new Error(
        error.response?.data?.error || "Failed to fetch categories"
      );
    }
    throw new Error("An unexpected error occurred while fetching categories");
  }
};

export const editCategory = async (id: string, updatedData: CategoryType) => {
  try {
    const res = await axiosInstance.put(`/api/admin/category/${id}`, updatedData);
    console.log(res)
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
    const response = await axiosInstance.delete(`/api/admin/category/${id}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to edit category");
    }
    throw new Error("Failed to delete category");
  }
};