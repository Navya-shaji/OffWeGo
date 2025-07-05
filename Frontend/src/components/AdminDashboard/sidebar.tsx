import React from 'react';
import {
  Users,
  Plus,
  MapPin,
  Grid3x3,
  UserCheck,
  FileText
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: Grid3x3, label: 'Dashboard' },
    { icon: Users, label: 'Users' },
    { icon: UserCheck, label: 'Vendors' },
    { icon: MapPin, label: 'Destinations' },
    { icon: FileText, label: 'Request' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg relative">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="text-2xl font-bold text-gray-800">OffWeGo 🕊️</div>
       
        </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(item.label)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
              item.label === activeTab ? 'bg-gray-100 border-r-4 border-black' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3 text-gray-600" />
            <span className="text-gray-700">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-4 left-4">
        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-black rounded-lg hover:bg-purple-200 transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Destinations</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
