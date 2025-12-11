import axiosInstance from "@/axios/instance";
import { isAxiosError } from "axios";

export const getMessages = async (chatId: string, userType: 'user' | 'vendor' = 'user') => {
  try {
    // Use different endpoints for user vs vendor
    const endpoint = userType === 'vendor' 
      ? `/api/vendor/chat/messages/${chatId}`
      : `/api/chat/messages/${chatId}`;
    const res = await axiosInstance.get(endpoint);
    return res.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch messages");
    }
    throw new Error("Unexpected error while fetching messages");
  }
};

export const findOrCreateChat = async (userId: string, otherId: string, userType: 'user' | 'vendor' = 'user') => {
  try {
    // Use different endpoints for user vs vendor
    const endpoint = userType === 'vendor' 
      ? "/api/vendor/chat/send"
      : "/api/chat/send";
    const res = await axiosInstance.post(endpoint, {
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

export const getChatsOfUser = async (userId: string, userType: 'user' | 'vendor' = 'user') => {
  try {
    // Use different endpoints for user vs vendor
    const endpoint = userType === 'vendor' 
      ? `/api/vendor/chat/${userId}?userType=vendor`
      : `/api/chat/${userId}?userType=user`;
    const res = await axiosInstance.get(endpoint);
    return res.data;
  } catch (error) {
    console.error("Error fetching user chats:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch chats");
    }
    throw new Error("Unexpected error while fetching chats");
  }
};

export const markMessagesAsSeen = async (chatId: string, userId: string, userType: 'user' | 'vendor' = 'user') => {
  try {
    // Use different endpoints for user vs vendor
    const endpoint = userType === 'vendor' 
      ? "/api/vendor/chat/messages/mark-seen"
      : "/api/chat/messages/mark-seen";
    const res = await axiosInstance.post(endpoint, {
      chatId,
      userId,
      userType
    });
    return res.data;
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to mark messages as seen");
    }
    throw new Error("Unexpected error while marking messages as seen");
  }
};

