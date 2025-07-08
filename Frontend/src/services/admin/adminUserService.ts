import axiosInstance from "@/axios/instance";
import type { User } from "@/interface/userInterface";

export const getAllUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/admin/users");
  return response.data.users; 
};

export const updateUserStatus = async (
  userId: string,
  status: "active" | "blocked"
) => {
  const response = await axiosInstance.patch(`/admin/user/status/${userId}`, {
    status,
  });
  return response.data;
};