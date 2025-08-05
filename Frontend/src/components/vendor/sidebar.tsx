import React, { useState } from "react";
import {
  User,
  MapPin,
  Package,
  FolderPlus,
  List,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const VendorSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);

  const menuItems = [
    { icon: User, label: "Profile" },
    {icon :Plus,label:"Add Destination"},
    { icon: MapPin, label: "All Destinations" },
  ];

  const handlePackageClick = () => {
    setShowPackageDropdown((prev) => !prev);
  };

  const handleSubTabClick = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div className="w-64 bg-white shadow-lg relative h-screen overflow-y-auto">
      <div className="p-6">
        <div className="text-2xl font-bold text-gray-800">Vendor Panel </div>
      </div>

      <nav className="mt-6">
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(item.label)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
              item.label === activeTab
                ? "bg-gray-100 border-r-4 border-black"
                : ""
            }`}
          >
            <item.icon className="w-5 h-5 mr-3 text-gray-600" />
            <span className="text-gray-700">{item.label}</span>
          </button>
        ))}

       
        <button
          onClick={handlePackageClick}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Package")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <Package className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Packages</span>
          {showPackageDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showPackageDropdown && (
          <div className="ml-10">
            <button
              onClick={() => handleSubTabClick("Add Package")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Add Package"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <FolderPlus className="inline-block mr-2 w-4 h-4" />
              Add Package
            </button>
            <button
              onClick={() => handleSubTabClick("All Packages")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "All Packages"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <List className="inline-block mr-2 w-4 h-4" />
              All Packages
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default VendorSidebar;
