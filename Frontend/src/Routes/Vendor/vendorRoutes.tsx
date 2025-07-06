import VendorSignup from "@/pages/Vendors/signup";
import { Routes, Route } from "react-router-dom";
const VendorRoutes = () => {
  return (
    <Routes>
     <Route path="/signup" element={<VendorSignup/>} />
    </Routes>
  );
};

export default VendorRoutes