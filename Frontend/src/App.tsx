// src/App.tsx
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserRoute from "./Routes/user/userRoutes";
import AdminRoute from "./Routes/Admin/adminRoutes";
import VendorRoute from "./Routes/Vendor/vendorRoutes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setUserFromSession } from "@/store/slice/user/authSlice"; // ✅ import this

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUserFromSession({ user: JSON.parse(storedUser) }));
    } else {
      dispatch(setUserFromSession({ user: null }));
    }
  }, [dispatch]);

  const route = createBrowserRouter([
    {
      path: "/*",
      element: <UserRoute />,
    },
    {
      path: "/admin/*",
      element: <AdminRoute />,
    },
    {
      path: "/vendor/*",
      element: <VendorRoute />,
    },
  ]);

  return (
    <>
      <RouterProvider router={route} />
      <Toaster />
    </>
  );
}

export default App;
