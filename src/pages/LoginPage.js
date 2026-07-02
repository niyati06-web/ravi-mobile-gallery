import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }

    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);

    if (result.success) {
      navigate("/admin");
    } else {
      setError(result.message || "Invalid credentials.");
    }
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.icon}>📱</div>
          <h1 style={styles.shopName}>Ravi Mobile Gallery</h1>
          <p style={styles.subtext}>Admin access only</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Security note */}
        <p style={styles.note}>🔒 This page is not visible to customers</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#F9FAFB",
  },
  card: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "14px",
    padding: "28px 24px",
    width: "100%",
    maxWidth: "320px",
  },
  logoWrap: {
    textAlign: "center",
    marginBottom: "22px",
  },
  icon: {
    fontSize: "36px",
    marginBottom: "8px",
    display: "block",
  },
  shopName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
  },
  subtext: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "2px",
  },
  error: {
    fontSize: "12px",
    color: "#dc2626",
    background: "#FEF2F2",
    border: "1px solid #FECACA",
    borderRadius: "6px",
    padding: "8px 10px",
    marginBottom: "10px",
  },
  note: {
    textAlign: "center",
    fontSize: "11px",
    color: "#9ca3af",
    marginTop: "14px",
  },
};