/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from "react";
import { Send, Loader2, MessageCircle, ArrowLeft, Check, CheckCheck, X, Smile, Image as ImageIcon, MapPin } from "lucide-react";
import { getMessages, getChatsOfUser, markMessagesAsSeen } from "@/services/chat/chatService";
import { uploadToCloudinary } from "@/utilities/cloudinaryUpload";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Socket } from "socket.io-client";
import { useSocket } from "@/utilities/socket";
import { toast } from "react-toastify";
import { useChatContext } from "@/context/chatContext";
import EmojiPicker from "emoji-picker-react";
import { motion, AnimatePresence } from "framer-motion";

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
    messageType?: "text" | "image" | "voice" | "file" | "location";
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
    tempId?: string;
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
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const autoScrollRef = useRef(true);
    const initialScrollRef = useRef(false);
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId?: string }>();
    const socketRef = useRef<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [sendingLocation, setSendingLocation] = useState(false);
    const [showLocationConfirm, setShowLocationConfirm] = useState(false);

    const { markChatAsRead } = useChatContext();

    const user = useSelector((state: RootState) => state.auth.user);
    const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);

    const senderId = user?.id || vendor?.id;
    const senderRole = user ? (user.role || "user") : (vendor ? "vendor" : "user");

    const formatTime = (value: Date | string) => {
        const d = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(d.getTime())) return "";
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const canDeleteMessage = (sendedTime: Date | string) => {
        const sentDate = sendedTime instanceof Date ? sendedTime : new Date(sendedTime);
        const now = new Date();
        const diffInMinutes = (now.getTime() - sentDate.getTime()) / (1000 * 60);
        return diffInMinutes <= 10;
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

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file");
            return;
        }

        try {
            setIsUploading(true);
            const imageUrl = await uploadToCloudinary(file);
            await handleSendMessage("", imageUrl, "image");
        } catch (error) {
            console.error("Image upload failed:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleSendMessage = async (text?: string, fileUrl?: string, messageType: "text" | "image" | "location" = "text") => {
        if (!selectedContact || !senderId) return;

        const content = text !== undefined ? text.trim() : newMessage.trim();
        if (!content && !fileUrl) return;

        const receiverIdRaw = senderRole === "vendor" ? selectedContact.userId : selectedContact.vendorId;
        const receiverId = typeof receiverIdRaw === "object" && receiverIdRaw !== null
            ? ((receiverIdRaw as any)._id || (receiverIdRaw as any).id || String(receiverIdRaw))
            : String(receiverIdRaw || "");
        const senderType = senderRole === "vendor" ? "vendor" : "user";

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
            messageContent: content || (messageType === 'image' ? 'Sent an image' : (messageType === 'location' ? 'Shared Location' : '')),
            seen: false,
            sendedTime: now,
            fileUrl: fileUrl || '',
            messageType: messageType,
            replyTo: replyPayload,
            tempId: tempId,
        };

        if (messageType === 'text') {
            setNewMessage("");
        }
        // No need for else if (messageType === 'image') { handleSendMessage("", fileUrl, "image"); }
        // The current call to handleSendMessage already passes the correct messageType and fileUrl.
        // The original else if (messageType === 'image' || messageType === 'location') block was for ensuring content,
        // which is now handled in the payload.messageContent assignment.
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
                messageType: messageType,
                fileUrl: fileUrl || payload.fileUrl,
                replyTo: replyingTo
                    ? {
                        _id: replyingTo._id,
                        messageContent: replyingTo.messageContent,
                        senderName: (replyPayload && typeof replyPayload === 'object' && 'senderName' in replyPayload) ? (replyPayload as any).senderName : "",
                    }
                    : undefined,
            },
        ]));

        setContacts(prev => prev.map(c => {
            if (c._id !== selectedContact._id) return c;
            return {
                ...c,
                lastMessage: payload.messageContent,
                lastMessageTime: now
            };
        }).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));

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

    const handleEmojiClick = (emojiObject: any) => {
        const emoji = emojiObject.emoji;
        setNewMessage(prev => prev + emoji);
        setShowEmojiPicker(false);
        const inputElement = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (inputElement) {
            inputElement.focus();
        }
    };

    const handleSendLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setSendingLocation(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                if (!latitude || !longitude) {
                    toast.error("Invalid coordinates received");
                    setSendingLocation(false);
                    return;
                }
                const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
                handleSendMessage("Shared Location", locationUrl, "location");
                toast.success(`Location sent! (Accuracy: ${Math.round(accuracy)}m)`);
                setSendingLocation(false);
            },
            (error) => {
                let errorMessage = "Failed to get your location.";
                if (error.code === error.PERMISSION_DENIED) {
                    errorMessage = "Location permission denied. Please allow location access.";
                } else if (error.code === error.POSITION_UNAVAILABLE) {
                    errorMessage = "Location information is unavailable.";
                } else if (error.code === error.TIMEOUT) {
                    errorMessage = "The request to get user location timed out.";
                }
                toast.error(errorMessage);
                setSendingLocation(false);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showEmojiPicker]);

    const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
        messagesEndRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (autoScrollRef.current) {
            scrollToBottom(initialScrollRef.current ? "auto" : "smooth");
        }
        autoScrollRef.current = false;
        initialScrollRef.current = false;
    }, [messages]);

    const { socket: globalSocket } = useSocket() || {};

    useEffect(() => {
        if (!senderId || !globalSocket) return;

        const socket = globalSocket;
        socketRef.current = socket;

        // Registration is now handled by SocketProvider on connect.
        // We only need to set up listeners here.

        const handleReceiveMessage = (newMessage: ChatMessage) => {
            // Update messages list if it's the current chat
            if (String(newMessage.chatId) === String(selectedContact?._id)) {
                autoScrollRef.current = true;
                setMessages((prev) => {
                    // Check if we already have this message by Real ID
                    if (prev.some(msg => String(msg._id) === String(newMessage._id))) return prev;

                    // Check if we have this message by Temp ID (optimistically added)
                    // If so, replace the optimistic message with the real one from server
                    if (newMessage.tempId) {
                        const tempIndex = prev.findIndex(msg => msg._id === newMessage.tempId);
                        if (tempIndex !== -1) {
                            const updated = [...prev];
                            // Ensure delivery status is 'sent' as it came back from server
                            updated[tempIndex] = { ...newMessage, deliveryStatus: 'sent' };
                            return updated;
                        }
                    }

                    return [...prev, newMessage];
                });
            }

            // Always update the contacts list (sidebar) regardless of which chat is open
            setContacts(prev => prev.map(contact => {
                if (String(contact._id) === String(newMessage.chatId)) {
                    const isFromCurrentUser = String(newMessage.senderId) === String(senderId);
                    const isCurrentChat = String(contact._id) === String(selectedContact?._id);
                    const shouldIncrement = !isFromCurrentUser && !isCurrentChat;

                    return {
                        ...contact,
                        lastMessage: newMessage.messageContent,
                        lastMessageTime: newMessage.sendedTime,
                        unreadCount: isCurrentChat ? 0 : (shouldIncrement ? (contact.unreadCount || 0) + 1 : (contact.unreadCount || 0))
                    };
                }
                return contact;
            }).sort((a, b) => new Date(b.lastMessageTime || 0).getTime() - new Date(a.lastMessageTime || 0).getTime()));
        };

        socket.on("receive-message", handleReceiveMessage);
        socket.on("user-status-changed", (data: any) => setOnlineUsers(prev => {
            const next = new Set(prev);
            if (data.isOnline) next.add(data.userId); else next.delete(data.userId);
            return next;
        }));
        socket.on("vendor-status-changed", (data: any) => setOnlineUsers(prev => {
            const next = new Set(prev);
            if (data.isOnline) next.add(data.vendorId); else next.delete(data.vendorId);
            return next;
        }));
        socket.on("online-users", (data: any) => setOnlineUsers(new Set(data.onlineIds || [])));
        socket.on("messages-seen", (data: any) => {
            setContacts(prev => prev.map(c => c._id === data.chatId ? { ...c, unreadCount: 0 } : c));
            if (selectedContact?._id === data.chatId) {
                setMessages(prev => prev.map(m => m.senderId === senderId ? { ...m, seen: true } : m));
            }
        });
        socket.on("typing", (data: any) => {
            if (data.userId === senderId) return;
            setTypingUsers(prev => {
                if (prev.some(u => u.userId === data.userId)) return prev;
                return [...prev, { userId: data.userId, name: selectedContact?.name || "", isTyping: true }];
            });
        });
        socket.on("stop-typing", (data: { userId: string }) => setTypingUsers(prev => prev.filter(u => u.userId !== data.userId)));
        socket.on("message_deleted", (data: { chatId: string, messageId: string }) => {
            if (data.chatId === selectedContact?._id) {
                setMessages(prev => prev.map(m => m._id === data.messageId ? { ...m, isDeleted: true, messageContent: "This message was deleted" } : m));
            }
        });

        return () => {
            socket.off("receive-message", handleReceiveMessage);
            socket.off("user-status-changed");
            socket.off("vendor-status-changed");
            socket.off("messages-seen");
            socket.off("typing");
            socket.off("stop-typing");
            socket.off("message_deleted");
            socket.off("online-users");
        };
    }, [senderId, selectedContact, globalSocket, senderRole]);

    useEffect(() => {
        setContacts(prev => prev.map(contact => {
            const oid = (senderRole === 'user') ? String(contact.vendorId || '') : String(contact.userId || '');
            return { ...contact, isOnline: onlineUsers.has(oid) };
        }));
    }, [onlineUsers, senderRole]);

    useEffect(() => {
        if (!senderId) { navigate("/login"); return; }
        const fetchContacts = async () => {
            try {
                setLoading(true);
                const userType = vendor ? 'vendor' : 'user';
                const res = await getChatsOfUser(senderId, userType);
                const chatsData = res?.data?.chats || res?.data || res || [];
                const formatted = chatsData.map((chat: any) => {
                    const isUser = senderRole === 'user';
                    const target = isUser ? chat.vendorId : chat.userId;
                    const name = target?.name || target?.username || chat.name || "Unknown";
                    const avatar = target?.profileImage || target?.imageUrl || chat.profile_image || "";
                    const vid = chat.vendorId?._id || chat.vendorId || null;
                    const uid = chat.userId?._id || chat.userId || null;
                    return {
                        _id: chat._id,
                        name,
                        role: isUser ? 'vendor' : 'user',
                        avatar,
                        lastMessage: chat.lastMessage || "",
                        lastMessageTime: chat.lastMessageAt || new Date(),
                        vendorId: vid,
                        userId: uid,
                        unreadCount: Math.max(0, chat.unreadCount || 0),
                        isOnline: onlineUsers.has(isUser ? String(vid) : String(uid))
                    };
                });
                setContacts(formatted);
                if (chatId) {
                    const found = formatted.find((c: Contact) => c._id === chatId);
                    if (found) { setSelectedContact(found); setShowContacts(false); }
                }
            } catch { setError("Failed to load contacts"); } finally { setLoading(false); }
        };
        fetchContacts();
    }, [senderId, senderRole, chatId, navigate, onlineUsers, vendor]);

    useEffect(() => {
        if (!selectedContact || !senderId || !globalSocket) return;

        const fetchMessages = async () => {
            try {
                const userType = vendor ? 'vendor' : 'user';
                const res = await getMessages(selectedContact._id, userType);
                const msgs = res?.data?.messages || res?.data || res || [];
                setMessages(msgs);
                initialScrollRef.current = true;
                autoScrollRef.current = true;

                // Always ensure room is joined when messages are fetched or socket becomes ready
                if (globalSocket.connected) {
                    console.log("🚪 Joining room:", selectedContact._id);
                    globalSocket.emit("join_room", { roomId: selectedContact._id });
                } else {
                    // If not connected yet, wait for connection then join
                    globalSocket.once("connect", () => {
                        console.log("🚪 Joining room on reconnect:", selectedContact._id);
                        globalSocket.emit("join_room", { roomId: selectedContact._id });
                    });
                }

                markMessagesAsSeen(selectedContact._id, senderId, userType).catch(() => { });
            } catch (err) {
                console.error("Error fetching messages:", err);
                setMessages([]);
            }
        };
        fetchMessages();
    }, [selectedContact, senderId, vendor, globalSocket]);

    const loadOlderMessages = async () => {
        if (!selectedContact || !senderId || loadingMoreMessages || !hasMoreMessages || messages.length === 0) return;

        try {
            setLoadingMoreMessages(true);
            autoScrollRef.current = false;
            const container = messagesContainerRef.current;
            const prevScrollHeight = container?.scrollHeight || 0;
            const prevScrollTop = container?.scrollTop || 0;

            const userType = vendor ? 'vendor' : 'user';
            const res = await getMessages(selectedContact._id, userType, {
                before: messages[0]?.sendedTime,
                limit: 30
            });
            const older = res?.data?.messages || res?.data || res || [];
            if (!Array.isArray(older) || older.length === 0) {
                setHasMoreMessages(false);
                return;
            }

            setMessages(prev => {
                const existing = new Set(prev.map(m => m._id));
                const dedupedOlder = (Array.isArray(older) ? older : []).filter(m => !existing.has(m._id));
                return [...dedupedOlder, ...prev];
            });

            requestAnimationFrame(() => {
                const c = messagesContainerRef.current;
                if (!c) return;
                c.scrollTop = prevScrollTop + (c.scrollHeight - prevScrollHeight);
            });
        } catch (error) {
            console.error("Error loading older messages:", error);
        } finally {
            setLoadingMoreMessages(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-screen bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;

    return (
        <div className="flex flex-col h-screen bg-[#f8fafc] font-sans">
            <div className="flex flex-1 overflow-hidden">
                {/* Contacts Sidebar */}
                <div className={`
                    ${showContacts ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                    fixed md:relative inset-0 z-30
                    w-full md:w-80 bg-white border-r flex flex-col shadow-sm transition-transform duration-300 ease-in-out
                `}>
                    <div className="px-5 py-5 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3 mb-5">
                            <button
                                onClick={() => navigate(senderRole === "vendor" ? "/vendor/profile" : "/")}
                                className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors flex items-center justify-center"
                                title="Back to Dashboard"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <img
                                src={logo}
                                alt="OffWeGo"
                                className="w-24 h-auto cursor-pointer"
                                onClick={() => navigate(senderRole === "vendor" ? "/vendor/profile" : "/")}
                            />
                            <div className="ml-auto h-5 w-5 rounded-md bg-blue-600/10 text-blue-600 flex items-center justify-center text-[10px] font-bold">{contacts.length}</div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><MapPin className="w-4 h-4 text-slate-400" /></div>
                            <input type="text" placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-10 pl-11 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
                        {error && <div className="p-4 mx-4 my-2 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg border border-red-100">{error}</div>}
                        {contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(contact => (
                            <button key={contact._id} onClick={() => handleContactSelect(contact)} className={`w-full px-4 py-4 flex items-center gap-3 transition-all border-l-4 ${selectedContact?._id === contact._id ? "bg-blue-50 border-blue-600" : "border-transparent hover:bg-slate-50"}`}>
                                <div className="relative w-11 h-11 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-sm">
                                    {contact.avatar ? <img src={contact.avatar} className="w-full h-full object-cover" alt={contact.name} /> : <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold text-sm">{getInitials(contact.name)}</div>}
                                    {contact.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>}
                                </div>
                                <div className="flex-1 text-left overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold truncate text-sm text-slate-900">{contact.name}</h3>
                                        {(contact.unreadCount ?? 0) > 0 && <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.2rem] text-center">{contact.unreadCount}</span>}
                                    </div>
                                    <p className="text-xs truncate text-slate-400 mt-0.5">{contact.lastMessage || `Chat with ${contact.role}`}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`
                    flex flex-col flex-1 bg-[#F0F4F8] relative overflow-hidden transition-all duration-300
                    ${!showContacts ? "translate-x-0" : "translate-x-full md:translate-x-0"}
                    md:flex md:static absolute inset-0 z-20
                `}>
                    {selectedContact ? (
                        <>
                            {/* Mobile/Desktop Header */}
                            <div className="bg-white/90 backdrop-blur-md px-4 md:px-8 py-3 md:py-5 shadow-sm border-b border-white z-20 flex items-center justify-between sticky top-0">
                                <div className="flex items-center gap-2 md:gap-4">
                                    <button onClick={handleBackToContacts} className="p-2 -ml-2 hover:bg-slate-100 rounded-full md:hidden text-slate-500 transition-colors">
                                        <ArrowLeft size={22} />
                                    </button>
                                    <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-sm border border-slate-100">
                                        {selectedContact.avatar ? (
                                            <img src={selectedContact.avatar} className="w-full h-full object-cover" alt={selectedContact.name} />
                                        ) : (
                                            <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm md:text-base">
                                                {getInitials(selectedContact.name)}
                                            </div>
                                        )}
                                        {selectedContact.isOnline && <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h2 className="font-bold text-slate-800 text-sm md:text-base truncate">{selectedContact.name}</h2>
                                        <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none mt-0.5">
                                            {selectedContact.isOnline ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Messages List */}
                            <div
                                ref={messagesContainerRef}
                                onScroll={(e) => { if (e.currentTarget.scrollTop <= 80) loadOlderMessages(); }}
                                className="flex-1 overflow-y-auto px-3 md:px-8 py-4 md:py-6 space-y-4 relative z-0"
                            >
                                {loadingMoreMessages && <div className="flex justify-center py-2"><Loader2 className="animate-spin text-blue-500" size={16} /></div>}
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-slate-400 opacity-60">
                                        <MessageCircle size={48} className="mb-2" />
                                        <p className="text-sm font-medium">No messages yet</p>
                                        <p className="text-xs">Say hello to start chatting!</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => {
                                        const isOwn = msg.senderId === senderId;
                                        const isDeleted = msg.isDeleted;
                                        return (
                                            <div key={msg._id} className={`flex w-full ${isOwn ? "justify-end" : "justify-start"} group`}>
                                                <div className={`flex max-w-[90%] md:max-w-[500px] gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
                                                    <div className={`relative group/bubble flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
                                                        {msg.replyTo && (
                                                            <div className="mb-1 mx-2 p-2 rounded-xl text-[10px] bg-white/50 border-l-4 border-blue-400 shadow-sm backdrop-blur-sm max-w-[200px] md:max-w-xs truncate">
                                                                <div className="font-bold text-blue-600">{msg.replyTo.senderName}</div>
                                                                <div className="text-slate-600 truncate opacity-80">{msg.replyTo.messageContent}</div>
                                                            </div>
                                                        )}
                                                        <div className={`
                                                            relative px-3 md:px-4 py-2 md:py-3 rounded-2xl shadow-sm transition-all
                                                            ${isOwn ? "bg-emerald-600 text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"}
                                                        `}>
                                                            {msg.messageType === 'location' && msg.fileUrl && !isDeleted && (
                                                                <div className="mb-2 w-56 md:w-64 h-40 md:h-48 rounded-lg overflow-hidden border border-slate-100">
                                                                    <iframe width="100%" height="100%" src={`https://maps.google.com/maps?q=${msg.fileUrl.split('q=')[1]?.split('&')[0]}&z=15&output=embed`} style={{ border: 0 }}></iframe>
                                                                </div>
                                                            )}
                                                            {msg.messageType === 'image' && msg.fileUrl && !isDeleted && (
                                                                <img src={msg.fileUrl} onClick={() => setPreviewImage(msg.fileUrl!)} className="mb-2 max-h-48 md:max-h-60 w-auto rounded-lg cursor-pointer hover:brightness-95 transition-all" alt="Shared" />
                                                            )}
                                                            <div className="relative">
                                                                <div className={`${isOwn ? "pr-10 md:pr-12" : "pr-8 md:pr-10"} pb-1`}>
                                                                    <p className={`whitespace-pre-wrap text-sm md:text-[15px] leading-relaxed ${isDeleted ? "italic opacity-60" : ""}`}>{msg.messageContent}</p>
                                                                </div>
                                                                <div className={`absolute bottom-0 right-0 flex items-center gap-1 text-[8px] md:text-[9px] font-bold ${isOwn ? "text-emerald-100" : "text-slate-300"}`}>
                                                                    <span>{formatTime(msg.sendedTime)}</span>
                                                                    {isOwn && !isDeleted && (msg.seen ? <CheckCheck size={10} className="md:w-3 md:h-3" /> : <Check size={10} className="md:w-3 md:h-3" />)}
                                                                </div>
                                                            </div>

                                                            {/* Action Buttons (Desktop Hover / Mobile Accessible) */}
                                                            <div className={`
                                                                absolute top-0 ${isOwn ? "-left-14" : "-right-14"} 
                                                                opacity-0 group-hover/bubble:opacity-100 transition-opacity flex gap-1 bg-white/90 p-1 rounded-full shadow-md z-10
                                                                md:flex hidden
                                                            `}>
                                                                <button onClick={() => handleReplyToMessage(msg)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-blue-600 transition-colors" title="Reply">
                                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                                                                </button>
                                                                {isOwn && !isDeleted && canDeleteMessage(msg.sendedTime) && (
                                                                    <button onClick={() => handleDeleteMessage(msg._id)} className="p-1.5 hover:bg-slate-100 rounded-full text-slate-500 hover:text-red-500 transition-colors" title="Delete">
                                                                        {deletingMessageId === msg._id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="px-3 md:px-6 py-3 md:py-4 bg-white/95 backdrop-blur-md border-t border-slate-100 z-20 relative">
                                <AnimatePresence>
                                    {replyingTo && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="mb-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                                            <div className="border-l-4 border-blue-500 pl-3 overflow-hidden">
                                                <p className="text-[10px] font-bold text-blue-600">
                                                    Replying to {replyingTo.senderId === senderId ? "You" : (selectedContact?.name || "Someone")}
                                                </p>
                                                <p className="text-[11px] text-slate-500 truncate">{replyingTo.messageContent}</p>
                                            </div>
                                            <button onClick={handleCancelReply} className="p-1 hover:bg-slate-200 rounded-full text-slate-400"><X size={14} /></button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {typingUsers.length > 0 && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute bottom-full left-4 mb-2 flex items-center gap-1.5 text-[9px] font-medium text-blue-500 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-blue-100/50">
                                            <div className="flex gap-0.5">
                                                <span className="h-0.5 w-0.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="h-0.5 w-0.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="h-0.5 w-0.5 bg-blue-500 rounded-full animate-bounce"></span>
                                            </div>
                                            <span>{typingUsers[0].name} is typing...</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="flex items-center gap-1 md:gap-3">
                                    <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-1.5 md:p-2 text-slate-400 hover:text-yellow-500 transition-colors hidden md:block">
                                        <Smile size={22} />
                                    </button>
                                    <button onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                                        <ImageIcon size={22} />
                                        <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                                    </button>
                                    <button onClick={() => setShowLocationConfirm(true)} className="p-2 text-slate-400 hover:text-green-500 transition-colors" disabled={sendingLocation}>
                                        {sendingLocation ? <Loader2 size={22} className="animate-spin text-green-500" /> : <MapPin size={22} />}
                                    </button>
                                    <input
                                        value={newMessage}
                                        onChange={(e) => { setNewMessage(e.target.value); handleTypingStart(); }}
                                        onKeyPress={handleKeyPress}
                                        onBlur={handleTypingStop}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-slate-100 border-none rounded-2xl h-10 px-4 text-sm focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                                    />
                                    <button
                                        onClick={() => handleSendMessage()}
                                        disabled={!newMessage.trim() && !isUploading}
                                        className="bg-emerald-600 text-white p-2.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 active:scale-95 disabled:opacity-50"
                                    >
                                        {sending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                                    </button>
                                </div>
                                {showEmojiPicker && (
                                    <div ref={emojiPickerRef} className="absolute bottom-20 left-4 z-50 shadow-2xl rounded-2xl overflow-hidden hidden md:block">
                                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="hidden md:flex flex-col items-center justify-center h-full text-center px-4 bg-white/50">
                            <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-blue-50/50 mb-6 border border-slate-50">
                                <MessageCircle size={80} className="text-blue-500 opacity-80" />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Chat</h2>
                            <p className="text-slate-500 max-w-sm font-medium">Select a contact to start messaging. Your local travel companions are waiting!</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showLocationConfirm && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6"><MapPin className="text-green-600" size={32} /></div>
                            <h3 className="text-xl font-bold mb-2">Share Location?</h3>
                            <p className="text-slate-500 text-sm mb-8">This will send your current coordinates to the chat. It helps vendors find you easily.</p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => { handleSendLocation(); setShowLocationConfirm(false); }} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all">Yes, Share Now</button>
                                <button onClick={() => setShowLocationConfirm(false)} className="w-full py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all">Maybe Later</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
                {previewImage && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setPreviewImage(null)}>
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative max-w-5xl max-h-[90vh]">
                            <img src={previewImage} className="max-w-full max-h-[90vh] object-contain rounded-lg" />
                            <button onClick={() => setPreviewImage(null)} className="absolute top-4 right-4 bg-white/20 p-2 rounded-full text-white hover:bg-white/40 backdrop-blur-md transition-all"><X size={24} /></button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatPage;