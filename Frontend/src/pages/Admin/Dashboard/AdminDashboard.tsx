import { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <Navbar />

        {activeTab === "Dashboard" && (
          <h1 className="text-2xl font-serif p-6">Welcome to Dashboard</h1>
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
        {activeTab == "All Categories" && <CategoryTable />}
        {activeTab == "Add Banner" && <CreateBanner />}
        {activeTab == "All Banners" && <BannerForm />}
        {activeTab=="Create Subscription" && <AddSubscription/>}
        {activeTab=="All Subscriptions" && <SubscriptionList/>}
      </div>
    </div>
  );
};

export default AdminLayout;
