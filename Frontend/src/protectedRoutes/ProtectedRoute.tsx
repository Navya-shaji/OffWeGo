
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const location = useLocation();

  const userAuth = useAppSelector((state) => state.auth?.isAuthenticated);
  const vendorAuth = useAppSelector((state) => state.vendorAuth?.isAuthenticated);
  const adminAuth = useAppSelector((state) => state.adminAuth?.isAuthenticated);

  const isVendorRoute = location.pathname.startsWith("/vendor");
  const isAdminRoute = location.pathname.startsWith("/admin");

  let isAuthenticated = userAuth;
  let redirectTo = "/login";

  if (isVendorRoute) {
    isAuthenticated = vendorAuth;
    redirectTo = "/vendor/login";
  } else if (isAdminRoute) {
    isAuthenticated = adminAuth;
    redirectTo = "/admin/login";
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
