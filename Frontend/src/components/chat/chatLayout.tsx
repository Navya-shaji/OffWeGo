import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../profile/navbar';
import ChatSidebar from '@/pages/User/chat/sidebar';
import { ChatProvider } from '@/context/chatContext'; 


const ChatLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <ChatProvider>
      <div className="h-screen bg-white  text-black flex flex-col">
        <Navbar />
        <div className="flex-1 flex pt-16 relative overflow-hidden">
      
          <ChatSidebar 
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />

          <div className={`flex-1 flex flex-col bg-white  h-full overflow-hidden ${
            !isSidebarOpen ? 'block' : 'hidden lg:flex'
          }`}>
            <Outlet />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatLayout;
