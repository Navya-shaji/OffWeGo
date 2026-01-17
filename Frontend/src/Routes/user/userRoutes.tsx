import Login from "@/pages/User/Auth/Login";
import Signup from "@/pages/User/Auth/signup";
import ChooseRolePage from "@/pages/Home/ChooseRole/ChooseRolePage";
import Home from "@/pages/User/Home/Home";
import { Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";

import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import PublicRoute from "@/protectedRoutes/PublicRoute";
import Profile from "@/pages/User/profile/profile";
import { DestinationDetail } from "@/pages/User/Destination/destinationSinglePage";
import { PackageTimeline } from "@/pages/User/Destination/packageTimeline";
import TravelerDetails from "@/pages/Vendors/TravalersDetails";
import PaymentCheckout from "@/pages/Vendors/Booking-confirmation";
import BookingSuccess from "@/pages/Vendors/bookingSuccess";
import BookingDetailsPage from "@/pages/User/Bookings/UserBookings";
import BookingDetailView from "@/pages/User/Bookings/BookingDetailsPage";
import UserAddReview from "@/pages/User/profile/AddReview";
import AllDestinationsPage from "@/pages/User/Destination/AllDestinationPage";
import ExpandedContactUsPage from "@/components/home/ContactUs/contactUs";
import AboutUs from "@/components/home/AboutUs/AboutUs";
import WalletManagement from "@/pages/User/wallet/userWallet";
import ChatPage from "@/pages/User/chat/chat";
import NotFound from "@/components/Modular/NotFound";
import Footer from "@/components/home/footer/Footer";
import TravelPostListPage from "@/pages/User/TravelPosts/TravelPostListPage";
import TravelPostCreatePage from "@/pages/User/TravelPosts/TravelPostCreatePage";
import TravelPostDetailPage from "@/pages/User/TravelPosts/TravelPostDetailPage";
import PaymentFailed from "@/pages/User/Bookings/PaymentFailed";

const UserRoute = () => {
  const withFooter = (element: ReactNode) => (
    <>
      {element}
      <Footer />
    </>
  );

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/choose-role" element={withFooter(<ChooseRolePage />)} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      {/* New explicit route for user login */}
      <Route path="/user-login" element={<PublicRoute><Login /></PublicRoute>} />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            {withFooter(<Profile />)}
          </ProtectedRoute>
        }
      />

      <Route path="/destinations" element={withFooter(<AllDestinationsPage />)} />
      <Route path="/destination/:id" element={withFooter(<DestinationDetail />)} />
      <Route path="/timeline" element={withFooter(<PackageTimeline />)} />
      <Route
        path="/travaler-details"
        element={
          <ProtectedRoute>
            {withFooter(<TravelerDetails />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-checkout"
        element={
          <ProtectedRoute>
            {withFooter(<PaymentCheckout />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking-success"
        element={
          <ProtectedRoute>
            {withFooter(<BookingSuccess />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            {withFooter(<BookingDetailsPage />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/:id"
        element={
          <ProtectedRoute>
            {withFooter(<BookingDetailView />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/review"
        element={
          <ProtectedRoute>
            {withFooter(<UserAddReview />)}
          </ProtectedRoute>
        }
      />
      <Route path="/contact" element={withFooter(<ExpandedContactUsPage />)} />
      <Route path="/about" element={withFooter(<AboutUs />)} />
      <Route
        path="/wallet"
        element={
          <ProtectedRoute>
            {withFooter(<WalletManagement />)}
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-success"
        element={
          <ProtectedRoute>
            {withFooter(<BookingSuccess />)}
          </ProtectedRoute>
        }
      />

      <Route path="/posts" element={withFooter(<TravelPostListPage />)} />
      <Route
        path="/posts/new"
        element={
          <ProtectedRoute>
            {withFooter(<TravelPostCreatePage />)}
          </ProtectedRoute>
        }
      />
      <Route path="/posts/:slug" element={withFooter(<TravelPostDetailPage />)} />

      <Route
        path="/payment-failed"
        element={
          <ProtectedRoute>
            {withFooter(<PaymentFailed />)}
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:chatId?"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default UserRoute;