import { useState } from "react";
import Sidebar from "@/components/AdminDashboard/sidebar";
import VendorRequests from "@/components/AdminDashboard/vendorRequests"; // This component shows filtered vendors
import Navbar from "@/components/AdminDashboard/navbar";

const AdminLayout = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-auto">
        <Navbar />

        {/* Render content based on tab */}
        {activeTab === "Dashboard" && (
          <h1 className="text-2xl font-bold p-6">Welcome to Dashboard</h1>
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
      </div>
    </div>
  );
};

export default AdminLayout;
