import Login from "@/pages/User/Auth/Login";
import Signup from "@/pages/User/Auth/signup";
import Home from "@/pages/User/Home/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import Forgotpassword from "@/components/ForgotPassword/forgot-password";
import VerifyResetOtp from "@/components/ForgotPassword/otp-verification ";
import ResetPassword from "@/components/ForgotPassword/reset password";
import Profile from "@/pages/User/profile/profile";
import {DestinationDetail}from "@/pages/Admin/Destination/destinationSinglePage";
import { Destinations } from "@/components/home/destinations/Destinations";
import { PackageTimeline } from "@/pages/User/Destination/packageTimeline";

const UserRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword/>}/>
      <Route path="/verify-reset-otp" element={<VerifyResetOtp/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/profile"   element={
          <ProtectedRoute>
          <Profile/>
          </ProtectedRoute>
        }/>
      <Route path="/destinations" element={<Destinations/>}/>
      <Route path="/destination/:id" element={<DestinationDetail />} />
<Route path="/timeline" element={<PackageTimeline />} />
    
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default UserRoute;
