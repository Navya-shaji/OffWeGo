import Login from "@/pages/User/Auth/Login";
import Signup from "@/pages/User/Auth/signup";
import Home from "@/pages/User/Home/Home";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";
import Forgotpassword from "@/components/Login/forgot-password";
import VerifyResetOtp from "@/components/Login/otp-verification ";
import ResetPassword from "@/components/Login/reset password";
import Profile from "@/pages/User/profile/profile";
import {DestinationDetail}from "@/pages/Admin/Destination/destinationSinglePage";

const UserRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<Forgotpassword/>}/>
      <Route path="/verify-reset-otp" element={<VerifyResetOtp/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/destination/:id" element={<DestinationDetail />} />

    
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
