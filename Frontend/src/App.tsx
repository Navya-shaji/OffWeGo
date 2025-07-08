import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserRoute from "./Routes/user/userRoutes";
import { useDispatch } from "react-redux";
import { setAuthFromStorage } from "./store/slice/user/authSlice";
import { useEffect } from "react";
import AdminRoute from "./Routes/Admin/adminRoutes";
import VendorRoute from "./Routes/Vendor/vendorRoutes";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setAuthFromStorage());
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
