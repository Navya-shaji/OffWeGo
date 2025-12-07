import VendorLogin from "@/pages/Vendors/Login";
import VendorSignup from "@/pages/Vendors/signup";
import { Routes, Route } from "react-router-dom";
import Dashboard from "@/pages/Vendors/Dashboard";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import VendorSubscriptionPage from "@/pages/Vendors/Bookings/SubscriptionPlans";
import PaymentFailureModal from "@/pages/Vendors/Bookings/BookingFailed";
import NotFound from "@/components/Modular/NotFound";
import PaymentSuccess from "@/pages/Vendors/Bookings/subscriptionSuccesspage";
import VendorMessageContainer from "@/pages/Vendors/chat/ChatVendor";
import VendorChatList from "@/pages/Vendors/chat/vendorChatList";


const VendorRoutes = () => {
  return (
    <Routes>
      <Route path="/signup" element={<VendorSignup />} />
      <Route path="/login" element={<VendorLogin />} />
      <Route path="/subscriptionplans" element={<VendorSubscriptionPage />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailureModal />} />

   
      <Route
        path="/chat/:chatId"
        element={
          <ProtectedRoute>
            <VendorMessageContainer />
          </ProtectedRoute>
        }
      />
<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <VendorChatList />
    </ProtectedRoute>
  }
/>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default VendorRoutes;
