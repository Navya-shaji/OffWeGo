import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { socketContext } from '@/utilities/socket';
import { getMessages, findOrCreateChat, getChatsOfUser } from '@/services/chat/chatService';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { toast } from 'react-hot-toast';

interface Imessage {
    _id: string;
    chatId: string;
    senderId: string;
    requestID?: string;
    messageContent: string;
    messageType: string;
    sendedTime: Date;
    seen: boolean;
    senderType?: "User" | "vendor" | "user"; // Normalized later
    senderName?: string;
    receiverId?: string;
}

interface IChat {
    _id: string;
    name: string;
    profile_image: string;
    lastMessage: string;
    lastMessageAt: Date;
    isOnline: boolean;
    userId?: string;
    vendorId?: string;
    unreadCount?: number;
}

interface ChatContextType {
    messages: Imessage[];
    currentChat: IChat | null;
    loading: boolean;
    chats: IChat[];
    vendors: any[];
    error: string | null;
    isTyping: boolean;
    totalUnreadCount: number;
    unreadChatCount: number;
    markChatAsRead: (chatId: string) => void;
    sendMessage: (content: string) => Promise<void>;
    selectChat: (myId: string, otherId: string) => Promise<void>;
    fetchChats: () => Promise<void>;
    triggerSidebarRefetch: () => void;
}

// @ts-ignore
const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
    const socketContextValue = useContext(socketContext);
    const socket = socketContextValue?.socket ?? null;
    const [messages, setMessages] = useState<Imessage[]>([]);
    const [currentChat, setCurrentChat] = useState<IChat | null>(null);
    const [loading, setLoading] = useState(false);
    const [chats, setChats] = useState<IChat[]>([]);
    const [vendors] = useState<any[]>([]);
    const [isTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const triggerState = useState(0);
    const setTrigger = triggerState[1];

    const user = useSelector((state: RootState) => state.auth.user);
    const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
    const myId = user?.id || vendor?.id;
    const myType = user ? 'user' : 'vendor';

    const fetchChatsData = async () => {
        if (!myId) return;
        try {
            const res = await getChatsOfUser(myId, myType);
            const chatsList = res.data || [];
            setChats(chatsList);
        } catch (err) {
            console.error("Failed to fetch chats", err);
        }
    };

    const totalUnreadCount = chats.reduce((sum, chat) => {
        const count = chat.unreadCount || 0;
        return sum + (count > 0 ? count : 0); 
    }, 0);

    const unreadChatCount = chats.reduce((sum, chat) => {
        const count = chat.unreadCount || 0;
        return sum + (count > 0 ? 1 : 0);
    }, 0);

    const markChatAsRead = (chatId: string) => {
        if (!chatId) return;
        setChats(prev => prev.map(c => c._id === chatId ? { ...c, unreadCount: 0 } : c));
    };

    useEffect(() => {
        fetchChatsData();
    }, [myId, triggerState[0]]);
    
    useEffect(() => {
        if (!socket) return;
        
        const handleMessagesSeen = (data: { chatId: string; userId: string }) => {
      
            setChats(prev => prev.map(chat => {
                if (chat._id === data.chatId) {
                    return { ...chat, unreadCount: 0 };
                }
                return chat;
            }));
        };

        const handleNewMessageNotification = (data: {
            chatId: string;
            senderId: string;
            senderName?: string;
            messagePreview?: string;
            timestamp?: string | Date;
        }) => {
            if (!data?.chatId) return;

            if (currentChat && currentChat._id === data.chatId) {
                return;
            }

            setChats(prev => {
                const idx = prev.findIndex(c => c._id === data.chatId);
                if (idx === -1) {
                    setTrigger(t => t + 1);
                    return prev;
                }

                const updated = [...prev];
                const existing = updated[idx];
                const currentUnread = Math.max(0, existing.unreadCount || 0);
                updated[idx] = {
                    ...existing,
                    unreadCount: currentUnread + 1,
                    lastMessage: data.messagePreview ?? existing.lastMessage,
                    lastMessageAt: (data.timestamp ? new Date(data.timestamp) : new Date()) as any,
                };

                return updated;
            });
        };
        
        socket.on("messages-seen", handleMessagesSeen);
        socket.on("new-message-notification", handleNewMessageNotification);
        
        return () => {
            socket.off("messages-seen", handleMessagesSeen);
            socket.off("new-message-notification", handleNewMessageNotification);
        };
    }, [socket, currentChat]);

    useEffect(() => {
        if (!socket) return;

        const handleReceive = (msg: Imessage) => {
            if (currentChat && msg.chatId === currentChat._id) {
                setMessages(prev => [...prev, msg]);
            }
            setTrigger(prev => prev + 1);
        };

        socket.on('receive-message', handleReceive);

        return () => {
            socket.off('receive-message', handleReceive);
        };
    }, [socket, currentChat]);

    const selectChat = async (myId: string, otherId: string) => {
        setLoading(true);
        try {
            const chat = await findOrCreateChat(myId, otherId);
            setCurrentChat(chat);

            // Join Room
            if (socket && socket.connected) {
                socket.emit('join_room', { roomId: chat._id, userId: myId });
            }

            const msgs = await getMessages(chat._id);
            setMessages(msgs.data?.messages || msgs.messages || []);
        } catch (err) {
            setError("Failed to load chat");
            toast.error("Failed to load chat");
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (content: string) => {
        if (!currentChat || !socket || !myId) return;

        // Ensure other person ID is updated or available? 
        // currentChat.userId / vendorId logic
        // But we rely on socket to broadcast.

        const newMsg: Imessage = {
            _id: "",
            chatId: currentChat._id,
            senderId: myId,
            messageContent: content,
            messageType: "text",
            sendedTime: new Date(),
            seen: false,
            senderType: (myType === 'user' ? 'User' : 'vendor') as any
        };

        socket.emit("send_message", { ...newMsg, senderName: user?.username || vendor?.name }, () => {
            // Optimistic update handled by receive-message usually? 
            // Or append local immediately? 
            // ChatContainer might double append if we append here AND listen?
            // Socket usually echoes back to sender?
            // Backend chatHandler: _io.to(chatId).emit("receive-message", savedMessage);
            // Yes it echoes. So we don't append here to avoid duplication, OR we check ID.
        });
    };

    const triggerSidebarRefetch = () => setTrigger(prev => prev + 1);

    return (
        <ChatContext.Provider value={{
            messages, currentChat, loading, chats, vendors, error, isTyping, totalUnreadCount, unreadChatCount,
            markChatAsRead,
            sendMessage, selectChat, fetchChats: fetchChatsData, triggerSidebarRefetch
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) throw new Error("useChatContext must be used within ChatProvider");
    return context;
};
