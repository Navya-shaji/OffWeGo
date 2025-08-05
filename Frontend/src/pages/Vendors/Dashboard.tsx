import Navbar from "@/components/vendor/navbar";
import VendorSidebar from "@/components/vendor/sidebar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Profile } from "./Vendorprofile";
import  {DestinationTable}  from "../Admin/Destination/GetDestination";
import AddPackage from "./package-add";
import PackagesTable from "./package-table";
import { fetchPackages } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { CreateDestination } from "../Admin/Destination/CreateDestination";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile");
  const dispatch = useDispatch<AppDispatch>();
  const { packages } = useSelector((state: RootState) => state.package);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  return (
    <div className="flex h-screen">
      <VendorSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === "Profile" && <Profile />}
          {activeTab === "Add Package" && <AddPackage />}
          {activeTab === "All Packages" && <PackagesTable packages={packages} />}
          {activeTab === "All Destinations" && <DestinationTable />}
          {activeTab=="Add Destination" && <CreateDestination/>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
