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

    if (result.success) navigate("/admin");
    else setError(result.message || "Invalid credentials.");
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.bgTop} />
      <div style={styles.bgBottom} />
      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>R</div>
          <h1 style={styles.shopName}>Ravi Mobile Gallery</h1>
          <p style={styles.shopSub}>Admin access only</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button className="btn-primary" type="submit" disabled={loading} style={styles.btn}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p style={styles.note}>🔒 This page is not visible to customers</p>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", padding: "24px",
    background: "#F0F4FF", position: "relative", overflow: "hidden",
  },
  bgTop:    { position: "absolute", top: "-80px", left: "-80px", width: "300px", height: "300px", background: "radial-gradient(circle, #B3CFE5 0%, transparent 70%)", borderRadius: "50%", zIndex: 0 },
  bgBottom: { position: "absolute", bottom: "-80px", right: "-80px", width: "300px", height: "300px", background: "radial-gradient(circle, #B3CFE5 0%, transparent 70%)", borderRadius: "50%", zIndex: 0 },
  card: {
    background: "#fff", borderRadius: "20px", padding: "28px 24px",
    width: "100%", maxWidth: "340px",
    boxShadow: "0 8px 32px rgba(10,25,49,0.10)",
    position: "relative", zIndex: 1,
  },
  logoWrap: { textAlign: "center", marginBottom: "22px" },
  logoBox: {
    width: "64px", height: "64px",
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    borderRadius: "18px",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 10px",
    fontSize: "26px", fontWeight: "700", color: "#fff",
    boxShadow: "0 4px 16px rgba(10,25,49,0.25)",
  },
  shopName: { fontSize: "16px", fontWeight: "600", color: "#111827" },
  shopSub:  { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
  error: {
    fontSize: "12px", color: "#dc2626",
    background: "#FEF2F2", border: "1px solid #FECACA",
    borderRadius: "8px", padding: "8px 10px", marginBottom: "10px",
  },
  btn: {
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    border: "none", boxShadow: "0 4px 12px rgba(10,25,49,0.25)",
  },
  note: { textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "14px" },
};