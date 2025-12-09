import { io } from 'socket.io-client'

const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5173'

// Get token from localStorage
const getToken = () => {
  const userToken = localStorage.getItem('userToken');
  const vendorToken = localStorage.getItem('vendorToken');
  return userToken || vendorToken;
};

const token = getToken();

// Remove trailing slash if present
const socketUrl = url.endsWith('/') ? url.slice(0, -1) : url;

console.log("🚀 Initializing socket...");
console.log("📍 Socket URL:", socketUrl);
console.log("🔑 Token available:", token ? "YES" : "NO");

const socket = io(socketUrl, {
  withCredentials: true,
  autoConnect: !!token, // Auto-connect if token exists
  auth: {
    token: token || ""
  },
  timeout: 10000,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000
});

socket.on('connect', () => {
  console.log("✅ Socket CONNECTED! ID:", socket.id);
});

socket.on('connect_error', (err) => {
  console.error("❌ Socket connection ERROR:", err.message);
  console.error("Full error:", err);
})

socket.on('disconnect', (reason) => {
  console.log("🔌 Socket disconnected:", reason);
});

// If no token initially, log a warning
if (!token) {
  console.warn("⚠️ No token found - socket will not auto-connect. SocketManager will handle connection when user logs in.");
} else {
  console.log("✨ Socket will auto-connect with token");
}

export default socket