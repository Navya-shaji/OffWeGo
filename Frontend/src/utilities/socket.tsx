/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useRef, useMemo } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { addNotification } from "@/store/slice/Notifications/notificationSlice";
import { toast } from "react-hot-toast";

interface SocketContextType {
    socket: Socket | null;
}

export const socketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(socketContext);
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const socketRef = useRef<Socket | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
    const dispatch = useDispatch();

    const userId = user?.id || vendor?.id;
    const role = user ? "user" : vendor ? "vendor" : null;

    useEffect(() => {
        if (userId && role) {
            // Prevent redundant connections if already connecting/connected to the same ID
            if (socketRef.current && (socketRef.current as any)._connectedUserId === userId) {
                return;
            }

            let socketUrl = (import.meta.env.VITE_SOCKET_URL && !import.meta.env.VITE_SOCKET_URL.includes("undefined"))
                ? import.meta.env.VITE_SOCKET_URL
                : window.location.origin;

            // Fix for production deployment where localhost might be hardcoded in environment variables
            if (socketUrl.includes("localhost") && window.location.hostname !== "localhost") {
                console.log("🛠️ Auto-fixing localhost socket URL for production hostname:", window.location.hostname);
                socketUrl = socketUrl.replace("localhost", window.location.hostname);
            }
            console.log(`🔌 Initializing socket connection for ${role} (${userId}) to:`, socketUrl);

            const newSocket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
                withCredentials: true,
            });

            (newSocket as any)._connectedUserId = userId;

            newSocket.on("connect", () => {
                console.log("Socket connected:", newSocket.id);
                // Register based on role
                if (role === 'user') {
                    newSocket.emit("register_user", { userId });
                } else {
                    newSocket.emit("register_vendor", { vendorId: userId });
                }
            });

            newSocket.on("disconnect", () => {
                console.log("Socket disconnected");
            });

            newSocket.on("error", (error) => {
                console.error("Socket error:", error);
            });

            // Enhanced notification handling
            newSocket.on("new-message-notification", (data: {
                chatId: string;
                senderName?: string;
                messagePreview?: string;
            }) => {
                console.log("📬 New message notification received:", data);

                // Add to Redux store
                dispatch(
                    addNotification({
                        title: `New message from ${data.senderName || 'Someone'}`,
                        body: data.messagePreview || "You have a new message",
                    })
                );

                // Show toast only if not on the chat page
                if (window.location.pathname !== `/chat/${data.chatId}` &&
                    window.location.pathname !== `/vendor/chat/${data.chatId}`) {
                    toast(`New message from ${data.senderName || 'Someone'}`, { icon: 'ℹ️' });
                }
            });

            setSocket(newSocket);
            socketRef.current = newSocket;

            return () => {
                console.log("🔌 Disconnecting socket for:", userId);
                newSocket.disconnect();
                socketRef.current = null;
                setSocket(null);
            };
        } else {
            if (socketRef.current) {
                console.log("🔌 No user ID, disconnecting existing socket");
                socketRef.current.disconnect();
                socketRef.current = null;
                setSocket(null);
            }
        }
    }, [userId, role]);

    const contextValue = useMemo(() => ({ socket }), [socket]);

    return (
        <socketContext.Provider value={contextValue}>
            {children}
        </socketContext.Provider>
    );
};
