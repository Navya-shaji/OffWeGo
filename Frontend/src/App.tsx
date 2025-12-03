import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import UserRoute from "./Routes/user/userRoutes";
import AdminRoute from "./Routes/Admin/adminRoutes";
import VendorRoute from "./Routes/Vendor/vendorRoutes";
import { getFcmToken, onMessageListener, subscribeToTopic } from "./Firebase/firebase";
import "react-toastify/dist/ReactToastify.css";
import type { RootState } from "./store/store";

function App() {
  
  const loggedUser = useSelector((state: RootState) => state.auth.user);
  const loggedVendor = useSelector((state: RootState) => state.vendorAuth.vendor);

  useEffect(() => {
    const registerNotifications = async () => {
      let userId: string | undefined;
      let role: "user" | "vendor" | undefined;

      if (loggedUser?.id) {
        userId = loggedUser.id;
        role = "user";
      } else if (loggedVendor?.id) {
        userId = loggedVendor.id;
        role = "vendor";
      }

      if (!userId || !role) return;

      const token = await getFcmToken();
      if (!token) return;

      await subscribeToTopic(token, `${role}_${userId}`);

      onMessageListener()
        .then((payload) => {
          toast.info(`${payload.notification?.title} - ${payload.notification?.body}`);
        })
        .catch((err) => console.error("FCM listener failed: ", err));
    };

    registerNotifications();
  }, [loggedUser, loggedVendor]);

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

export default App;
