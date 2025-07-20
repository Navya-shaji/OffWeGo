
import VendorLogin from "@/pages/Vendors/Login";
import Profile from "@/pages/Vendors/Profile";
import VendorSignup from "@/pages/Vendors/signup";
import { Routes, Route } from "react-router-dom";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<VendorSignup />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/profile" element={<Profile/>}/>
    </Routes>
  );
};

export default VendorRoutes;
