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
  X,
  Wallet,
  Handshake,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
}) => {
  const [showRequestsDropdown, setShowRequestsDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBannerDropdown, setShowBannerDropdown] = useState(false);
  const [showSubscriptionDropdown, setShowSubscriptionDropdown] =
    useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  // const [showBuddyDropdown, setShowBuddyDropdown] = useState(false);

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
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleMainTabClick = (label: string) => {
    setActiveTab(label);
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed lg:relative
        w-64 bg-white shadow-lg h-screen overflow-y-auto
        z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">OffWeGo 🕊️</div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="mt-6 pb-24">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMainTabClick(item.label)}
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
            onClick={() => handleSubTabClick("Buddy Packages")}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
              activeTab === "Buddy Packages"
                ? "bg-gray-100 border-r-4 border-black"
                : ""
            }`}
          >
            <Handshake className="w-5 h-5 mr-3 text-gray-600" />
            <span className="text-gray-700">Buddy Packages</span>
          </button>
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

          <button
            onClick={() => setShowWalletDropdown((prev) => !prev)}
            className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
              activeTab.includes("Wallet")
                ? "bg-gray-100 border-r-4 border-black"
                : ""
            }`}
          >
            <Wallet className="w-5 h-5 mr-3 text-gray-600" />
            <span className="text-gray-700 flex-1">Wallet</span>
            {showWalletDropdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showWalletDropdown && (
            <div className="ml-10">
              <button
                onClick={() => handleSubTabClick("Wallet-Transactions")}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === "Admin Wallet"
                    ? "text-black font-semibold"
                    : "text-gray-600"
                }`}
              >
                Admin Wallet
              </button>
              <button
                onClick={() => handleSubTabClick("Vendor Wallet")}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === "Vendor Wallet"
                    ? "text-black font-semibold"
                    : "text-gray-600"
                }`}
              >
                Vendor Wallet
              </button>
            </div>
          )}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => handleMainTabClick("Add Destination")}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-purple-100 text-black rounded-lg hover:bg-purple-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Destinations</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
