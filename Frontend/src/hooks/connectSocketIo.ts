import { io } from 'socket.io-client'

const url = import.meta.env.VITE_SOCKET_URL;
let socketUrl = (url && !url.includes("undefined")) ? url : window.location.origin;

if (socketUrl.includes("localhost") && window.location.hostname !== "localhost") {
  console.log("🛠️ Auto-fixing legacy socket URL for production. Forcing use of:", window.location.origin);
  socketUrl = window.location.origin;
}

const getToken = () => {
  const userToken = localStorage.getItem('userToken');
  const vendorToken = localStorage.getItem('vendorToken');
  return userToken || vendorToken;
};

const token = getToken();

const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: false,
});


console.warn("Legacy socket singleton accessed. Use useSocket() instead.");

socket.on('connect', () => {
  console.log(" Socket CONNECTED! ID:", socket.id);
});

socket.on('connect_error', (err) => {
  console.error(" Socket connection ERROR:", err.message);
  console.error("Full error:", err);
})

socket.on('disconnect', (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});


if (!token) {
  console.warn("No token found - socket will not auto-connect. SocketManager will handle connection when user logs in.");
}
export default socket