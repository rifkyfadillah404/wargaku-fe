import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./App.css";

import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";
import DataMasyarakatApp from "./components/DataMasyarakatApp";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  console.log("🛡️ ProtectedRoute Check:");
  console.log("- isAuthenticated:", isAuthenticated);
  console.log("- user:", user);
  console.log("- user role:", user?.role);
  console.log("- loading:", loading);
  console.log("- requiredRole:", requiredRole);

  if (loading) {
    console.log("ProtectedRoute - Still loading...");
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    console.log("ProtectedRoute - Role mismatch, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("ProtectedRoute - Access granted");
  return children;
};

// Dashboard Router Component
const DashboardRouter = () => {
  const { user } = useAuth();

  console.log("🏠 DashboardRouter Check:");
  console.log("- Current user:", user);
  console.log("- User role:", user?.role);
  console.log("- Role type:", typeof user?.role);

  if (user?.role === "admin") {
    console.log("✅ Redirecting to AdminDashboard");
    return <AdminDashboard />;
  } else if (user?.role === "user") {
    console.log("✅ Redirecting to UserDashboard");
    return <UserDashboard />;
  }

  console.log("❌ No valid role found, redirecting to login");
  console.log("Available roles: admin, user");
  console.log("Current role:", user?.role);
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
            }}
          />

          <Routes>
            <Route path="/login" element={<Login />} />

            {/* PROPER USER DASHBOARD */}
            <Route path="/user" element={<UserDashboard />} />

            {/* FORCE USER DASHBOARD - NO PROTECTION */}
            <Route path="/user-dashboard" element={<UserDashboard />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/masyarakat"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DataMasyarakatApp />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
