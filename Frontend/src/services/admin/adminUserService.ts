import axiosInstance from "@/axios/instance";
import type { User } from "@/interface/userInterface";
import { AdminRoutes, ADMIN_BASE } from "@/constants/apiRoutes";


export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}> => {
  const response = await axiosInstance.get(`${ADMIN_BASE}${AdminRoutes.GET_ALL_USERS}`, {
    params: { page, limit },
  });

  return {
    users: response.data.data, // Backend returns users in 'data' field
    totalUsers: response.data.totalUsers,
    totalPages: response.data.totalPages,
    currentPage: response.data.currentPage,
  };
};
export const updateUserStatus = async (
  userId: string,
  status: "active" | "blocked") => {
  const response = await axiosInstance.patch(`${ADMIN_BASE}${AdminRoutes.UPDATE_USER_STATUS.replace(":id", userId)}`, {
    status,
  });
  return response.data;
};
export const searchUser = async (query: string) => {
  const response = await axiosInstance.get(`${ADMIN_BASE}${AdminRoutes.SEARCH_USER}`, {
    params: { q: query }
  })
  return response.data.data // Backend returns users in 'data' field

}