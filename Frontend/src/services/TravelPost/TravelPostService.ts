import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";
import type {
  CreateTravelPostPayload,
  TravelPost,
  TravelPostFilters,
  TravelPostListResponse,
} from "@/interface/TravelPost";

type FetchTravelPostsParams = {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  categoryId?: string;
  destinationId?: string;
  search?: string;
};

type FetchMyTravelPostsParams = {
  page?: number;
  limit?: number;
  status?: "PENDING" | "APPROVED" | "REJECTED";
  categoryId?: string;
  destinationId?: string;
  search?: string;
};



type GetSavedTravelPostsParams = {
  page?: number;
  limit?: number;
};

export const fetchTravelPosts = async (
  params: FetchTravelPostsParams = {}
): Promise<TravelPostListResponse> => {
  try {
    console.log("🔍 API Call - Fetching posts with params:", params);
    const response = await axiosInstance.get("/api/posts", {
      params,
    });

    console.log("🔍 API Response - Raw data:", response.data);
    const payload = response.data || {};

    // Check if we have posts and if filtering is applied
    const posts = (payload.data as TravelPost[]) ?? [];
    const hasFilters = params.categoryId || params.destinationId || params.search;
    
    console.log("🔍 API Debug - Posts before filtering:", posts);
    console.log("🔍 API Debug - Has filters:", hasFilters);
    
    // If we have filters, check if any posts match
    if (hasFilters && posts.length > 0) {
      console.log("🔍 API Debug - Checking post category IDs:");
      posts.forEach(post => {
        console.log(`  - Post "${post.title}" categoryId: "${post.categoryId}"`);
        console.log(`    Matches selected "${params.categoryId}": ${post.categoryId === params.categoryId}`);
      });
    }

    const result = {
      data: posts,
      total: typeof payload.total === "number" ? payload.total : posts.length,
      page: typeof payload.page === "number" ? payload.page : params.page ?? 1,
      limit: typeof payload.limit === "number" ? payload.limit : params.limit ?? 10,
    };
    
    console.log("🔍 API Result - Processed:", result);
    return result;
  } catch (error) {
    console.error("🔍 API Error:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load travel stories"
      );
    }

    throw new Error("Unexpected error while loading travel stories");
  }
};

export const createTravelPost = async (
  payload: CreateTravelPostPayload
): Promise<TravelPost> => {
  try {
    const response = await axiosInstance.post("/api/posts", payload);
    return response.data?.data ?? response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to submit travel story"
      );
    }

    throw new Error("Unexpected error while submitting travel story");
  }
};

export const fetchTravelPostFilters = async (): Promise<TravelPostFilters> => {
  try {
    console.log("🔍 Filters API - Fetching categories and destinations");
    const response = await axiosInstance.get("/api/posts/categories");
    console.log("🔍 Filters API - Raw response:", response.data);
    const payload = response.data?.data ?? {};

    const result = {
      categories: payload.categories ?? [],
      destinations: payload.destinations ?? [],
      totalCategories: payload.totalCategories ?? (payload.categories?.length ?? 0),
      totalDestinations:
        payload.totalDestinations ?? (payload.destinations?.length ?? 0),
    };
    
    console.log("🔍 Filters API - Processed result:", result);
    return result;
  } catch (error) {
    console.error("🔍 Filters API - Error:", error);
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load travel story filters"
      );
    }

    throw new Error("Unexpected error while loading travel story filters");
  }
};

export const fetchMyTravelPosts = async (
  params: FetchMyTravelPostsParams = {}
): Promise<TravelPostListResponse> => {
  try {
    const response = await axiosInstance.get("/api/posts/my", {
      params,
    });

    const payload = response.data || {};

    return {
      data: (payload.data as TravelPost[]) ?? [],
      total: typeof payload.total === "number" ? payload.total : 0,
      page: typeof payload.page === "number" ? payload.page : params.page ?? 1,
      limit: typeof payload.limit === "number" ? payload.limit : params.limit ?? 10,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load your travel stories"
      );
    }

    throw new Error("Unexpected error while loading your travel stories");
  }
};

export const getPostBySlug = async (
  slug: string
): Promise<{ data: TravelPost & { isSaved?: boolean } }> => {
  try {
    const response = await axiosInstance.get(`/api/posts/${slug}`);
    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load travel post"
      );
    }

    throw new Error("Unexpected error while loading travel post");
  }
};

export const trackPostView = async (
  postId: string
): Promise<{ views: number }> => {
  try {
    const response = await axiosInstance.post(`/api/posts/${postId}/view`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to track post view"
      );
    }

    throw new Error("Unexpected error while tracking post view");
  }
};

export const toggleSavePost = async (
  postId: string
): Promise<{ saved: boolean; likes: number }> => {
  try {
    const response = await axiosInstance.post(`/api/posts/${postId}/save`);
    return response.data.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to toggle save"
      );
    }

    throw new Error("Unexpected error while toggling save");
  }
};

export const getSavedTravelPosts = async (
  params: GetSavedTravelPostsParams = {}
): Promise<TravelPostListResponse> => {
  try {
    const response = await axiosInstance.get("/api/posts/saved", {
      params,
    });

    const payload = response.data || {};

    return {
      data: (payload.data as TravelPost[]) ?? [],
      total: typeof payload.total === "number" ? payload.total : 0,
      page: typeof payload.page === "number" ? payload.page : params.page ?? 1,
      limit: typeof payload.limit === "number" ? payload.limit : params.limit ?? 10,
    };
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to load saved travel stories"
      );
    }

    throw new Error("Unexpected error while loading saved travel stories");
  }
};
