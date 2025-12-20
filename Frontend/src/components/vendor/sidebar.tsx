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

  const menuItems = [
    { icon: Package, label: "Dashboard" },
    { icon: User, label: "Profile" },
    { icon: Plus, label: "Add Destination" },
    { icon: MapPin, label: "All Destinations" },
  
  ];

  const handleSubTabClick = (label: string) => setActiveTab(label);

  return (
    <div className="w-64 bg-white shadow-lg relative h-screen overflow-y-auto">
      <div className="p-6">
        <div className="text-2xl font-bold text-gray-800">Vendor Panel</div>
      </div>

      <nav className="mt-6">
        {/* Top Menu Items */}
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

        {/* Packages */}
        <button
          onClick={() => setShowPackageDropdown((prev) => !prev)}
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Package") || activeTab.includes("Buddy Travel")
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
            {[
              "Add Package",
              "Add Buddy Travel",
              "All Packages",
              "Buddy Packages",
            ].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === label
                    ? "text-black font-semibold"
                    : "text-gray-600"
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
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Hotel")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <Building2 className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Hotels</span>
          {showHotelDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showHotelDropdown && (
          <div className="ml-10">
            {["Create Hotel", "All Hotels"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === label
                    ? "text-black font-semibold"
                    : "text-gray-600"
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
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Activity")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <ActivityIcon className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Activities</span>
          {showActivityDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showActivityDropdown && (
          <div className="ml-10">
            {["Create Activity", "All Activities"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === label
                    ? "text-black font-semibold"
                    : "text-gray-600"
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
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Flight")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <Package className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Flights</span>
          {showFlightDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showFlightDropdown && (
          <div className="ml-10">
            {["Create Flight", "All Flights"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === label
                    ? "text-black font-semibold"
                    : "text-gray-600"
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
          className={`w-full flex items-center px-6 py-3 text-left hover:bg-gray-100 transition-colors ${
            activeTab.includes("Booking")
              ? "bg-gray-100 border-r-4 border-black"
              : ""
          }`}
        >
          <BookOpen className="w-5 h-5 mr-3 text-gray-600" />
          <span className="text-gray-700 flex-1">Bookings</span>
          {showBookingDropdown ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>

        {showBookingDropdown && (
          <div className="ml-10">
            {["All Bookings", "Booking Slots"].map((label) => (
              <button
                key={label}
                onClick={() => handleSubTabClick(label)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                  activeTab === label
                    ? "text-black font-semibold"
                    : "text-gray-600"
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
              onClick={() => handleSubTabClick("VendorWalletManagement")}
              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                activeTab === "VendorWalletManagement"
                  ? "text-black font-semibold"
                  : "text-gray-600"
              }`}
            >
              <List className="inline-block mr-2 w-4 h-4" />
              Vendor Wallet
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default VendorSidebar;
