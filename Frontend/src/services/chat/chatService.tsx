import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const getMessages = async (chatId: string) => {
  try {
    const res = await axiosInstance.get(`/api/chat/messages/${chatId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch messages");
    }
    throw new Error("Unexpected error while fetching messages");
  }
};

export const findOrCreateChat = async (userId: string, otherId: string) => {
  try {
    const res = await axiosInstance.post("/api/chat/send", {
      userId,
      ownerId: otherId,
    });
    // Return the full response structure: { success: true, data: { _id: "...", ... } }
    return res.data;
  } catch (error) {
    console.error("Error finding or creating chat:", error);
    if (isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || "Failed to find or create chat";
      console.error("Chat error details:", error.response?.data);
      throw new Error(errorMessage);
    }
    throw new Error("Unexpected error while finding or creating chat");
  }
};

export const getChatsOfUser = async (userId: string) => {
  try {
    const res = await axiosInstance.get(`/api/chat/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch chats");
    }
    throw new Error("Unexpected error while fetching chats");
  }
};

