// import { useState, useEffect, useRef } from "react";
// import { Send, Loader2, MessageCircle, ArrowLeft } from "lucide-react";
// import { getMessages, sendMessage, type ChatMessage } from "@/services/chat/chatService";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import type { RootState } from "@/store/store";

// interface Contact {
//   id: string;
//   name: string;
//   role: string;
//   avatar?: string;
//   lastMessage?: string;
//   lastMessageTime?: Date | string;
// }

// const ChatPage = () => {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [contacts, setContacts] = useState<Contact[]>([]);
//   const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showContacts, setShowContacts] = useState(true);
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();

//   const senderId = useSelector((state: RootState) => state.auth.user?.id);
//   const senderRole = useSelector((state: RootState) => state.auth.user?.role) || "user";

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Extract unique contacts from messages
//   const extractContacts = (msgs: ChatMessage[]): Contact[] => {
//     if (!msgs || msgs.length === 0) return [];
    
//     const contactMap = new Map<string, Contact>();

//     msgs.forEach((msg) => {
//       const isOwnMessage = msg.senderId === senderId;
//       const contactId = isOwnMessage ? msg.receiverId : msg.senderId;
//       const contactRole = isOwnMessage ? msg.receiverRole : msg.senderRole;

//       if (!contactMap.has(contactId)) {
//         contactMap.set(contactId, {
//           id: contactId,
//           name: `${contactRole.charAt(0).toUpperCase() + contactRole.slice(1)} ${contactId.slice(-4)}`,
//           role: contactRole,
//           lastMessage: msg.message,
//           lastMessageTime: msg.createdAt,
//         });
//       } else {
//         const existing = contactMap.get(contactId)!;
//         const existingTime = new Date(existing.lastMessageTime || 0);
//         const currentTime = new Date(msg.createdAt);

//         if (currentTime > existingTime) {
//           existing.lastMessage = msg.message;
//           existing.lastMessageTime = msg.createdAt;
//         }
//       }
//     });

//     return Array.from(contactMap.values()).sort((a, b) => {
//       const timeA = new Date(a.lastMessageTime || 0).getTime();
//       const timeB = new Date(b.lastMessageTime || 0).getTime();
//       return timeB - timeA;
//     });
//   };

//   // Fetch messages on mount
//   useEffect(() => {
//     if (!senderId) {
//       navigate("/login");
//       return;
//     }

//     const fetchMessages = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching messages for senderId:", senderId);
        
//         const data = await getMessages(senderId);
        
//         console.log("=== DEBUG INFO ===");
//         console.log("Raw API response:", data);
//         console.log("Type of data:", typeof data);
//         console.log("Is array?", Array.isArray(data));
        
//         // The data should already be an array from your service
//         // but let's handle edge cases
//         let messagesArray: ChatMessage[] = [];
        
//         if (Array.isArray(data)) {
//           messagesArray = data;
//           console.log("✓ Data is an array with", messagesArray.length, "messages");
//         } else if (data && typeof data === 'object') {
//           console.log("Data is an object, keys:", Object.keys(data));
//           // Try common nested structures
//           messagesArray = (data as any).messages || (data as any).data || (data as any).chats || [];
//           console.log("Extracted messages array with", messagesArray.length, "messages");
//         } else {
//           console.warn("⚠ Unexpected data format:", data);
//           messagesArray = [];
//         }
        
//         if (messagesArray.length > 0) {
//           console.log("First message sample:", messagesArray[0]);
//         }
        
//         setMessages(messagesArray);
        
//         const extractedContacts = extractContacts(messagesArray);
//         console.log("Extracted contacts:", extractedContacts);
//         setContacts(extractedContacts);
        
//         // Auto-select first contact on desktop
//         if (extractedContacts.length > 0 && !selectedContact && window.innerWidth >= 768) {
//           setSelectedContact(extractedContacts[0]);
//         }
        
//         setError(null);
//       } catch (err) {
//         const errorMessage = err instanceof Error ? err.message : "Failed to load messages";
//         setError(errorMessage);
//         console.error("Error loading chat:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMessages();

//     // Poll for new messages every 5 seconds
//     const interval = setInterval(fetchMessages, 5000);
//     return () => clearInterval(interval);
//   }, [senderId, navigate]);

//   const handleContactSelect = (contact: Contact) => {
//     console.log("Selected contact:", contact);
//     setSelectedContact(contact);
//     setShowContacts(false);
//   };

//   const handleBackToContacts = () => {
//     setShowContacts(true);
//   };

//   const handleSendMessage = async () => {
//     if (!newMessage.trim() || !selectedContact || !senderId) return;

//     const messageData = {
//       senderId,
//       receiverId: selectedContact.id,
//       senderRole,
//       receiverRole: selectedContact.role,
//       message: newMessage.trim(),
//     };

//     console.log("Sending message:", messageData);

//     try {
//       setSending(true);
//       const sentMessage = await sendMessage(messageData);
//       console.log("Message sent successfully:", sentMessage);
      
//       setMessages((prev) => [...prev, sentMessage]);
      
//       // Update contact's last message
//       setContacts((prevContacts) =>
//         prevContacts.map((contact) =>
//           contact.id === selectedContact.id
//             ? {
//                 ...contact,
//                 lastMessage: sentMessage.message,
//                 lastMessageTime: sentMessage.createdAt,
//               }
//             : contact
//         )
//       );
      
//       setNewMessage("");
//       setError(null);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : "Failed to send message";
//       setError(errorMessage);
//       console.error("Error sending message:", err);
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   const formatTime = (date: Date | string) => {
//     const dateObj = typeof date === "string" ? new Date(date) : date;
//     if (isNaN(dateObj.getTime())) return "Invalid time";
//     return dateObj.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
//   };

//   const formatLastMessageTime = (date: Date | string) => {
//     const dateObj = typeof date === "string" ? new Date(date) : date;
//     if (isNaN(dateObj.getTime())) return "";

//     const now = new Date();
//     const diff = now.getTime() - dateObj.getTime();
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) {
//       return formatTime(dateObj);
//     } else if (days === 1) {
//       return "Yesterday";
//     } else if (days < 7) {
//       return `${days}d ago`;
//     } else {
//       return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
//     }
//   };

//   const getInitials = (name: string) =>
//     name
//       .split(" ")
//       .map((word) => word[0])
//       .join("")
//       .toUpperCase()
//       .slice(0, 2);

//   const getFilteredMessages = () => {
//     if (!selectedContact) {
//       console.log("No contact selected");
//       return [];
//     }
    
//     const filtered = messages.filter(
//       (msg) =>
//         (msg.senderId === senderId && msg.receiverId === selectedContact.id) ||
//         (msg.senderId === selectedContact.id && msg.receiverId === senderId)
//     );
    
//     console.log(`Filtered ${filtered.length} messages for contact ${selectedContact.id} (${selectedContact.name})`);
//     return filtered;
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-screen bg-gray-50">
//         <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-50">
//       {/* Contacts Sidebar */}
//       <div
//         className={`${
//           showContacts ? "block" : "hidden"
//         } md:block w-full md:w-80 bg-white border-r flex flex-col`}
//       >
//         {/* Contacts Header */}
//         <div className="px-6 py-4 border-b">
//           <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
//           <p className="text-sm text-gray-500 mt-1">{contacts.length} conversations</p>
//         </div>

//         {/* Contacts List */}
//         <div className="flex-1 overflow-y-auto">
//           {error && (
//             <div className="m-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//               {error}
//             </div>
//           )}
          
//           {contacts.length === 0 ? (
//             <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
//               <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
//               <p className="text-center">No conversations yet</p>
//               <p className="text-sm text-center mt-1">Start chatting with vendors</p>
//             </div>
//           ) : (
//             contacts.map((contact) => (
//               <button
//                 key={contact.id}
//                 onClick={() => handleContactSelect(contact)}
//                 className={`w-full px-4 py-3 flex items-start hover:bg-gray-50 transition-colors border-b ${
//                   selectedContact?.id === contact.id ? "bg-blue-50" : ""
//                 }`}
//               >
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
//                   {getInitials(contact.name)}
//                 </div>
//                 <div className="ml-3 flex-1 text-left overflow-hidden">
//                   <div className="flex justify-between items-baseline">
//                     <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
//                     <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
//                       {formatLastMessageTime(contact.lastMessageTime || "")}
//                     </span>
//                   </div>
//                   <p className="text-sm text-gray-500 capitalize">{contact.role}</p>
//                   <p className="text-sm text-gray-600 truncate mt-1">{contact.lastMessage}</p>
//                 </div>
//               </button>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Chat Area */}
//       <div
//         className={`${
//           showContacts ? "hidden" : "flex"
//         } md:flex flex-col flex-1 bg-gray-50`}
//       >
//         {selectedContact ? (
//           <>
//             {/* Chat Header */}
//             <div className="bg-white border-b px-6 py-4 shadow-sm">
//               <div className="flex items-center">
//                 <button
//                   onClick={handleBackToContacts}
//                   className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden"
//                   aria-label="Back to contacts"
//                 >
//                   <ArrowLeft className="w-5 h-5" />
//                 </button>

//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
//                   {getInitials(selectedContact.name)}
//                 </div>

//                 <div className="ml-3">
//                   <h2 className="font-semibold text-gray-900">{selectedContact.name}</h2>
//                   <p className="text-sm text-gray-500 capitalize">{selectedContact.role}</p>
//                 </div>
//               </div>
//             </div>

//             {/* Messages Container */}
//             <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
//               {getFilteredMessages().length === 0 ? (
//                 <div className="text-center text-gray-500 mt-8">
//                   <p>No messages yet.</p>
//                   <p className="text-sm mt-1">Start the conversation with {selectedContact.name}!</p>
//                 </div>
//               ) : (
//                 getFilteredMessages().map((msg) => {
//                   const isOwnMessage = msg.senderId === senderId;
//                   return (
//                     <div key={msg._id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
//                       <div
//                         className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl ${
//                           isOwnMessage
//                             ? "bg-blue-500 text-white rounded-br-none"
//                             : "bg-white text-gray-900 rounded-bl-none shadow-sm"
//                         }`}
//                       >
//                         <p className="break-words">{msg.message}</p>
//                         <p className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
//                           {formatTime(msg.createdAt)}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })
//               )}
//               <div ref={messagesEndRef} />
//             </div>

//             {/* Input Area */}
//             <div className="bg-white border-t px-4 py-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="text"
//                   value={newMessage}
//                   onChange={(e) => setNewMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder={`Message ${selectedContact.name}...`}
//                   disabled={sending}
//                   className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 />
//                 <button
//                   onClick={handleSendMessage}
//                   disabled={sending || !newMessage.trim()}
//                   className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                   aria-label="Send message"
//                 >
//                   {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
//                 </button>
//               </div>
//             </div>
//           </>
//         ) : (
//           <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
//             <div className="text-center">
//               <MessageCircle className="w-20 h-20 mx-auto mb-4 text-gray-300" />
//               <p className="text-lg font-medium">Select a conversation</p>
//               <p className="text-sm mt-1">Choose a contact to start messaging</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatPage;