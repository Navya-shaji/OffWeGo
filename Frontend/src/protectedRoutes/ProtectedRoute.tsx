
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();
  const userAuth = useAppSelector((state) => state.auth.isAuthenticated);
  const vendorAuth = useAppSelector((state) => state.vendorAuth.isAuthenticated);

  const isVendorRoute = location.pathname.startsWith("/vendor");
  const isAuthenticated = isVendorRoute ? vendorAuth : userAuth;
  const redirectTo = isVendorRoute ? "/vendor/login" : "/login";

  return isAuthenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} replace state={{ from: location }} />
  );
}
