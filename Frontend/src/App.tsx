import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRoute from "./Routes/user/userRoutes";
import AdminRoute from "./Routes/Admin/adminRoutes";
import VendorRoute from "./Routes/Vendor/vendorRoutes";
import { useEffect } from "react";
import { getFcmToken, onMessageListener } from "./Firebase/firebase";

function App() {

    useEffect(() => {
    getFcmToken();

    onMessageListener()
      .then((payload) => {
        console.log("Foreground message received:", payload);
        toast.info(`${payload.notification?.title} - ${payload.notification?.body}`);
      })
      .catch((err) => console.error("FCM listener failed: ", err));
  }, []);
  return (
    <BrowserRouter>
   
      <Routes>
        <Route path="/*" element={<UserRoute />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="/vendor/*" element={<VendorRoute />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
  
    </BrowserRouter>
  );
}
export default App