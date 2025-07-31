
import VendorLogin from "@/pages/Vendors/Login";
import VendorSignup from "@/pages/Vendors/signup";
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Vendors/Dashboard";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<VendorSignup />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/profile" element={<Dashboard/>}/>
    </Routes>
  );
};

export default VendorRoutes;
