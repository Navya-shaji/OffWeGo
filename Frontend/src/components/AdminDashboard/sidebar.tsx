import React, { useState } from "react";
import {
  Users,
  Plus,
  MapPin,
  Grid3x3,
  UserCheck,
  FileText,
  ChevronDown,
  ChevronUp,
  List,
  FolderPlus,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBannerDropdown, setShowBannerDropdown] = useState(false);
  const [showSubscriptionDropdown, setShowSubscriptionDropdown] = useState(false);

  const menuItems = [
    { icon: Grid3x3, label: "Dashboard" },
    { icon: Users, label: "Users" },
    { icon: UserCheck, label: "Vendors" },
    { icon: MapPin, label: "Destinations" },
  ];

  const handleRequestClick = () => {
    setShowRequestsDropdown((prev) => !prev);
  };

  const handleCategoryClick = () => {
    setShowCategoryDropdown((prev) => !prev);
  };

  const handleBannerClick = () => {
    setShowBannerDropdown((prev) => !prev);
  };

  const handleSubscriptionClick = () => {
    setShowSubscriptionDropdown((prev) => !prev);
  };

  const handleSubTabClick = (label: string) => {
    setActiveTab(label);
  };

  return (
    <div className="w-64 bg-white shadow-lg relative h-screen overflow-y-auto">
      <div className="p-6">
        <div className="text-2xl font-bold text-gray-800">OffWeGo 🕊️</div>
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

        {/* Requests Dropdown (not changed) */}
        <button
          onClick={handleRequestClick}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Request")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <FileText className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Requests</span>
          {showRequestsDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showRequestsDropdown && (
          <div className="ml-10">
            <button
              onClick={() => handleSubTabClick("Pending Requests")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Pending Requests"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleSubTabClick("Approved Requests")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Approved Requests"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => handleSubTabClick("Rejected Requests")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Rejected Requests"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              Rejected
            </button>
          </div>
        )}

        {/* Category Dropdown (not changed) */}
        <button
          onClick={handleCategoryClick}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Category")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <Grid3x3 className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Category</span>
          {showCategoryDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showCategoryDropdown && (
          <div className="ml-10">
            <button
              onClick={() => handleSubTabClick("Create Category")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Create Category"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <FolderPlus className="inline-block mr-2 w-4 h-4" />
              Create Category
            </button>
            <button
              onClick={() => handleSubTabClick("All Categories")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "All Categories"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <List className="inline-block mr-2 w-4 h-4" />
              All Categories
            </button>
          </div>
        )}

        {/* Banner Dropdown */}
        <button
          onClick={handleBannerClick}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Banner")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <FileText className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Banner</span>
          {showBannerDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showBannerDropdown && (
          <div className="ml-10">
            <button
              onClick={() => handleSubTabClick("Add Banner")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Add Banner"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <FolderPlus className="inline-block mr-2 w-4 h-4" />
              Add Banner
            </button>
            <button
              onClick={() => handleSubTabClick("All Banners")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "All Banners"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <List className="inline-block mr-2 w-4 h-4" />
              All Banners
            </button>
          </div>
        )}

        {/* -------------------- Subscription Dropdown -------------------- */}
        <button
          onClick={handleSubscriptionClick}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Subscription")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <UserCheck className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Subscriptions</span>
          {showSubscriptionDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showSubscriptionDropdown && (
          <div className="ml-10">
            <button
              onClick={() => handleSubTabClick("Create Subscription")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "Create Subscription"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <FolderPlus className="inline-block mr-2 w-4 h-4" />
              Create Subscription
            </button>
            <button
              onClick={() => handleSubTabClick("All Subscriptions")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "All Subscriptions"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <List className="inline-block mr-2 w-4 h-4" />
              All Subscriptions
            </button>
          </div>
        )}
      </nav>

      <div className="absolute bottom-4 left-4">
        <button
          onClick={() => setActiveTab("Add Destination")}
          className="flex items-center space-x-2 px-4 py-2 bg-purple-100 text-black rounded-lg hover:bg-purple-200 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Destinations</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
