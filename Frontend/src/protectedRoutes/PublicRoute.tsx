import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    redirectTo?: string;
};

/**
 * PublicRoute - A route guard that redirects authenticated users away from public pages
 * (like login/signup) to the appropriate dashboard or home page.
 */
export default function PublicRoute({ children, redirectTo }: Props) {
    const location = useLocation();

    const userAuth = useAppSelector((state) => state.auth?.isAuthenticated);
    const vendorAuth = useAppSelector((state) => state.vendorAuth?.isAuthenticated);
    const adminAuth = useAppSelector((state) => state.adminAuth?.isAuthenticated);

    const isVendorRoute = location.pathname.startsWith("/vendor");
    const isAdminRoute = location.pathname.startsWith("/admin");

    const vendorData = useAppSelector((state) => state.vendorAuth?.vendor);

    // Determine if user is authenticated and where to redirect
    let isAuthenticated = false;
    let defaultRedirect = "/";

    if (isVendorRoute) {
        isAuthenticated = !!vendorAuth;
        // Direct to status page if authenticated but not approved
        if (isAuthenticated && vendorData && vendorData.status !== "approved") {
            defaultRedirect = "/vendor/status";
        } else {
            defaultRedirect = "/vendor/profile";
        }
    } else if (isAdminRoute) {
        isAuthenticated = !!adminAuth;
        defaultRedirect = "/admin/dashboard";
    } else {
        isAuthenticated = !!userAuth;
        defaultRedirect = "/";
    }

    // If authenticated, redirect away from login/signup pages
    if (isAuthenticated) {
        const to = redirectTo || defaultRedirect;
        return <Navigate to={to} replace />;
    }

    return <>{children}</>;
}
