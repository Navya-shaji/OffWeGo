import React, { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

interface ChatMessage {
  chatId: string;
  sender: string;
  text: string;
}

const ChatComponent: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:1212", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected:", socketRef.current?.id);
    });

    socketRef.current.on("receiveMessage", (data: ChatMessage) => {
      console.log("💬 Message received:", data);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return <div>Chat UI</div>; // ✅ Now works in .tsx
};

export default ChatComponent;
