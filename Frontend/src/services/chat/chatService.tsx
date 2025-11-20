import { isAxiosError } from "axios";
import axiosInstance from "@/axios/instance";

export interface ChatMessage {
  _id?: string;
  senderId: string;
  receiverId: string;
  senderRole: string;
  receiverRole: string;
  message: string;
  createdAt: Date;
}

export interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  senderRole: string;
  receiverRole: string;
  message: string;
}

export const sendMessage = async (
  data: SendMessagePayload
): Promise<ChatMessage> => {
  try {
    const res = await axiosInstance.post("/api/chat/send", data);
    console.log(res.data);
    return res.data?.data || res.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to send message");
    }
    throw new Error("An unexpected error occurred while sending message");
  }
};


export const getMessages = async (
  senderId: string,
  role: "user" | "vendor" = "user"
): Promise<ChatMessage[]> => {
  try {
    const endpoint =
      role === "vendor"
        ? `/api/vendor/chat/${senderId}`
        : `/api/chat/${senderId}`;

    const res = await axiosInstance.get(endpoint);
    console.log(`✅ Fetched ${role} chat messages:`, res.data);

    return res.data?.data || [];
  } catch (error) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch messages");
    }
    throw new Error("An unexpected error occurred while fetching messages");
  }
};
