import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/AdminDashboard/sidebar";
import VendorRequests from "@/components/AdminDashboard/vendorRequests";
import Navbar from "@/components/AdminDashboard/navbar";
import UserList from "@/components/AdminDashboard/userList";
import { VendorList } from "@/components/AdminDashboard/vendorDetails";
import { CreateDestination } from "../Destination/CreateDestination";
import { DestinationTable } from "@/pages/Admin/Destination/GetDestination";
import { CategoryForm } from "../category/category";
import { CategoryTable } from "../category/getAllCategory";
import CreateBanner from "../banner/createBanner";
import { BannerForm } from "../banner/bannerForm";
import AddSubscription from "@/components/AdminDashboard/CreateSubscription";
import SubscriptionList from "@/components/AdminDashboard/GetAllSubscription";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem("activeTab") || "Dashboard";
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden bg-white shadow-md px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <div className="text-xl font-bold text-gray-800">OffWeGo 🕊️</div>
          <div className="w-10" />
        </div>

        <div className="hidden lg:block">
          <Navbar />
        </div>

        <div className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6">
            {activeTab === "Dashboard" && (
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-4">Welcome to Dashboard</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                </div>
              </div>
            )}

            {activeTab === "Pending Requests" && (
              <VendorRequests filter="pending" />
            )}

            {activeTab === "Approved Requests" && (
              <VendorRequests filter="approved" />
            )}

            {activeTab === "Rejected Requests" && (
              <VendorRequests filter="rejected" />
            )}

            {activeTab === "Users" && <UserList />}
            {activeTab === "Vendors" && <VendorList />}
            {activeTab === "Add Destination" && <CreateDestination />}
            {activeTab === "Destinations" && <DestinationTable />}
            {activeTab === "Create Category" && <CategoryForm />}
            {activeTab === "All Categories" && <CategoryTable />}
            {activeTab === "Add Banner" && <CreateBanner />}
            {activeTab === "All Banners" && <BannerForm />}
            {activeTab === "Create Subscription" && <AddSubscription />}
            {activeTab === "All Subscriptions" && <SubscriptionList />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;