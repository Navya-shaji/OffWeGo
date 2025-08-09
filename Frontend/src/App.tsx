import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserRoute from "./Routes/user/userRoutes";
import AdminRoute from "./Routes/Admin/adminRoutes";
import VendorRoute from "./Routes/Vendor/vendorRoutes";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { setUserFromSession } from "@/store/slice/user/authSlice";

function App() {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   const storedUser = localStorage.getItem("user");
  //   if (storedUser) {
  //     dispatch(setUserFromSession({ user: JSON.parse(storedUser) }));
  //   } else {
  //     dispatch(setUserFromSession({ user: null }));
  //   }
  // }, [dispatch]);

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
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
