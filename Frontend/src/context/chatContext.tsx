import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { io, Socket } from 'socket.io-client';
import { getChatsOfUser, getMessages, findOrCreateChat } from '@/services/chat/chatService';
import { getAllVendorsForUsers } from '@/services/vendor/vendorService';
import type { IChat } from '@/interface/ChatInterface';
import type { Vendor } from '@/interface/vendorInterface';
import type { Imessage } from '@/interface/MessageInterface';
import toast from 'react-hot-toast';

interface ChatContextType {
  chats: IChat[];
  vendors: Vendor[];
  messages: Imessage[];
  currentChat: IChat | null;
  loading: boolean;
  error: string | null;
  fetchChats: () => Promise<void>;
  fetchVendors: () => Promise<void>;
  selectChat: (userId: string, otherId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  isTyping: boolean;
  setIsTyping: (typing: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Determine role based on route first, then auth state
  const isVendorRoute = window.location.pathname.startsWith('/vendor');
  const user = useSelector((state: RootState) => state.auth.user);
  const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);

  // If on vendor route, prefer vendor auth. If on user route, prefer user auth.
  const currentUser = isVendorRoute ? vendor : user;
  const currentUserId = currentUser?.id;
  const isVendor = isVendorRoute && !!vendor;

  const [chats, setChats] = useState<IChat[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [messages, setMessages] = useState<Imessage[]>([]);
  const [currentChat, setCurrentChat] = useState<IChat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!currentUserId) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '') || 'http://localhost:3000';
    const userToken = localStorage.getItem('userToken');
    const vendorToken = localStorage.getItem('vendorToken');
    const token = userToken || vendorToken;

    console.log('🔌 Connecting socket for user:', currentUserId);

    const newSocket = io(socketUrl, {
      withCredentials: true,
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    newSocket.on('connect', () => {
      console.log('✅ Socket connected:', newSocket.id);
      newSocket.emit('register_user', { userId: currentUserId });
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket error:', err.message);
    });

    newSocket.on('receive-message', (msg: Imessage) => {
      console.log('📨 Received message:', msg);
      if (currentChat && msg.chatId === currentChat._id) {
        setMessages((prev) => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
      fetchChats();
    });

    setSocket(newSocket);

    return () => {
      console.log('🔌 Disconnecting socket');
      newSocket.disconnect();
    };
  }, [currentUserId]);

  const fetchChats = useCallback(async () => {
    if (!currentUserId) return;
    try {
      setLoading(true);
      const result = await getChatsOfUser(currentUserId);

      let chatData = [];
      if (result.data && Array.isArray(result.data)) {
        chatData = result.data;
      } else if (Array.isArray(result)) {
        chatData = result;
      } else if (result.chats) {
        chatData = result.chats;
      }

      const processedChats = chatData.map((chat: any) => {
        if (chat.userId && chat.vendorId) {
          // Determine which participant is "me" and which is "other"
          let otherParticipant;

          // Check if I'm the user in this chat
          if (chat.userId._id.toString() === currentUserId.toString()) {
            otherParticipant = chat.vendorId;
          }
          // Check if I'm the vendor in this chat
          else if (chat.vendorId._id.toString() === currentUserId.toString()) {
            otherParticipant = chat.userId;
          }
          // Fallback (shouldn't happen)
          else {
            console.warn('Chat does not belong to current user:', chat);
            return null;
          }

          return {
            _id: otherParticipant._id,  // This is the OTHER user's ID (for navigation)
            chatId: chat._id,            // This is the actual chat document ID
            name: otherParticipant.name,
            profile_image: otherParticipant.profileImage || otherParticipant.imageUrl || "",
            lastMessage: chat.lastMessage,
            lastMessageAt: chat.lastMessageAt,
            isOnline: false
          };
        }
        return chat;
      }).filter(Boolean); // Remove any null entries

      setChats(processedChats);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching chats:", err);
      setError(err.message);
      setLoading(false);
    }
  }, [currentUserId]);

  const fetchVendors = useCallback(async () => {
    if (isVendor) return;
    try {
      const vendorsData = await getAllVendorsForUsers();
      const approvedVendors = vendorsData.filter((v: Vendor) =>
        v.status === 'approved' && !v.isBlocked
      );
      setVendors(approvedVendors);
    } catch (err: any) {
      console.error("Error fetching vendors:", err);
    }
  }, [isVendor]);

  const selectChat = useCallback(async (myId: string, otherId: string) => {
    try {
      console.log('🔍 selectChat called:', { myId, otherId, currentUserId, isVendor });
      setLoading(true);

      // Determine which ID is the user and which is the vendor
      // The backend expects: userId = actual user ID, ownerId = vendor ID
      let actualUserId: string;
      let actualVendorId: string;

      if (isVendor) {
        // If I'm a vendor, then myId is vendorId and otherId is userId
        actualUserId = otherId;
        actualVendorId = myId;
      } else {
        // If I'm a user, then myId is userId and otherId is vendorId
        actualUserId = myId;
        actualVendorId = otherId;
      }

      console.log('📞 Calling findOrCreateChat with:', { actualUserId, actualVendorId });
      const chatData = await findOrCreateChat(actualUserId, actualVendorId);

      console.log('📦 Chat data received:', chatData);

      if (!chatData?._id) throw new Error("Invalid chat data");

      let mappedChat = { ...chatData };
      if (chatData.userId && chatData.vendorId) {
        // Safe string comparison handling both string IDs and objects
        const chatUserIdStr = (chatData.userId._id || chatData.userId).toString();
        const myIdStr = myId.toString();

        const isMyUser = chatUserIdStr === myIdStr;
        const otherParticipant = isMyUser ? chatData.vendorId : chatData.userId;

        mappedChat.name = otherParticipant.name || "Unknown";
        mappedChat.profile_image = otherParticipant.profileImage || otherParticipant.imageUrl || "";

        console.log('👤 Other participant:', mappedChat.name);
      }

      setCurrentChat(mappedChat);

      const response = await getMessages(chatData._id);
      const msgs = response.data?.messages || response.messages || [];

      console.log('💬 Messages loaded:', msgs.length, 'messages');
      setMessages(msgs);

      if (socket && socket.connected) {
        socket.emit("join_room", { roomId: chatData._id, userId: myId });
        console.log('🚪 Joined room:', chatData._id);
      } else {
        console.warn('⚠️ Socket not connected, cannot join room');
      }

      setLoading(false);
    } catch (err: any) {
      console.error("❌ Error selecting chat:", err);
      // Extract the error message safe for display
      const errorMessage = err.message || err.response?.data?.message || "Failed to load chat";
      toast.error(errorMessage);
      setLoading(false);
    }
  }, [socket, currentUserId, isVendor]);

  const sendMessage = useCallback(async (content: string) => {
    if (!currentChat?._id || !currentUserId) {
      console.error('Cannot send: missing chat or user ID');
      return;
    }

    if (!socket || !socket.connected) {
      console.error('Socket not connected!');
      toast.error("Connection lost. Please refresh the page.");
      return;
    }

    const c = currentChat as any;
    const chatUserId = c.userId?._id || c.userId;
    const chatVendorId = c.vendorId?._id || c.vendorId;

    let receiverId = "";
    if (chatUserId && chatVendorId) {
      receiverId = chatUserId === currentUserId ? chatVendorId : chatUserId;
    } else {
      console.error("Cannot determine receiver ID");
      toast.error("Unable to send message");
      return;
    }

    const newMessage: Imessage = {
      _id: "",
      chatId: currentChat._id!,
      messageContent: content,
      senderId: currentUserId,
      senderType: isVendor ? "vendor" : "User", // Matches backend enum ['User', 'user', 'vendor']
      receiverId: receiverId,
      seen: false,
      sendedTime: new Date(),
      messageType: "text",
    };

    console.log('📤 Sending message:', newMessage);

    socket.emit("send_message", newMessage, (id: string) => {
      console.log('✅ Message sent with ID:', id);
      setMessages((prev) => [...prev, { ...newMessage, _id: id }]);
      fetchChats();
    });
  }, [currentChat, currentUserId, isVendor, socket, fetchChats]);

  useEffect(() => {
    if (currentUserId) {
      fetchChats();
      if (!isVendor) {
        fetchVendors();
      }
    }
  }, [currentUserId, isVendor, fetchChats, fetchVendors]);

  return (
    <ChatContext.Provider value={{
      chats,
      vendors,
      messages,
      currentChat,
      loading,
      error,
      fetchChats,
      fetchVendors,
      selectChat,
      sendMessage,
      isTyping,
      setIsTyping
    }}>
      {children}
    </ChatContext.Provider>
  );
};
