import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../profile/navbar';


const ChatLayout = () => {
  const [isSidebarOpen] = useState(true);

  return (
    <div className="h-screen bg-white  text-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex pt-16 relative overflow-hidden">
    
        <div className={`flex-1 flex flex-col bg-white  h-full overflow-hidden ${
          !isSidebarOpen ? 'block' : 'hidden lg:flex'
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
