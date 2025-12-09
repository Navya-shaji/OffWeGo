import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
import { getMessages, findOrCreateChat, getChatsOfUser } from "@/services/chat/chatService";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { io, Socket } from "socket.io-client";

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
    const socketRef = useRef<Socket | null>(null);

    const senderId = useSelector((state: RootState) => state.auth.user?.id);
    const senderRole = useSelector((state: RootState) => state.auth.user?.role) || "user";

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Socket Connection
    useEffect(() => {
        if (!senderId) return;

        const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '') || "http://localhost:3000";
        socketRef.current = io(socketUrl);

        socketRef.current.emit("register_user", { userId: senderId });

        socketRef.current.on("receive-message", (newMessage: ChatMessage) => {
            if (newMessage.chatId === selectedContact?._id) {
                setMessages((prev) => [...prev, newMessage]);
            }

            // Update contact list with last message
            setContacts(prev => prev.map(contact =>
                contact._id === newMessage.chatId
                    ? { ...contact, lastMessage: newMessage.messageContent, lastMessageTime: newMessage.sendedTime }
                    : contact
            ).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));

        });

        return () => {
            socketRef.current?.disconnect();
        };
    }, [senderId, selectedContact]);


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
                if (responseY && responseY.data && Array.isArray(responseY.data.chats)) {
                    chats = responseY.data.chats;
                } else if (responseY && Array.isArray(responseY)) {
                    chats = responseY;
                }

                // Format contacts
                const formattedContacts: Contact[] = chats.map((chat: any) => {
                    const isUser = senderRole === 'user';
                    const otherParticipant = isUser ? chat.vendorId : chat.userId;

                    // Check if otherParticipant is populated or an ID
                    const name = otherParticipant?.name || "Unknown";
                    const avatar = isUser ? otherParticipant?.profileImage : otherParticipant?.imageUrl;

                    return {
                        _id: chat._id,
                        name: name,
                        role: isUser ? 'vendor' : 'user',
                        avatar: avatar || "",
                        lastMessage: chat.lastMessage,
                        lastMessageTime: chat.lastMessageAt,
                        vendorId: chat.vendorId,
                        userId: chat.userId
                    };
                });

                setContacts(formattedContacts);

            } catch (err) {
                console.error("Failed to load contacts", err);
                setError("Failed to load conversations");
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, [senderId, navigate, senderRole]);

    // Fetch messages when contact is selected
    useEffect(() => {
        if (!selectedContact) return;

        const fetchMessages = async () => {
            try {
                const res = await getMessages(selectedContact._id);
                if (res && res.messages) {
                    setMessages(res.messages);
                }

                // Join chat room
                socketRef.current?.emit("join_room", { roomId: selectedContact._id });

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

        const messageData = {
            chatId: selectedContact._id,
            senderId,
            senderType: senderRole,
            messageContent: newMessage.trim(),
            sendedTime: new Date(),
            seen: false
        };

        try {
            setSending(true);

            // Optimistic updatet
            //   setMessages((prev) => [...prev, messageData as ChatMessage]);

            socketRef.current?.emit("send_message", messageData, (ackId: string) => {
                // Acknowledge received
                console.log("Message sent, ID:", ackId);
            });

            setNewMessage("");

            // Update local contact list sort order immediately
            setContacts(prev => prev.map(c =>
                c._id === selectedContact._id
                    ? { ...c, lastMessage: newMessage.trim(), lastMessageTime: new Date() }
                    : c
            ).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));

        } catch (err) {
            console.error("Error sending message:", err);
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
                                    {contact.avatar ? (
                                        <img
                                            src={contact.avatar}
                                            alt={contact.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                                            {getInitials(contact.name)}
                                        </div>
                                    )}
                                </div>

                                <div className="ml-3 flex-1 text-left overflow-hidden">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                                            {formatLastMessageTime(contact.lastMessageTime || "")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
                                    <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage || "No messages yet"}</p>
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
                                    {selectedContact.avatar ? (
                                        <img
                                            src={selectedContact.avatar}
                                            alt={selectedContact.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
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