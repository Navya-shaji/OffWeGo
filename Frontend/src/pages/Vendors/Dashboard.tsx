import Navbar from "@/components/vendor/navbar";
import VendorSidebar from "@/components/vendor/sidebar";
import { useState } from "react";
import {Profile} from "./Profile";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="flex h-screen">
   
      <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

   
      <div className="flex-1 flex flex-col">
      
        <Navbar />

      
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "Profile" && <Profile/>}
          {activeTab === "Add Package" && <div>Add Package Form</div>}
          {activeTab === "All Packages" && <div>All Packages List</div>}
          {activeTab === "All Destinations" && <div>Destinations List</div>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
