import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import UserRoute from "./components/UserRoute";

import AuthPage from "./pages/AuthPage";
import BrowsePage from "./pages/BrowsePage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminDashboard from "./pages/admin/AdminDashboard";

import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* User login/signup */}
          <Route path="/" element={<AuthPage />} />

          {/* Reset password */}
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Browse — only after user login */}
          <Route path="/browse" element={<UserRoute><BrowsePage /></UserRoute>} />

          {/* Admin login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Admin panel */}
          <Route path="/admin/*" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}