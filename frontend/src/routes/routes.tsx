import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Login from "../components/Login";
import Register from "../components/Register";
import MainDashboard from "../components/MainDashboard";
import InquiriesDashboard from "../components/InquiriesDashboard";
import SalesCallsDashboard from "../components/SalesCallsDashboard";
import RatesDashboard from "../components/RatesDashboard";
import AddInquiry from "../components/AddInquiry";
import AddRates from "../components/AddRates";
import AddSalesCall from "../components/AddSalesCall";
import OrganizationsDashboard from "../components/OrganizationsDashboard";
import AddOrganization from "../components/AddOrganization";
import UsersDashboard from "../components/UsersDashboard";
import AddUser from "../components/AddUser";
import UserProfile from "../components/UserProfile";
import AuditDashboard from "../components/AuditDashboard";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import ProtectedRoute from "../components/ProtectedRoute";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    ),
    children: [
      { path: "/", element: <Navigate to="/dashboard" replace /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <MainDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/audit",
        element: (
          <ProtectedRoute requiredRole="root">
            <AuditDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inquiries",
        element: (
          <ProtectedRoute>
            <InquiriesDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/inquiries/add",
        element: (
          <ProtectedRoute>
            <AddInquiry />
          </ProtectedRoute>
        ),
      },
      {
        path: "/salesCalls",
        element: (
          <ProtectedRoute>
            <SalesCallsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/salesCalls/add",
        element: (
          <ProtectedRoute>
            <AddSalesCall />
          </ProtectedRoute>
        ),
      },
      {
        path: "/rates",
        element: (
          <ProtectedRoute>
            <RatesDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/rates/add",
        element: (
          <ProtectedRoute>
            <AddRates />
          </ProtectedRoute>
        ),
      },
      // Organization routes (root only)
      {
        path: "/organizations",
        element: (
          <ProtectedRoute requiredRole="root">
            <OrganizationsDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/organizations/add",
        element: (
          <ProtectedRoute requiredRole="root">
            <AddOrganization />
          </ProtectedRoute>
        ),
      },
      {
        path: "/organizations/:orgId/users",
        element: (
          <ProtectedRoute requiredRole="root">
            <UsersDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/organizations/:orgId/users/add",
        element: (
          <ProtectedRoute requiredRole="root">
            <AddUser />
          </ProtectedRoute>
        ),
      },
      // User management routes
      {
        path: "/users",
        element: (
          <ProtectedRoute requiredRole="root">
            <UsersDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/users/add",
        element: (
          <ProtectedRoute requiredRole="root">
            <AddUser />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default routes;
