import axiosInstance from "@/axios/instance";

// FIXED: Properly unwrap the response data
export const findOrCreateChat = async (userId: string, ownerId: string) => {
  try {
    const response = await axiosInstance.post('/api/chat/find-or-create', {
      userId,
      ownerId
    });
    
    console.log('Raw API response:', response.data);
    
    // Handle nested response structure
    if (response.data?.success && response.data?.data) {
      return response.data.data; // Returns the actual chat object
    }
    
    // If data is already at the top level
    if (response.data?._id) {
      return response.data;
    }
    
    throw new Error('Invalid response format from server');
  } catch (error) {
    console.error('Error in findOrCreateChat:', error);
    throw error;
  }
};

export const getChatsOfUser = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`api/chat/${userId}`);
    console.log(response.data,"chats from service")
    return response.data;
  } catch (error) {
    console.log('Error while getting chat:', error);
    throw error;
  }
};

// Message APIs
export const getMessages = async (chatId: string) => {
  console.log('Fetching messages for chatId:', chatId);
  try {
    const response = await axiosInstance.get(`api/chat/messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting messages:', error);
    throw error;
  }
};

export const enableChat = async (userId: string, ownerId: string) => {
  try {
    const response = await axiosInstance.post(`api/chat/enable-chat`, { userId, ownerId });
    return response.data;
  } catch (error) {
    console.log('Error while enabling chat:', error);
    throw error;
  }
};