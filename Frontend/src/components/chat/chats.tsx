import { useState, useEffect, useRef, useContext } from "react";
import { Send, Loader2, MessageCircle, ArrowLeft, Check, CheckCheck, X, RotateCcw, Smile } from "lucide-react";
import { getMessages, getChatsOfUser, markMessagesAsSeen } from "@/services/chat/chatService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { io, Socket } from "socket.io-client";
import { socketContext } from "@/utilities/socket";
import { toast } from "react-toastify";
import { useChatContext } from "@/context/chatContext";
import EmojiPicker from "emoji-picker-react";

const logo = "/images/logo.png";

interface Contact {
    _id: string; 
    name: string;
    role: string;
    avatar?: string;
    lastMessage?: string;
    lastMessageTime?: Date | string;
    vendorId?: { _id: string; name: string; profileImage: string } | string | null;
    userId?: { _id: string; name: string; imageUrl: string } | string | null;
    isOnline?: boolean;
    unreadCount?: number;
}

interface ChatMessage {
    _id: string;
    chatId: string;
    senderId: string;
    messageContent: string;
    sendedTime: Date;
    seen: boolean;
    messageType?: "text" | "image" | "voice" | "file";
    deliveryStatus?: "sending" | "sent" | "delivered" | "read";
    fileUrl?: string;
    fileName?: string;
    fileSize?: number;
    isDeleted?: boolean;
    deletedAt?: Date;
    replyTo?: {
        _id: string;
        messageContent: string;
        senderName: string;
    };
}

interface TypingUser {
    userId: string;
    name: string;
    isTyping: boolean;
}


const getInitials = (name: string): string => {
    const trimmed = (name || "").trim();
    if (!trimmed) return "?";
    const parts = trimmed.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
    return (first + last).toUpperCase() || "?";
};


const ChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showContacts, setShowContacts] = useState(true);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
    const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
    const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState(false);
    const [deletedMessages, setDeletedMessages] = useState<Map<string, ChatMessage>>(new Map());
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const autoScrollRef = useRef(true);
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId?: string }>();
    const socketRef = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

    const { markChatAsRead } = useChatContext();

    const user = useSelector((state: RootState) => state.auth.user);
    const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
    const isUserAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const isVendorAuthenticated = useSelector((state: RootState) => state.vendorAuth.isAuthenticated);

    const senderId = user?.id || vendor?.id;
    const senderRole = user ? (user.role || "user") : (vendor ? "vendor" : "user");

    const formatTime = (value: Date | string) => {
        const d = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact);
        setShowContacts(false);
        markChatAsRead(contact._id);
        const base = senderRole === "vendor" ? "/vendor/chat" : "/chat";
        navigate(`${base}/${contact._id}`);
    };

    const handleBackToContacts = () => {
        setShowContacts(true);
        setSelectedContact(null);
        const base = senderRole === "vendor" ? "/vendor/chat" : "/chat";
        navigate(base);
    };

    const handleReplyToMessage = (msg: ChatMessage) => {
        setReplyingTo(msg);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    const emitTypingStop = () => {
        if (!selectedContact || !senderId || !socketRef.current) return;
        socketRef.current.emit("stop-typing", { roomId: selectedContact._id, userId: senderId });
    };

    const handleTypingStart = () => {
        if (!selectedContact || !senderId || !socketRef.current) return;
        socketRef.current.emit("typing", { roomId: selectedContact._id, userId: senderId });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            emitTypingStop();
        }, 1200);
    };

    const handleTypingStop = () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
        }
        emitTypingStop();
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleSendMessage = async () => {
        if (!selectedContact || !senderId) return;
        const content = newMessage.trim();
        if (!content) return;

        console.log('🔍 Sending message with content:', content);
        console.log('🔍 Content length:', content.length);
        console.log('🔍 Content char codes:', content.split('').map(char => char.charCodeAt(0)));

        const messageContent = content;

        const receiverIdRaw = senderRole === "vendor" ? selectedContact.userId : selectedContact.vendorId;
        const receiverId = typeof receiverIdRaw === "string" ? receiverIdRaw : "";
        const senderType = senderRole === "vendor" ? "vendor" : "User";

        const tempId = `temp-${Date.now()}`;
        const now = new Date();

        const replyPayload = replyingTo
            ? {
                messageId: replyingTo._id,
                messageContent: replyingTo.messageContent,
                senderName: replyingTo.senderId === senderId
                    ? (user?.username || vendor?.name || "You")
                    : (selectedContact.name || "Someone"),
            }
            : undefined;

        const payload = {
            chatId: selectedContact._id,
            senderId: senderId,
            senderType: senderType,
            senderName: user?.username || vendor?.name || "Someone",
            receiverId: receiverId,
            messageContent: messageContent,
            seen: false,
            sendedTime: now,
            fileUrl: '',
            replyTo: replyPayload,
        };

        setNewMessage("");
        setReplyingTo(null);
        autoScrollRef.current = true;

        setMessages(prev => ([
            ...prev,
            {
                _id: tempId,
                chatId: payload.chatId,
                senderId: payload.senderId,
                messageContent: payload.messageContent,
                sendedTime: now,
                seen: false,
                deliveryStatus: "sending",
                replyTo: replyingTo
                    ? {
                        _id: replyingTo._id,
                        messageContent: replyingTo.messageContent,
                        senderName: replyPayload?.senderName || "",
                    }
                    : undefined,
            },
        ]));

        setContacts(prev => prev.map(c => {
            if (c._id !== selectedContact._id) return c;
            return { ...c, lastMessage: messageContent, lastMessageTime: now };
        }));

        const socket = socketRef.current;
        if (!socket) return;

        socket.emit("send_message", payload, (id: string) => {
            setMessages(prev => prev.map(m => {
                if (m._id !== tempId) return m;
                return { ...m, _id: id, deliveryStatus: "sent" };
            }));
        });
    };

    const handleDeleteMessage = async (messageId: string) => {
        if (!selectedContact || !socketRef.current) return;
        setDeletingMessageId(messageId);
        socketRef.current.emit(
            "delete_message",
            { messageId, chatId: selectedContact._id },
            (res?: { success: boolean; message?: string }) => {
                setDeletingMessageId(null);
                if (res && res.success === false) {
                    toast.error(res.message || "Failed to delete message");
                }
            }
        );
    };

    const handleRevertMessage = async (messageId: string) => {
        const deletedMessage = deletedMessages.get(messageId);
        if (!deletedMessage || !socketRef.current) return;

        // Restore message locally
        setMessages(prev => prev.map(m => 
            m._id === messageId ? deletedMessage : m
        ));

        // Remove from deleted messages
        setDeletedMessages(prev => {
            const newMap = new Map(prev);
            newMap.delete(messageId);
            return newMap;
        });

        // Send revert via socket
        socketRef.current.emit("revert_message", { messageId, chatId: selectedContact?._id });
    };

    const handleEmojiClick = (emojiObject: any) => {
        const emoji = emojiObject.emoji;
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
        // Focus back to input after selecting emoji
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    };

    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    // Close emoji picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        if (showEmojiPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (autoScrollRef.current) {
            scrollToBottom();
        }
        autoScrollRef.current = false;
    }, [messages]);

    const socketContextValue = useContext(socketContext);
    const globalSocket = socketContextValue?.socket;

    useEffect(() => {
        if (!senderId) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '') || "http://localhost:1212";
        
        if (!globalSocket) {
            socketRef.current = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
            });
            if (senderRole === 'vendor') {
                socketRef.current.emit("register_vendor", { vendorId: senderId });
            } else {
                socketRef.current.emit("register_user", { userId: senderId });
            }
        } else {
            socketRef.current = globalSocket;
            if (senderRole === 'vendor') {
                socketRef.current.emit("register_vendor", { vendorId: senderId });
            } else {
                socketRef.current.emit("register_user", { userId: senderId });
            }
        }

        const socket = socketRef.current;

        const handleReceiveMessage = (newMessage: ChatMessage) => {
            if (newMessage.chatId === selectedContact?._id) {
                autoScrollRef.current = true;
                setMessages((prev) => {
                    const exists = prev.some(msg => msg._id === newMessage._id);
                    if (exists) {
                        return prev;
                    }
                    return [...prev, newMessage];
                });
            }

            setContacts(prev => prev.map(contact => {
                if (contact._id === newMessage.chatId) {
                    const isFromCurrentUser = newMessage.senderId === senderId;
                    const isCurrentChat = contact._id === selectedContact?._id;
                    
                
                    const shouldIncrement = !isFromCurrentUser && !isCurrentChat;
                 
                    const currentCount = Math.max(0, contact.unreadCount || 0);
                    const newUnreadCount = isCurrentChat 
                        ? 0 
                        : (shouldIncrement ? currentCount + 1 : currentCount);
                    
                
                    const finalUnreadCount = Math.max(0, newUnreadCount);
                    
                    if (shouldIncrement) {
                        console.log(`📊 Incrementing unread count for chat ${contact._id}: ${currentCount} -> ${finalUnreadCount}`);
                    }
                    
                    return {
                        ...contact,
                        lastMessage: newMessage.messageContent,
                        lastMessageTime: newMessage.sendedTime,
                        unreadCount: finalUnreadCount
                    };
                }
                return contact;
            }).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));

        };

        socket.on("receive-message", handleReceiveMessage);
        
        const handleUserStatusChange = (data: { userId: string; isOnline: boolean }) => {
            setOnlineUsers(prev => {
                const updated = new Set(prev);
                if (data.isOnline) {
                    updated.add(data.userId);
                } else {
                    updated.delete(data.userId);
                }
                return updated;
            });
        };

        const handleVendorStatusChange = (data: { vendorId: string; isOnline: boolean }) => {
            setOnlineUsers(prev => {
                const updated = new Set(prev);
                if (data.isOnline) {
                    updated.add(data.vendorId);
                } else {
                    updated.delete(data.vendorId);
                }
                return updated;
            });
        };

        socket.on("user-status-changed", handleUserStatusChange);
        socket.on("vendor-status-changed", handleVendorStatusChange);

        const handleOnlineUsersSnapshot = (data: { onlineIds: string[] }) => {
            const ids = Array.isArray(data?.onlineIds) ? data.onlineIds.map(String) : [];
            setOnlineUsers(new Set(ids));
        };

        socket.on("online-users", handleOnlineUsersSnapshot);

        const handleNewMessageNotification = (data: {
            chatId: string;
            senderId: string;
            senderName?: string;
            messagePreview?: string;
            timestamp?: string | Date;
        }) => {
            if (!data?.chatId) return;
            if (selectedContact?._id === data.chatId) return;

            setContacts(prev => {
                const updated = prev.map(c => {
                    if (c._id !== data.chatId) return c;
                    const current = Math.max(0, c.unreadCount || 0);
                    return {
                        ...c,
                        unreadCount: current + 1,
                        lastMessage: data.messagePreview ?? c.lastMessage,
                        lastMessageTime: data.timestamp ? new Date(data.timestamp) : new Date(),
                    };
                });

                return updated.sort((a, b) =>
                    new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()
                );
            });
        };

        socket.on("new-message-notification", handleNewMessageNotification);
        
        const handleMessagesSeen = (data: { chatId: string; userId: string }) => {
            setContacts(prev => prev.map(contact => {
                if (contact._id === data.chatId) {
                    return { ...contact, unreadCount: 0 };
                }
                return contact;
            }));
            
            if (selectedContact?._id === data.chatId) {
                setMessages(prev => prev.map(msg => {
                    if (msg.senderId !== senderId) {
                        return { ...msg, seen: true };
                    }
                    return msg;
                }));
            }
        };
        
        socket.on("messages-seen", handleMessagesSeen);
        
        const handleTypingOn = (data: { userId: string }) => {
            if (!selectedContact?._id) return;
            if (!data?.userId || data.userId === senderId) return;
            setTypingUsers(prev => {
                const exists = prev.find(u => u.userId === data.userId);
                if (exists) return prev.map(u => u.userId === data.userId ? { ...u, isTyping: true } : u);
                return [...prev, { userId: data.userId, name: selectedContact.name || "", isTyping: true }];
            });
        };

        const handleTypingOff = (data: { userId: string }) => {
            if (!data?.userId) return;
            setTypingUsers(prev => prev
                .map(u => u.userId === data.userId ? { ...u, isTyping: false } : u)
                .filter(u => u.isTyping)
            );
        };

        socket.on("typing", handleTypingOn);
        socket.on("stop-typing", handleTypingOff);
        
        // Listen for message deletion
        const handleMessageDeleted = (data: { messageId: string; chatId: string }) => {
            if (data.chatId === selectedContact?._id) {
                setMessages(prev => prev.map(msg => 
                    msg._id === data.messageId 
                        ? { ...msg, isDeleted: true, deletedAt: new Date(), messageContent: "This message was deleted" }
                        : msg
                ));
            }
        };

        socket.on("message_deleted", handleMessageDeleted);
        
        socket.on("connect", () => {
            console.log("Socket connected:", socket.id);
        });
        
        socket.on("disconnect", () => {
            console.log("Socket disconnected");
        });
        
        socket.on("error", (error) => {
            console.error("Socket error:", error);
        });

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("user-status-changed", handleUserStatusChange);
            socket.off("vendor-status-changed", handleVendorStatusChange);
            socket.off("messages-seen", handleMessagesSeen);
            socket.off("typing", handleTypingOn);
            socket.off("stop-typing", handleTypingOff);
            socket.off("message_deleted", handleMessageDeleted);
            socket.off("online-users", handleOnlineUsersSnapshot);
            socket.off("new-message-notification", handleNewMessageNotification);
            if (!globalSocket && socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [senderId, selectedContact, globalSocket]);

    useEffect(() => {
        setContacts(prev => prev.map(contact => {
            const otherParticipantId = (senderRole === 'user') ? String(contact.vendorId || '') : String(contact.userId || '');
            const isOtherOnline = otherParticipantId ? onlineUsers.has(otherParticipantId) : false;
            if (contact.isOnline === isOtherOnline) return contact;
            return { ...contact, isOnline: isOtherOnline };
        }));

        setSelectedContact(prev => {
            if (!prev) return prev;
            const otherParticipantId = (senderRole === 'user') ? String(prev.vendorId || '') : String(prev.userId || '');
            const isOtherOnline = otherParticipantId ? onlineUsers.has(otherParticipantId) : false;
            if (prev.isOnline === isOtherOnline) return prev;
            return { ...prev, isOnline: isOtherOnline };
        });
    }, [onlineUsers, senderRole]);


    useEffect(() => {
        if (!senderId) {
            navigate("/login");
            return;
        }

        const fetchContacts = async () => {
            try {
                setLoading(true);
                const userType = user ? 'user' : 'vendor';
                const responseY = await getChatsOfUser(senderId, userType);

                let chats: any[] = [];
                if (responseY && responseY.data) {
                    if (Array.isArray(responseY.data)) {
                        chats = responseY.data;
                    } else if (responseY.data.chats && Array.isArray(responseY.data.chats)) {
                    chats = responseY.data.chats;
                    }
                } else if (responseY && Array.isArray(responseY)) {
                    chats = responseY;
                } else if (responseY && responseY.messages && Array.isArray(responseY.messages)) {
                    chats = responseY.messages;
                }
                
                if (chats.length > 0) {
                    console.log("Chat data sample:", chats[0]);
                    console.log("Full chat data structure:", JSON.stringify(chats[0], null, 2));
                }

                const formattedContacts: Contact[] = chats.map((chat: any) => {
                    const isUser = senderRole === 'user';
                    
                    let name = chat.name || "Unknown";
                    let avatar = chat.profile_image || "";
                    
                    if (!isUser) {
                        if (chat.userId) {
                            if (typeof chat.userId === 'object' && chat.userId !== null) {
                                name = chat.userId.name || chat.userId.username || name;
                                avatar = chat.userId.imageUrl || chat.userId.profileImage || avatar;
                            } else if (typeof chat.userId === 'string') {
                                // If userId is a string, we might need to fetch user details
                                // For now, use the name from backend
                            }
                        }
                    } else {
                        if (chat.vendorId) {
                            if (typeof chat.vendorId === 'object' && chat.vendorId !== null) {
                                name = chat.vendorId.name || chat.vendorId.businessName || chat.vendorId.username || name;
                                avatar = chat.vendorId.profileImage || chat.vendorId.imageUrl || avatar;
                            }
                        }
                    }
                    
                    // Fallback: if name is still unknown, try to extract from populated objects
                    if ((!name || name === "Unknown" || name === "Unknown Vendor") && chat.vendorId) {
                        if (typeof chat.vendorId === 'object' && chat.vendorId !== null && isUser) {
                            name = chat.vendorId.name || chat.vendorId.businessName || chat.vendorId.username || name;
                            avatar = chat.vendorId.profileImage || chat.vendorId.imageUrl || avatar;
                        }
                    }
                    
                    if ((!name || name === "Unknown" || name === "Unknown Vendor") && chat.userId) {
                        if (typeof chat.userId === 'object' && chat.userId !== null && !isUser) {
                            name = chat.userId.name || chat.userId.username || name;
                            avatar = chat.userId.imageUrl || chat.userId.profileImage || avatar;
                        }
                    }
                    
                    // Extract IDs for reference - Backend should now include userId and vendorId as strings
                    let vendorIdValue: string | null = null;
                    let userIdValue: string | null = null;
                    
                    // First, check if backend already provided them as strings
                    if (chat.vendorId && typeof chat.vendorId === 'string') {
                        vendorIdValue = chat.vendorId;
                    } else if (chat.vendorId) {
                        // If it's an object, extract the ID
                        vendorIdValue = typeof chat.vendorId === 'object' 
                            ? (chat.vendorId._id?.toString() || chat.vendorId.id?.toString() || String(chat.vendorId))
                            : String(chat.vendorId);
                    }
                    
                    if (chat.userId && typeof chat.userId === 'string') {
                        userIdValue = chat.userId;
                    } else if (chat.userId) {
                        userIdValue = typeof chat.userId === 'object'
                            ? (chat.userId._id?.toString() || chat.userId.id?.toString() || String(chat.userId))
                            : String(chat.userId);
                    }
                    

                    const otherParticipantId = isUser ? vendorIdValue : userIdValue;
                    const isOtherOnline = otherParticipantId ? onlineUsers.has(otherParticipantId) : false;

                    const unreadCount = Math.max(0, chat.unreadCount || 0);

                    return {
                        _id: chat._id,
                        name: name,
                        role: isUser ? 'vendor' : 'user',
                        avatar: avatar || "",
                        lastMessage: chat.lastMessage || "",
                        lastMessageTime: chat.lastMessageAt || new Date(),
                        vendorId: vendorIdValue,
                        userId: userIdValue,
                        unreadCount: unreadCount, // Ensure it's never negative
                        isOnline: isOtherOnline
                    };
                });

                setContacts(formattedContacts);

                // If chatId is in URL, select that chat
                if (chatId) {
                    const chatToSelect = formattedContacts.find(c => c._id === chatId);
                    if (chatToSelect) {
                        setSelectedContact(chatToSelect);
                        setShowContacts(false);
                    } else {
                      
                        const placeholderContact: Contact = {
                            _id: chatId,
                            name: "Vendor",
                            role: "vendor",
                            avatar: "",
                        };
                        setSelectedContact(placeholderContact);
                        setShowContacts(false);
                    }
                }

            } catch (err: any) {
                console.error("❌ Failed to load contacts", err);
                console.error("Error details:", {
                    message: err?.message,
                    response: err?.response?.data,
                    status: err?.response?.status
                });
                setError(err?.message || "Failed to load conversations");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [senderId, navigate, senderRole, chatId]);

    // Update selected contact if it's a placeholder and we now have the real contact
    useEffect(() => {
        if (selectedContact && selectedContact.name === "Vendor" && contacts.length > 0) {
            const realContact = contacts.find(c => c._id === selectedContact._id);
            if (realContact && realContact.name !== "Vendor") {
                setSelectedContact(realContact);
            }
        }
    }, [contacts, selectedContact]);

    // Fetch messages when contact is selected
    useEffect(() => {
        if (!selectedContact || !senderId) return;

        const fetchMessages = async () => {
            try {
                setHasMoreMessages(true);
                setLoadingMoreMessages(false);
                const userType = (isVendorAuthenticated && vendor) ? 'vendor' : (isUserAuthenticated && user) ? 'user' : (vendor ? 'vendor' : 'user');
                const res = await getMessages(selectedContact._id, userType);
                
                let messagesArray: ChatMessage[] = [];
                if (res && res.data) {
                    if (Array.isArray(res.data)) {
                        messagesArray = res.data;
                    } else if (res.data.messages && Array.isArray(res.data.messages)) {
                        messagesArray = res.data.messages;
                        setHasMoreMessages(!!res.data.hasMore);
                    }
                } else if (res && Array.isArray(res)) {
                    messagesArray = res;
                } else if (res && res.messages && Array.isArray(res.messages)) {
                    messagesArray = res.messages;
                }
                
                autoScrollRef.current = true;
                setMessages(messagesArray);

                if (socketRef.current) {
                    socketRef.current.emit("join_room", { roomId: selectedContact._id });
                }

                setContacts(prev => prev.map(c => {
                    if (c._id === selectedContact._id && (c.unreadCount || 0) > 0) {
                        return { ...c, unreadCount: 0 };
                    }
                    return c;
                }));
                
                setMessages(prev => prev.map(msg => {
                    if (msg.senderId !== senderId && !msg.seen) {
                        return { ...msg, seen: true };
                    }
                    return msg;
                }));

                const currentUserType = (isVendorAuthenticated && vendor) ? 'vendor' : (isUserAuthenticated && user) ? 'user' : (vendor ? 'vendor' : 'user');
                markMessagesAsSeen(selectedContact._id, senderId, currentUserType)
                    .then(() => {
                        console.log("✅ Messages marked as seen in backend for chat:", selectedContact._id);
                    })
                    .catch((error) => {
                        console.error("Error marking messages as seen:", error);
                    });

            } catch (error) {
                console.error("Error fetching messages:", error);
                toast.error("Failed to load messages");
                setMessages([]);
                setHasMoreMessages(false);
            }
        };

        fetchMessages();
    }, [selectedContact, senderId, isVendorAuthenticated, isUserAuthenticated, user, vendor]);

    const loadOlderMessages = async () => {
        if (!selectedContact || !senderId) return;
        if (loadingMoreMessages || !hasMoreMessages) return;
        if (messages.length === 0) return;

        try {
            setLoadingMoreMessages(true);
            autoScrollRef.current = false;

            const container = messagesContainerRef.current;
            const prevScrollHeight = container?.scrollHeight || 0;
            const prevScrollTop = container?.scrollTop || 0;

            // const oldestTime = messages[0]?.sendedTime;
            // const before = oldestTime ? new Date(oldestTime) : undefined;

            const userType = (isVendorAuthenticated && vendor) ? 'vendor' : (isUserAuthenticated && user) ? 'user' : (vendor ? 'vendor' : 'user');
            const res = await getMessages(selectedContact._id, userType, 
            //     {
            //     limit: 30,
            //     before: before,
            // }
        );

            const older: ChatMessage[] = (res && res.data && res.data.messages && Array.isArray(res.data.messages))
                ? res.data.messages
                : [];

            const hasMore = (res && res.data && typeof res.data.hasMore === 'boolean')
                ? res.data.hasMore
                : false;

            if (older.length === 0) {
                setHasMoreMessages(false);
                return;
            }

            setHasMoreMessages(hasMore);

            setMessages(prev => {
                const existing = new Set(prev.map(m => m._id));
                const dedupedOlder = older.filter(m => !existing.has(m._id));
                return [...dedupedOlder, ...prev];
            });

            requestAnimationFrame(() => {
                const c = messagesContainerRef.current;
                if (!c) return;
                const newScrollHeight = c.scrollHeight;
                c.scrollTop = prevScrollTop + (newScrollHeight - prevScrollHeight);
            });
        } catch (error) {
            console.error("Error loading older messages:", error);
        } finally {
            setLoadingMoreMessages(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <div className="bg-white border-b shadow-sm px-4 sm:px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <img 
                        src={logo} 
                        alt="OffWeGo" 
                        className="w-32 h-8 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => navigate(user ? "/user/profile" : "/vendor/profile")}
                    />
                    <div className="text-right">
                        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                        <p className="text-sm text-gray-500 mt-1">Chat with {user ? 'vendors' : 'users'}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
            {/* Contacts Sidebar */}
            <div
                className={`${showContacts ? "block" : "hidden"
                    } md:block w-full md:w-80 bg-white border-r flex flex-col`}
            >
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                    <p className="text-sm text-gray-500 mt-1">{contacts.length} {contacts.length === 1 ? 'conversation' : 'conversations'}</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {error && (
                        <div className="m-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    {contacts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                            <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
                            <p className="text-center">No conversations yet</p>
                            <p className="text-sm text-center mt-1">Book a package to start chatting.</p>
                        </div>
                    ) : (
                        contacts.map((contact) => (
                            <button
                                key={contact._id}
                                onClick={() => handleContactSelect(contact)}
                                className={`w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors border-b ${selectedContact?._id === contact._id ? "bg-blue-50" : ""
                                    }`}
                            >
                                <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                    {contact.avatar && contact.avatar.trim() !== "" ? (
                                        <img
                                            src={contact.avatar}
                                            alt={contact.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { 
                                                // Hide image and show initials on error
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm">${getInitials(contact.name)}</div>`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-sm">
                                            {getInitials(contact.name)}
                                        </div>
                                    )}
                                    {/* Online Status Indicator */}
                                    {contact.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="ml-3 flex-1 text-left overflow-hidden">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900 truncate text-base flex-1">{contact.name}</h3>
                                        {((contact.unreadCount ?? 0) > 0) && (
                                            <span className="ml-2 min-w-[20px] h-5 bg-red-500 text-white text-xs font-semibold rounded-full flex items-center justify-center px-1.5 flex-shrink-0">
                                                {Math.max(0, contact.unreadCount ?? 0) > 99 ? '99+' : Math.max(0, contact.unreadCount ?? 0)}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 capitalize mt-0.5">{contact.role}</p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div
                className={`${showContacts ? "hidden" : "flex"
                    } md:flex flex-col flex-1 bg-gray-50`}
            >
                {selectedContact ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white border-b px-4 sm:px-6 py-4 shadow-sm">
                            <div className="flex items-center">
                                <button
                                    onClick={handleBackToContacts}
                                    className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                                    aria-label="Back to contacts"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>

                                <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                    {selectedContact.avatar && selectedContact.avatar.trim() !== "" ? (
                                        <img
                                            src={selectedContact.avatar}
                                            alt={selectedContact.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { 
                                                // Hide image and show initials on error
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                const parent = (e.target as HTMLImageElement).parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `<div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-xs">${getInitials(selectedContact.name)}</div>`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold text-xs">
                                            {getInitials(selectedContact.name)}
                                        </div>
                                    )}
                                    {/* Online Status Indicator */}
                                    {selectedContact.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                    )}
                                </div>

                                <div className="ml-3 flex-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
                                        {selectedContact.isOnline && (
                                            <span className="text-xs text-green-600 font-medium">Online</span>
                                        )}
                                        {!selectedContact.isOnline && (
                                            <span className="text-xs text-gray-500 font-medium">Offline</span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 capitalize">{selectedContact.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div
                            ref={messagesContainerRef}
                            onScroll={(e) => {
                                const el = e.currentTarget;
                                if (el.scrollTop <= 80) {
                                    loadOlderMessages();
                                }
                            }}
                            className="flex-1 overflow-y-auto px-2 sm:px-4 py-4 sm:py-6 space-y-1 bg-[#e5ddd5] bg-opacity-50"
                        >
                            {loadingMoreMessages && (
                                <div className="flex items-center justify-center py-2 text-gray-500">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            )}
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-8">
                                    <p>No messages yet.</p>
                                    <p className="text-sm mt-1">Start the conversation with {selectedContact.name}!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwnMessage = msg.senderId === senderId;
                                    const isDeleted = msg.isDeleted;
                                    return (
                                        <div key={msg._id || Math.random()} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-2 group`}>
                                            <div
                                                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl relative ${isOwnMessage
                                                    ? "bg-[#dcf8c6] text-gray-900 rounded-br-sm"
                                                    : "bg-white text-gray-900 rounded-bl-sm shadow-sm"
                                                    } ${isDeleted ? 'opacity-60' : ''}`}
                                            >
                                                {/* Reply preview */}
                                                {msg.replyTo && (
                                                    <div className={`mb-2 p-2 rounded-lg text-xs ${isOwnMessage ? 'bg-green-100' : 'bg-gray-100'}`}>
                                                        <div className="font-medium text-gray-600">
                                                            Replying to {msg.replyTo.senderName}
                                                        </div>
                                                        <div className="text-gray-500 truncate">
                                                            {msg.replyTo.messageContent}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                <p className={`break-words text-sm md:text-base ${isDeleted ? 'italic text-gray-500' : ''}`}>
                                                    {msg.messageContent}
                                                </p>
                                                <div className={`text-[10px] sm:text-xs mt-1 flex items-center justify-end gap-1 ${isOwnMessage ? "text-[#4fc3f7]" : "text-gray-400"}`}>
                                                    <span>{formatTime(msg.sendedTime)}</span>
                                                    {isDeleted && (
                                                        <span className="ml-1 text-gray-400">(deleted)</span>
                                                    )}
                                                    {isOwnMessage && !isDeleted && (
                                                        <span className="flex items-center">
                                                            {msg.seen ? (
                                                                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
                                                            ) : (
                                                                <Check className="w-3.5 h-3.5 text-gray-400" />
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Message actions - shown on hover */}
                                                <div className={`absolute top-1 ${isOwnMessage ? "left-0 -translate-x-full" : "right-0 translate-x-full"} opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white rounded-lg shadow-lg p-1`}>
                                                    <button
                                                        onClick={() => handleReplyToMessage(msg)}
                                                        className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-blue-600 transition-colors"
                                                        title="Reply"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                                        </svg>
                                                    </button>
                                                    {isOwnMessage && (
                                                        <button
                                                            onClick={() => isDeleted ? handleRevertMessage(msg._id) : handleDeleteMessage(msg._id)}
                                                            disabled={deletingMessageId === msg._id}
                                                            className="p-1.5 hover:bg-gray-100 rounded text-gray-600 hover:text-red-600 transition-colors disabled:opacity-50"
                                                            title={isDeleted ? "Restore" : "Delete"}
                                                        >
                                                            {deletingMessageId === msg._id ? (
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                            ) : isDeleted ? (
                                                                <RotateCcw className="w-4 h-4" />
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-white border-t px-3 sm:px-4 py-4">
                            {/* Reply Preview */}
                            {replyingTo && (
                                <div className="mb-2 p-2 bg-gray-100 rounded-lg flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="text-xs font-medium text-gray-600">
                                            Replying to {user?.username || vendor?.name || "User"}
                                        </div>
                                        <div className="text-xs text-gray-500 truncate">
                                            {replyingTo.messageContent}
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCancelReply}
                                        className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                            

                            {/* Typing Indicator */}
                            {typingUsers.length > 0 && (
                                <div className="text-xs text-gray-500 mb-2 px-2">
                                    {typingUsers.map(user => user.name).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                                </div>
                            )}
                            

                            <div className="flex items-center gap-2 relative">
                                {/* Emoji Picker Button */}
                                <button
                                    onClick={toggleEmojiPicker}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
                                    title="Add emoji"
                                >
                                    <Smile size={20} />
                                </button>

                                {/* Emoji Picker */}
                                {showEmojiPicker && (
                                    <div 
                                        ref={emojiPickerRef}
                                        className="absolute bottom-12 left-0 z-50"
                                    >
                                        <EmojiPicker 
                                            onEmojiClick={handleEmojiClick}
                                            theme={'light' as any}
                                            emojiStyle={'native' as any}
                                            searchPlaceholder="Search emoji..."
                                            height={350}
                                            width={300}
                                        />
                                    </div>
                                )}
                                
                                <input
                                    value={newMessage}
                                    onChange={(e) => {
                                        setNewMessage(e.target.value);
                                        handleTypingStart();
                                    }}
                                    onKeyPress={handleKeyPress}
                                    onBlur={handleTypingStop}
                                    placeholder={`Message ${selectedContact.name}...`}
                                    disabled={sending}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={sending || !newMessage.trim()}
                                    className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Send message"
                                >
                                    {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p className="text-lg font-medium">Select a conversation</p>
                        <p className="text-sm mt-1">Choose a contact to start messaging</p>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default ChatPage;