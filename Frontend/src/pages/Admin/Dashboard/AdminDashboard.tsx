import { useState } from "react";
import Sidebar from "@/components/AdminDashboard/sidebar";
import VendorRequests from "@/components/AdminDashboard/vendorRequests";
import Navbar from "@/components/AdminDashboard/navbar";
import UserList from "@/components/AdminDashboard/userList";
import VendorList from "@/components/AdminDashboard/vendorDetails";
import { CreateDestination } from "../Destination/CreateDestination";
import { DestinationTable } from "../Destination/GetDestination";

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
      </div>
    </div>
  );
};

export default AdminLayout;
