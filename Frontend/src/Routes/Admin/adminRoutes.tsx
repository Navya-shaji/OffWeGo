import AdminDashboard from "@/pages/Admin/Dashboard/AdminDashboard";
import Login from "@/pages/Admin/Login/AdminLogin";
import ProtectedRoute from "@/protectedRoutes/ProtectedRoute";

import { Route, Routes } from "react-router-dom";

const AdminRoute = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/dashboard" element={<AdminDashboard/>}/> */}
      <Route path="/dashboard" element={<ProtectedRoute>
        <AdminDashboard/>
      </ProtectedRoute>} />
    </Routes>
  );
};

export default AdminRoute;
