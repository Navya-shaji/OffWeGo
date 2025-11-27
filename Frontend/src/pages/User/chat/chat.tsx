import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import ChatSidebar from './sidebar';

const ChatPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#212121]">
      <ChatSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          <Outlet />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatPage