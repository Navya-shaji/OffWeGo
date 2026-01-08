import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { addNotification } from "@/store/slice/Notifications/notificationSlice";
import { toast } from "react-toastify";

// Define notification data type
interface MessageNotificationData {
    senderName?: string;
    messagePreview?: string;
    chatId: string;
}

interface SocketContextType {
    socket: Socket | null;
}

export const socketContext = createContext<SocketContextType | null>(null);

export const useSocket = () => {
    const context = useContext(socketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const vendor = useSelector((state: RootState) => state.vendorAuth.vendor);
    const dispatch = useDispatch();

    useEffect(() => {
        const role = user ? "user" : vendor ? "vendor" : null;
        const userId = user?.id || vendor?.id;

        if (userId && role) {
            const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '') || "http://localhost:1212";
            const newSocket = io(socketUrl, {
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionDelay: 1000,
            });

            newSocket.on("connect", () => {
                // eslint-disable-next-line no-console
                console.log("Socket connected:", newSocket.id);
                // Register based on role
                if (user) {
                    newSocket.emit("register_user", { userId });
                } else if (vendor) {
                    newSocket.emit("register_vendor", { vendorId: userId });
                }
            });

            newSocket.on("disconnect", () => {
                // eslint-disable-next-line no-console
                console.log("Socket disconnected");
            });

            newSocket.on("error", (error) => {
                // eslint-disable-next-line no-console
                console.error("Socket error:", error);
            });

           
            newSocket.on("new-message-notification", (data: MessageNotificationData) => {
                // eslint-disable-next-line no-console
                console.log("📬 New message notification received:", data);
                
                // Add to Redux store
                dispatch(
                    addNotification({
                        title: `New message from ${data.senderName || 'Someone'}`,
                        body: data.messagePreview || "You have a new message",
                    })
                );

                // Show toast only if not on the specific chat page
                if (window.location.pathname !== `/chat/${data.chatId}`) {
                    toast.info(`New message from ${data.senderName || 'Someone'}`);
                }
            });

            setSocket(newSocket);

            return () => {
                newSocket.disconnect();
            };
        } else {
            if (socket) {
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [user, vendor, dispatch]);

    return (
        <socketContext.Provider value={{ socket }}>
            {children}
        </socketContext.Provider>
    );
};
