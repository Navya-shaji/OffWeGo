import axiosInstance from "@/axios/instance";

// FIXED: Properly unwrap the response data
export const findOrCreateChat = async (userId: string, ownerId: string) => {
  try {
    console.log('Calling findOrCreateChat with:', { userId, ownerId });
    
    const response = await axiosInstance.post('/api/chat/find-or-create', {
      userId,
      ownerId
    });
    
    console.log('Raw API response:', response);
    console.log('Response data:', response?.data);
    
    if (!response?.data) {
      throw new Error('No response data from server');
    }
    
    // Handle nested response structure: { success: true, data: chat }
    if (response.data?.success && response.data?.data) {
      console.log('Returning chat data from response.data.data');
      return response.data.data; // Returns the actual chat object
    }
    
    // If data is already at the top level (has _id field)
    if (response.data?._id) {
      console.log('Returning chat data from response.data');
      return response.data;
    }
    
    console.error('Unexpected response format:', response.data);
    throw new Error(`Invalid response format: ${JSON.stringify(response.data)}`);
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error response:', error?.response);
    console.error('Error message:', error?.message);
    console.error('Error code:', error?.code);
    
    // Network error (no response from server)
    if (!error?.response) {
      const message = error?.message || 'Network error - server not responding';
      console.error('Network error details:', message);
      throw new Error(message);
    }
    
    // Server responded with an error
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    
    // Generic error
    throw new Error(error?.message || 'Failed to start chat');
  }
};

export const getChatsOfUser = async (userId: string) => {
  try {
    console.log('Calling getChatsOfUser with:', { userId });
    
    const response = await axiosInstance.get(`/api/chat/${userId}`);
    console.log('Raw API response:', response);
    console.log('Response data:', response?.data);
    
    if (!response || !response.data) {
      throw new Error('No response from server');
    }
    
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
    const response = await axiosInstance.get(`/api/chat/messages/${chatId}`);
    return response.data;
  } catch (error) {
    console.log('Error while getting messages:', error);
    throw error;
  }
};

export const enableChat = async (userId: string, ownerId: string) => {
  try {
    const response = await axiosInstance.post(`/api/chat/enable-chat`, { userId, ownerId });
    return response.data;
  } catch (error) {
    console.log('Error while enabling chat:', error);
    throw error;
  }
};