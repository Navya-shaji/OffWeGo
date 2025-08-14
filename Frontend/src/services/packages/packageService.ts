import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type { Package } from "@/interface/PackageInterface";



export const addPackage = async (data: Package) => {
  try {
    const res = await axiosInstance.post("/api/vendor/add-Package", data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to add package");
    }
    throw new Error("An unexpected error occurred while adding destination");
  }
};

export const fetchAllPackages = async (
  page: number = 1,
  limit: number = 5
): Promise<{
  packages: Package[];
  totalPackages: number;
  totalPages: number;
  currentPage: number;
}> => {
  try {
    const res = await axiosInstance.get("/api/vendor/packages", {
      params: { page, limit }
    });

    const { packages, totalPackages, totalPages, currentPage } = res.data;

    if (!Array.isArray(packages)) {
      return {
        packages: [],
        totalPackages: 0,
        totalPages: 1,
        currentPage: 1
      };
    }

    return {
      packages,
      totalPackages,
      totalPages: totalPages ?? Math.ceil(totalPackages / limit),
      currentPage
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.error || "Failed to fetch packages");
    }
    throw new Error("An unexpected error occurred while fetching packages");
  }
};

export const editPackage = async (id: string, data: Package) => {
  try {
    const res = await axiosInstance.put(`/api/vendor/packages/${id}`, data);
    return res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update package"
      );
    }
    throw new Error("An unexpected error occurred while updating package");
  }
};

export const deletePackage = async (id: string): Promise<void> => {
  try {
    const response = await axiosInstance.delete(`/api/vendor/packages/${id}`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.error || "Failed to update package"
      );
    }
    throw new Error("An unexpected error occurred while updating package");
  }
};

export const searchPackages = async (query: string) => {
  const response = await axiosInstance.get("/api/vendor/packages/search", {
    params: { q: query },
  });
  return response.data.data;
};