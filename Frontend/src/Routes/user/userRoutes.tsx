import Login from "@/pages/User/Auth/Login";
import Signup from "@/pages/User/Auth/signup";
import Home from "@/pages/User/Home/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import Forgotpassword from "@/components/ForgotPassword/forgot-password";
import VerifyResetOtp from "@/components/ForgotPassword/otp-verification ";
import ResetPassword from "@/components/ForgotPassword/reset password";
import Profile from "@/pages/User/profile/profile";
import { DestinationDetail } from "@/pages/Admin/Destination/destinationSinglePage";
import  {PackageTimeline} from "@/pages/User/Destination/packageTimeline";
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
import MessageTemplate from "@/pages/User/chat/Template";
import MessageContainer from "@/pages/User/chat/container";
import NotFound from "@/components/Modular/NotFound";

const UserRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword />} />
      <Route path="/verify-reset-otp" element={<VerifyResetOtp />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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
      <Route path="/travaler-details" element={<TravelerDetails />} />
      <Route path="/payment-checkout" element={<PaymentCheckout />} />
      <Route path="/booking-success" element={<BookingSuccess />} />
      <Route path="/bookings" element={<BookingDetailsPage />} />
      <Route path="/review" element={<UserAddReview />} />
      <Route path="/contact" element={<ExpandedContactUsPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/wallet" element={<WalletManagement />} />
      <Route path="/buddy-packages" element={<Travalbuddies />} />
      <Route path="/payment-success" element={<BookingSuccess />} />

     
      <Route path='/chat' element={<ChatPage />}>
        <Route index element={<MessageTemplate />} />
        <Route path=':chatId' element={<MessageContainer />} />
      </Route>
      <Route>
        <Route path="*" element={<NotFound/>}></Route>
      </Route>
    </Routes>
  );
};

export default UserRoute;