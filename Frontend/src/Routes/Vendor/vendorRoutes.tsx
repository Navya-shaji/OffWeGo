import VendorLogin from "@/pages/Vendors/Login";
import VendorSignup from "@/pages/Vendors/signup";
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Vendors/Dashboard";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import VendorSubscriptionPage from "@/pages/Vendors/Bookings/SubscriptionPlans";
import PaymentSuccessPage from "@/pages/Vendors/Bookings/PAymentSuccessPage";

const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<VendorSignup />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/subscriptionplans" element={<VendorSubscriptionPage/>}/>
      <Route path="/payment/success" element={<PaymentSuccessPage />} />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default VendorRoutes;
