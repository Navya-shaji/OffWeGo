import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
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

      try {
       
        if ('Notification' in window && Notification.permission === 'default') {
          await Notification.requestPermission();
        }

        const token = await getFcmToken();
        if (!token) {
          console.warn("FCM token not available");
          return;
        }


 
        await subscribeToTopic(token, `${role}_${userId}`);

        onMessageListener()
          .then((payload) => {
            console.log(" FCM Message Received in App:", payload);
          })
          .catch((error) => {
            console.error(" Error in FCM message listener:", error);
          });
      } catch (error) {
        console.error("Error registering FCM notifications:", error);
      }
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
