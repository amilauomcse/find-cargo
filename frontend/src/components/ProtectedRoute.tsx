import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "root" | "admin" | "manager" | "employee";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  console.log(
    "ProtectedRoute - isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated,
    "user:",
    user
  );

  // Show loading while authentication is being determined
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // If role is required and user doesn't have the required role
  if (requiredRole && user?.role !== requiredRole) {
    // Root can access everything
    if (user?.role === "root") {
      return <>{children}</>;
    }

    // Admin can access admin, manager, and employee routes
    if (user?.role === "admin" && ["admin", "manager", "employee"].includes(requiredRole)) {
      return <>{children}</>;
    }

    // Manager can access manager and employee routes
    if (user?.role === "manager" && ["manager", "employee"].includes(requiredRole)) {
      return <>{children}</>;
    }

    // Employee can only access employee routes
    if (user?.role === "employee" && requiredRole === "employee") {
      return <>{children}</>;
    }

    // If user doesn't have the required role, redirect to dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
