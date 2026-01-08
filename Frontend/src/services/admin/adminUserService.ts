import axiosInstance from "@/axios/instance";
import type { User } from "@/interface/userInterface";


export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}> => {
  const response = await axiosInstance.get("/api/admin/users", {
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
  const response = await axiosInstance.patch(`/api/admin/user/status/${userId}`, {
    status,
  });
  return response.data;
};
export const searchUser=async(query:string)=>{
  const response=await axiosInstance.get('/api/admin/user/search',{
    params: { q: query }
  })
  return response.data.data // Backend returns users in 'data' field

}