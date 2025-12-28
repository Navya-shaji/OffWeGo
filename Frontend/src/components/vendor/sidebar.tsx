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
  Building2,
  Activity as ActivityIcon,
  BookOpen,
  Wallet,

} from "lucide-react";
import { useAppSelector } from "@/hooks";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const VendorSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [showHotelDropdown, setShowHotelDropdown] = useState(false);
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [showFlightDropdown, setShowFlightDropdown] = useState(false);
  const [showBookingDropdown, setShowBookingDropdown] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);

  const vendor = useAppSelector((state) => state.vendorAuth.vendor);


  const menuItems = [
    { icon: Package, label: "Dashboard" },
    { icon: User, label: "Profile" },
    { icon: Plus, label: "Add Destination" },
    { icon: MapPin, label: "All Destinations" },
   
  ];

  const handleSubTabClick = (label: string) => setActiveTab(label);

  return (
    <div className="w-64 bg-white fixed left-0 top-[73px] h-[calc(100vh-73px)] flex flex-col z-40">
      <nav className="px-4 py-6 space-y-1 flex-1 overflow-y-auto scrollbar-hide">
        {/* Top Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(item.label)}
            className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
              item.label === activeTab
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 ${item.label === activeTab ? "text-white" : "text-gray-600"}`} />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}

        {/* Packages */}
        <button
          onClick={() => setShowPackageDropdown((prev) => !prev)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mt-1 ${
            activeTab.includes("Package") || activeTab.includes("Buddy Travel")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Package className={`w-5 h-5 mr-3 ${activeTab.includes("Package") || activeTab.includes("Buddy Travel") ? "text-white" : "text-gray-600"}`} />
          <span className="text-sm font-medium flex-1">Packages</span>
          {showPackageDropdown ? (
            <ChevronUp className={`w-4 h-4 ${activeTab.includes("Package") || activeTab.includes("Buddy Travel") ? "text-white" : "text-gray-500"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${activeTab.includes("Package") || activeTab.includes("Buddy Travel") ? "text-white" : "text-gray-500"}`} />
          )}
        </button>

        {showPackageDropdown && (
          <div className="ml-4 mt-1 space-y-1">
            {[
              "Add Package",
              "Add Buddy Travel",
              "All Packages",
              "Buddy Packages",
            ].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === label
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FolderPlus className="inline-block mr-2 w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Hotels */}
        <button
          onClick={() => setShowHotelDropdown((prev) => !prev)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mt-1 ${
            activeTab.includes("Hotel")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Building2 className={`w-5 h-5 mr-3 ${activeTab.includes("Hotel") ? "text-white" : "text-gray-600"}`} />
          <span className="text-sm font-medium flex-1">Hotels</span>
          {showHotelDropdown ? (
            <ChevronUp className={`w-4 h-4 ${activeTab.includes("Hotel") ? "text-white" : "text-gray-500"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${activeTab.includes("Hotel") ? "text-white" : "text-gray-500"}`} />
          )}
        </button>

        {showHotelDropdown && (
          <div className="ml-4 mt-1 space-y-1">
            {["Create Hotel", "All Hotels"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === label
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FolderPlus className="inline-block mr-2 w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Activities */}
        <button
          onClick={() => setShowActivityDropdown((prev) => !prev)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mt-1 ${
            activeTab.includes("Activity")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ActivityIcon className={`w-5 h-5 mr-3 ${activeTab.includes("Activity") ? "text-white" : "text-gray-600"}`} />
          <span className="text-sm font-medium flex-1">Activities</span>
          {showActivityDropdown ? (
            <ChevronUp className={`w-4 h-4 ${activeTab.includes("Activity") ? "text-white" : "text-gray-500"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${activeTab.includes("Activity") ? "text-white" : "text-gray-500"}`} />
          )}
        </button>

        {showActivityDropdown && (
          <div className="ml-4 mt-1 space-y-1">
            {["Create Activity", "All Activities"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === label
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FolderPlus className="inline-block mr-2 w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Flights */}
        <button
          onClick={() => setShowFlightDropdown((prev) => !prev)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mt-1 ${
            activeTab.includes("Flight")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Package className={`w-5 h-5 mr-3 ${activeTab.includes("Flight") ? "text-white" : "text-gray-600"}`} />
          <span className="text-sm font-medium flex-1">Flights</span>
          {showFlightDropdown ? (
            <ChevronUp className={`w-4 h-4 ${activeTab.includes("Flight") ? "text-white" : "text-gray-500"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${activeTab.includes("Flight") ? "text-white" : "text-gray-500"}`} />
          )}
        </button>

        {showFlightDropdown && (
          <div className="ml-4 mt-1 space-y-1">
            {["Create Flight", "All Flights"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === label
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FolderPlus className="inline-block mr-2 w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Bookings */}
        <button
          onClick={() => setShowBookingDropdown((prev) => !prev)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mt-1 ${
            activeTab.includes("Booking")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <BookOpen className={`w-5 h-5 mr-3 ${activeTab.includes("Booking") ? "text-white" : "text-gray-600"}`} />
          <span className="text-sm font-medium flex-1">Bookings</span>
          {showBookingDropdown ? (
            <ChevronUp className={`w-4 h-4 ${activeTab.includes("Booking") ? "text-white" : "text-gray-500"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${activeTab.includes("Booking") ? "text-white" : "text-gray-500"}`} />
          )}
        </button>

        {showBookingDropdown && (
          <div className="ml-4 mt-1 space-y-1">
            {["All Bookings", "Booking Slots"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                  activeTab === label
                    ? "bg-gray-200 text-black font-semibold"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="inline-block mr-2 w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Wallet */}
        <button
          onClick={() => setShowWalletDropdown((prev) => !prev)}
          className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors mt-1 ${
            activeTab.includes("Wallet")
              ? "bg-black text-white"
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Wallet className={`w-5 h-5 mr-3 ${activeTab.includes("Wallet") ? "text-white" : "text-gray-600"}`} />
          <span className="text-sm font-medium flex-1">Wallet</span>
          {showWalletDropdown ? (
            <ChevronUp className={`w-4 h-4 ${activeTab.includes("Wallet") ? "text-white" : "text-gray-500"}`} />
          ) : (
            <ChevronDown className={`w-4 h-4 ${activeTab.includes("Wallet") ? "text-white" : "text-gray-500"}`} />
          )}
        </button>

        {showWalletDropdown && (
          <div className="ml-4 mt-1 space-y-1">
            <button
              onClick={() => handleSubTabClick("VendorWalletManagement")}
              className={`block w-full text-left px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === "VendorWalletManagement"
                  ? "bg-gray-200 text-black font-semibold"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <List className="inline-block mr-2 w-4 h-4" />
              Vendor Wallet
            </button>
          </div>
        )}
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="px-4 py-4 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
            {vendor?.profileImage ? (
              <img
                src={vendor.profileImage}
                alt="Vendor Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg text-white font-bold">
                {vendor?.name?.[0]?.toUpperCase() || "V"}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900">{vendor?.name || "Vendor"}</h3>
            <p className="text-xs text-gray-500">Vendor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorSidebar;
