import { useState, useEffect, useRef, useContext } from "react";
import { Send, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { getMessages, findOrCreateChat, getChatsOfUser } from "@/services/chat/chatService";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { io, Socket } from "socket.io-client";
import { socketContext } from "@/utilities/socket";
import { toast } from "react-toastify";

interface Contact {
    _id: string; // Chat ID
    name: string;
    role: string;
    avatar?: string;
    lastMessage?: string;
    lastMessageTime?: Date | string;
    vendorId?: { _id: string; name: string; profileImage: string } | string;
    userId?: { _id: string; name: string; imageUrl: string } | string;
    isOnline?: boolean;
}

interface ChatMessage {
    _id: string;
    chatId: string;
    senderId: string;
    messageContent: string;
    sendedTime: Date;
    seen: boolean;
    messageType?: "text" | "image";
}


const ChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showContacts, setShowContacts] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId?: string }>();
    const socketRef = useRef<Socket | null>(null);

    const user = useSelector((state: RootState) => state.auth.user);
    const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);

    const senderId = user?.id || vendor?.id;
    const senderRole = user ? (user.role || "user") : (vendor ? "vendor" : "user");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Socket Connection - Use the socket from SocketProvider
    const socketContextValue = useContext(socketContext);
    const globalSocket = socketContextValue?.socket;

    useEffect(() => {
        if (!senderId) return;

        // Use global socket if available, otherwise create a new one
        const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '') || "http://localhost:1212";
        
        if (!globalSocket) {
            socketRef.current = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
            });
            socketRef.current.emit("register_user", { userId: senderId });
            console.log("Created new socket connection");
        } else {
            socketRef.current = globalSocket;
            console.log("Using global socket connection");
        }

        const socket = socketRef.current;

        const handleReceiveMessage = (newMessage: ChatMessage) => {
            console.log("Received message via socket:", newMessage);
            if (newMessage.chatId === selectedContact?._id) {
                setMessages((prev) => {
                    // Avoid duplicates
                    const exists = prev.some(msg => msg._id === newMessage._id);
                    if (exists) {
                        console.log("Message already exists, skipping");
                        return prev;
                    }
                    console.log("Adding new message to chat");
                    return [...prev, newMessage];
                });
            }

            // Update contact list with last message
            setContacts(prev => prev.map(contact =>
                contact._id === newMessage.chatId
                    ? { ...contact, lastMessage: newMessage.messageContent, lastMessageTime: newMessage.sendedTime }
                    : contact
            ).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));

        };

        socket.on("receive-message", handleReceiveMessage);
        
        // Debug socket events
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
            // Only disconnect if we created our own socket
            if (!globalSocket && socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [senderId, selectedContact, globalSocket]);


    // Fetch contacts (chats)
    useEffect(() => {
        if (!senderId) {
            navigate("/login");
            return;
        }

        const fetchContacts = async () => {
            try {
                setLoading(true);
                const responseY = await getChatsOfUser(senderId);

                let chats: any[] = [];
                // Handle different response structures
                if (responseY && responseY.data) {
                    if (Array.isArray(responseY.data)) {
                        chats = responseY.data;
                    } else if (Array.isArray(responseY.data.chats)) {
                        chats = responseY.data.chats;
                    }
                } else if (responseY && Array.isArray(responseY)) {
                    chats = responseY;
                }
                
                // Debug: Log first chat to verify structure (remove in production)
                if (chats.length > 0) {
                    console.log("Chat data sample:", chats[0]);
                    console.log("Full chat data structure:", JSON.stringify(chats[0], null, 2));
                }

                // Format contacts - Backend already formats with name and profile_image
                const formattedContacts: Contact[] = chats.map((chat: any) => {
                    const isUser = senderRole === 'user';
                    
                    // Backend returns formatted chats with name and profile_image
                    // These are the primary sources
                    let name = chat.name || "Unknown Vendor";
                    let avatar = chat.profile_image || "";
                    
                    // If name is empty or "Unknown", try to extract from populated objects
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
                        // If it's an object, extract the ID
                        userIdValue = typeof chat.userId === 'object'
                            ? (chat.userId._id?.toString() || chat.userId.id?.toString() || String(chat.userId))
                            : String(chat.userId);
                    }
                    
                    console.log(`Chat ${chat._id} - userId: ${userIdValue}, vendorId: ${vendorIdValue}`);

                    return {
                        _id: chat._id,
                        name: name,
                        role: isUser ? 'vendor' : 'user',
                        avatar: avatar || "",
                        lastMessage: chat.lastMessage || "",
                        lastMessageTime: chat.lastMessageAt || new Date(),
                        vendorId: vendorIdValue,
                        userId: userIdValue
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
                        // Chat not found in list, might be a new chat
                        // Try to get vendor info from the chat data structure
                        // For now, set a placeholder and it will be updated when messages are loaded
                        // or when the chat is found in a refresh
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

            } catch (err) {
                console.error("Failed to load contacts", err);
                setError("Failed to load conversations");
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
        if (!selectedContact) return;

        const fetchMessages = async () => {
            try {
                const res = await getMessages(selectedContact._id);
                console.log("Messages response:", res);
                
                // Backend returns: { success: true, data: [...] }
                let messagesArray: ChatMessage[] = [];
                if (res && res.data) {
                    if (Array.isArray(res.data)) {
                        messagesArray = res.data;
                    } else if (res.data.messages && Array.isArray(res.data.messages)) {
                        messagesArray = res.data.messages;
                    }
                } else if (res && Array.isArray(res)) {
                    messagesArray = res;
                } else if (res && res.messages && Array.isArray(res.messages)) {
                    messagesArray = res.messages;
                }
                
                setMessages(messagesArray);
                console.log("Loaded messages:", messagesArray.length);

                // Join chat room
                if (socketRef.current) {
                    socketRef.current.emit("join_room", { roomId: selectedContact._id });
                    console.log("Joined room:", selectedContact._id);
                }

            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        }

        fetchMessages();
    }, [selectedContact]);


    const handleContactSelect = (contact: Contact) => {
        setSelectedContact(contact);
        setShowContacts(false);
    };

    const handleBackToContacts = () => {
        setShowContacts(true);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedContact || !senderId) return;

        console.log("Selected contact:", selectedContact);
        console.log("Sender ID:", senderId);
        console.log("Sender role:", senderRole);

        // Get receiver ID (vendor or user)
        // If sender is user, receiver is vendor, and vice versa
        let receiverId: string | null = null;
        
        if (senderRole === 'user') {
            // User is sending, receiver is vendor
            if (selectedContact.vendorId) {
                receiverId = typeof selectedContact.vendorId === 'object' 
                    ? (selectedContact.vendorId._id || selectedContact.vendorId.id || String(selectedContact.vendorId))
                    : String(selectedContact.vendorId);
            }
        } else {
            // Vendor is sending, receiver is user
            if (selectedContact.userId) {
                receiverId = typeof selectedContact.userId === 'object'
                    ? (selectedContact.userId._id || selectedContact.userId.id || String(selectedContact.userId))
                    : String(selectedContact.userId);
            }
        }

        if (!receiverId) {
            console.error("Could not determine receiver ID. Contact data:", selectedContact);
            toast.error("Unable to determine recipient. Please refresh the page.");
            return;
        }

        // Normalize senderType: 'user' -> 'User', 'vendor' -> 'vendor'
        const normalizedSenderType = senderRole === 'user' ? 'User' : 'vendor';

        const messageData = {
            chatId: selectedContact._id,
            senderId,
            senderType: normalizedSenderType,
            receiverId: receiverId,
            messageContent: newMessage.trim(),
            messageType: 'text',
            sendedTime: new Date(),
            seen: false,
            senderName: user?.name || user?.username || vendor?.name || "User"
        };

        console.log("Message data being sent:", messageData);

        const messageText = newMessage.trim();

        try {
            setSending(true);

            if (!socketRef.current) {
                console.error("Socket not initialized");
                toast.error("Connection error. Please refresh the page.");
                setSending(false);
                return;
            }

            if (!socketRef.current.connected) {
                console.error("Socket not connected, attempting to reconnect...");
                socketRef.current.connect();
                // Wait a bit for connection
                await new Promise(resolve => setTimeout(resolve, 500));
                if (!socketRef.current.connected) {
                    toast.error("Connection error. Please refresh the page.");
                    setSending(false);
                    return;
                }
            }

            console.log("Sending message:", messageData);

            socketRef.current.emit("send_message", messageData, (ackId: string) => {
                // Acknowledge received
                console.log("Message sent successfully, ID:", ackId);
                if (ackId) {
                    // Message was successfully sent and saved
                    // The receive-message event will update the UI
                } else {
                    console.warn("Message sent but no ID returned");
                }
            });

            setNewMessage("");

            // Update local contact list sort order immediately
            setContacts(prev => prev.map(c =>
                c._id === selectedContact._id
                    ? { ...c, lastMessage: messageText, lastMessageTime: new Date() }
                    : c
            ).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));

        } catch (err) {
            console.error("Error sending message:", err);
            toast.error("Failed to send message. Please try again.");
        } finally {
            setSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (date: Date | string) => {
        const dateObj = typeof date === "string" ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return "Invalid time";
        return dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    };

    const getInitials = (name: string) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    const formatLastMessageTime = (date: Date | string) => {
        if (!date) return "";
        const dateObj = typeof date === "string" ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return "";

        const now = new Date();
        const diff = now.getTime() - dateObj.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return formatTime(dateObj);
        } else if (days === 1) {
            return "Yesterday";
        } else if (days < 7) {
            return `${days}d ago`;
        } else {
            return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
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
        <div className="flex h-screen bg-gray-50">
            {/* Contacts Sidebar */}
            <div
                className={`${showContacts ? "block" : "hidden"
                    } md:block w-full md:w-80 bg-white border-r flex flex-col`}
            >
                <div className="px-6 py-4 border-b">
                    <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
                    <p className="text-sm text-gray-500 mt-1">{contacts.length} conversations</p>
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
                                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
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
                                </div>

                                <div className="ml-3 flex-1 text-left overflow-hidden">
                                    <h3 className="font-semibold text-gray-900 truncate text-base">{contact.name}</h3>
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
                        <div className="bg-white border-b px-6 py-4 shadow-sm">
                            <div className="flex items-center">
                                <button
                                    onClick={handleBackToContacts}
                                    className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
                                    aria-label="Back to contacts"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>

                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
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
                                </div>

                                <div className="ml-3">
                                    <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
                                    <p className="text-sm text-gray-500 capitalize">{selectedContact.role}</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages Container */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-100">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 mt-8">
                                    <p>No messages yet.</p>
                                    <p className="text-sm mt-1">Start the conversation with {selectedContact.name}!</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isOwnMessage = msg.senderId === senderId;
                                    return (
                                        <div key={msg._id || Math.random()} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                                            <div
                                                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${isOwnMessage
                                                    ? "bg-blue-600 text-white rounded-br-none"
                                                    : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                                                    }`}
                                            >
                                                <p className="break-words text-sm md:text-base">{msg.messageContent}</p>
                                                <p className={`text-[10px] sm:text-xs mt-1 block text-right ${isOwnMessage ? "text-blue-100" : "text-gray-400"}`}>
                                                    {formatTime(msg.sendedTime)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="bg-white border-t px-4 py-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
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
                    <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
                        <div className="text-center">
                            <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Select a conversation</p>
                            <p className="text-sm mt-1">Choose a contact to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;