import Navbar from "@/components/vendor/navbar";
import VendorSidebar from "@/components/vendor/sidebar";
import { useState } from "react";
import {Profile} from "./Vendorprofile";
import { DestinationTable } from "../Admin/Destination/GetDestination";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex h-screen">
   
      <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

   
      <div className="flex-1 flex flex-col">
      
        <Navbar />

      
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "Profile" && <Profile/>}
          {activeTab === "Add Package" &&  <div>Add Package</div>}
          {activeTab === "All Packages" && <div>All Packages List</div>}
          {activeTab === "All Destinations" && <DestinationTable/>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
