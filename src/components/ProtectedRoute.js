import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  // Wait until auth state is loaded
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  // Not logged in — redirect to admin login
  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}