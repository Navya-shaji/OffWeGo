import React from "react";
import { useAppSelector } from "@/hooks";
import { Navigate } from "react-router-dom";
type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}