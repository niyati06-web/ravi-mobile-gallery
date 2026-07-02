import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [admin, setAdmin]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore user session
    const uToken = sessionStorage.getItem("rmg_user_token");
    const uData  = sessionStorage.getItem("rmg_user_data");
    if (uToken && uData) setUser(JSON.parse(uData));

    // Restore admin session
    const aToken = sessionStorage.getItem("rmg_token");
    const aUser  = sessionStorage.getItem("rmg_user");
    if (aToken && aUser) setAdmin({ username: aUser, token: aToken });

    setLoading(false);
  }, []);

  // ── User signup ────────────────────────────────────────────────────────────
  const signup = async (name, email, password) => {
    try {
      const res  = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.setItem("rmg_user_token", data.token);
      sessionStorage.setItem("rmg_user_data", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── User login ─────────────────────────────────────────────────────────────
  const loginUser = async (email, password) => {
    try {
      const res  = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.setItem("rmg_user_token", data.token);
      sessionStorage.setItem("rmg_user_data", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── Google login ───────────────────────────────────────────────────────────
  const loginGoogle = async (credential) => {
    try {
      const res  = await fetch("/api/users/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.setItem("rmg_user_token", data.token);
      sessionStorage.setItem("rmg_user_data", JSON.stringify(data.user));
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── User logout ────────────────────────────────────────────────────────────
  const logoutUser = () => {
    sessionStorage.removeItem("rmg_user_token");
    sessionStorage.removeItem("rmg_user_data");
    setUser(null);
  };

  // ── Admin login ────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    try {
      const res  = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      sessionStorage.setItem("rmg_token", data.token);
      sessionStorage.setItem("rmg_user", username);
      setAdmin({ username, token: data.token });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── Admin logout ───────────────────────────────────────────────────────────
  const logout = () => {
    sessionStorage.removeItem("rmg_token");
    sessionStorage.removeItem("rmg_user");
    setAdmin(null);
  };

  const getUserToken = () => sessionStorage.getItem("rmg_user_token");
  const getToken     = () => sessionStorage.getItem("rmg_token");

  return (
    <AuthContext.Provider value={{
      user, admin, loading,
      signup, loginUser, loginGoogle, logoutUser,
      login, logout,
      getUserToken, getToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}