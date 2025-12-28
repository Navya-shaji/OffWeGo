import Login from "@/pages/User/Auth/Login";
import Signup from "@/pages/User/Auth/signup";
import Home from "@/pages/User/Home/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import Profile from "@/pages/User/profile/profile";
import { DestinationDetail } from "@/pages/Admin/Destination/destinationSinglePage";
import { PackageTimeline } from "@/pages/User/Destination/packageTimeline";
import TravelerDetails from "@/pages/Vendors/TravalersDetails";
import PaymentCheckout from "@/pages/Vendors/Booking-confirmation";
import BookingSuccess from "@/pages/Vendors/bookingSuccess";
import BookingDetailsPage from "@/pages/User/Bookings/UserBookings";
import UserAddReview from "@/pages/User/profile/AddReview";
import AllDestinationsPage from "@/pages/User/Destination/AllDestinationPage";
import ExpandedContactUsPage from "@/components/home/ContactUs/contactUs";
import AboutUs from "@/components/home/AboutUs/AboutUs";
import WalletManagement from "@/pages/User/wallet/userWallet";
import Travalbuddies from "@/components/home/Travalbuddies/Travalbuddies";
import ChatPage from "@/pages/User/chat/chat";
import NotFound from "@/components/Modular/NotFound";

const UserRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/destinations" element={<AllDestinationsPage />} />
      <Route path="/destination/:id" element={<DestinationDetail />} />
      <Route path="/timeline" element={<PackageTimeline />} />
      <Route
        path="/travaler-details"
        element={
          <ProtectedRoute>
            <TravelerDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-checkout"
        element={
          <ProtectedRoute>
            <PaymentCheckout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-success"
        element={
          <ProtectedRoute>
            <BookingSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedRoute>
            <UserAddReview />
          </ProtectedRoute>
        }
      />
      <Route path="/contact" element={<ExpandedContactUsPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            <WalletManagement />
          </ProtectedRoute>
        }
      />
      <Route path="/buddy-packages" element={<Travalbuddies />} />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            <BookingSuccess />
          </ProtectedRoute>
        }
      />

      <Route
        path='/chat/:chatId?'
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route>
        <Route path="*" element={<NotFound />}></Route>
      </Route>
    </Routes>
  );
};

export default UserRoute;