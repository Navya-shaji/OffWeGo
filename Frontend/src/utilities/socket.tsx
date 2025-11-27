import React, { useEffect, createContext } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import socket from "@/hooks/connectSocketIo";
import type { Socket } from "socket.io-client";

const context = {
  socket: socket,
};
export const socketContext = createContext<{ socket: Socket }>(context);

const SocketManager: React.FC<React.PropsWithChildren> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user) return;

    socket.connect();

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      // socket.emit("user-online", user._id);
      socket.emit("register_user", { userId: user.id });
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.disconnect();
    };
  }, [user]);

  return (
    <socketContext.Provider value={{ socket }}>
      {children}
    </socketContext.Provider>
  );
};

export default SocketManager;
