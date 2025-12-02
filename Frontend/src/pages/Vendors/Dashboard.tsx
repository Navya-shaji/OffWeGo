import Navbar from "@/components/vendor/navbar";
import VendorSidebar from "@/components/vendor/sidebar";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Profile } from "./Vendorprofile";
import { DestinationTable } from "../Admin/Destination/GetDestination";
import { fetchPackages } from "@/store/slice/packages/packageSlice";
import type { AppDispatch, RootState } from "@/store/store";
import { CreateDestination } from "../Admin/Destination/CreateDestination";
import CreateHotel from "./add-Hotel";
import HotelsTable from "./getAllHotels";
import AddActivity from "./add-Activity";
import ActivitiesTable from "./getAllActivities";
import AddPackage from "@/components/Packages/AddPAckage";
import PackageTable from "./package-table";
import CreateFlight from "./createFlight";
import GetAllFlight from "./GetAllFlight";
import AllBookings from "./Bookings/UserBookings";
import { TravelCalendar } from "./Bookings/TravelCalendar";
import AddBuddyTravelPage from "./BuddyTravel/Buddytravel-create";
import VendorApprovedPackages from "./BuddyTravel/BuddyPackage-table";
import VendorWalletManagement from "./Wallet/vendorWallet";
import VendorDashboard from "./Dashboard/VendorDashboard";
import VendorMessageContainer from "./chat/ChatVendor";

function Dashboard() {
  const [activeTab, setActiveTab] = useState("Profile");
  const dispatch = useDispatch<AppDispatch>();
  const { packages } = useSelector((state: RootState) => state.package);
  const vendorId = useSelector((state: RootState) => state.vendorAuth.vendor?.id);

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
          {activeTab === "Add Buddy Travel" && <AddBuddyTravelPage />}
          {activeTab === "All Packages" && <PackageTable packages={packages} />}
          {activeTab === "Buddy Packages" && <VendorApprovedPackages vendorId={vendorId || ""} />}
          {activeTab === "All Destinations" && <DestinationTable />}
          {activeTab === "Add Destination" && <CreateDestination />}
          {activeTab === "Create Hotel" && <CreateHotel />}
          {activeTab === "All Hotels" && <HotelsTable />}
          {activeTab === "Create Activity" && <AddActivity />}
          {activeTab === "All Activities" && <ActivitiesTable />}
          {activeTab === "Create Flight" && <CreateFlight />}
          {activeTab === "All Flights" && <GetAllFlight />}
          {activeTab === "All Bookings" && <AllBookings />}
          {activeTab === "Dashboard" && <VendorDashboard />}
          {activeTab === "VendorWalletManagement" && <VendorWalletManagement />}
          {activeTab === "Booking Slots" && <TravelCalendar vendorId={vendorId || ""} />}
          {activeTab === "Chat" && <VendorMessageContainer />}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
