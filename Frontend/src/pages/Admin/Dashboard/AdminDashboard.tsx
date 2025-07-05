import Navbar from '@/components/AdminDashboard/navbar';
import Sidebar from '@/components/AdminDashboard/sidebar';
import  { useState } from 'react';


const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <Navbar />
<h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-4">
  Dashboard
</h1>

      </div>
    </div>
  );
};

export default AdminLayout;

