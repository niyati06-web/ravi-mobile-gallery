import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AddPhone from "./AddPhone";
import ManageListings from "./ManageListings";
import AITools from "./AITools";

const TABS = ["Add phone", "Listings", "AI tools"];

export default function AdminDashboard() {
  const { admin, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Add phone");
  const [stats, setStats] = useState({ listed: 0, sold: 0, inquiries: 0 });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/phones/stats`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <div style={styles.wrap}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <div style={styles.topLeft}>
          <div style={styles.logoBox}>R</div>
          <div>
            <div style={styles.topTitle}>Admin Panel</div>
            <div style={styles.topSub}>Ravi Mobile Gallery</div>
          </div>
        </div>
        <button style={styles.signOutBtn} onClick={handleLogout}>Sign out</button>
      </div>

      {/* Welcome banner */}
      <div style={styles.banner}>
        <div style={styles.bannerLeft}>
          <div style={styles.bannerTitle}>👋 Welcome back, {admin?.username}!</div>
          <div style={styles.bannerSub}>Manage your phone listings from here</div>
        </div>
        <div style={styles.bannerIcon}>📱</div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={{ ...styles.stat, borderTop: "3px solid #1A3D63" }}>
          <div style={{ ...styles.statNum, color: "#1A3D63" }}>{stats.listed}</div>
          <div style={styles.statLabel}>Listed</div>
          <div style={styles.statIcon}>📋</div>
        </div>
        <div style={{ ...styles.stat, borderTop: "3px solid #16a34a" }}>
          <div style={{ ...styles.statNum, color: "#16a34a" }}>{stats.sold}</div>
          <div style={styles.statLabel}>Sold</div>
          <div style={styles.statIcon}>✅</div>
        </div>
        <div style={{ ...styles.stat, borderTop: "3px solid #d97706" }}>
          <div style={{ ...styles.statNum, color: "#d97706" }}>{stats.inquiries}</div>
          <div style={styles.statLabel}>Inquiries</div>
          <div style={styles.statIcon}>💬</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {TABS.map((t) => (
          <button
            key={t}
            style={{
              ...styles.tab,
              ...(activeTab === t ? styles.tabOn : {}),
            }}
            onClick={() => setActiveTab(t)}
          >
            {t === "Add phone"  && "➕ "}
            {t === "Listings"   && "📋 "}
            {t === "AI tools"   && "✨ "}
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.tabBody}>
        {activeTab === "Add phone" && <AddPhone />}
        {activeTab === "Listings"  && <ManageListings />}
        {activeTab === "AI tools"  && <AITools />}
      </div>
    </div>
  );
}

const styles = {
  wrap: { background: "#F9FAFB", minHeight: "100vh" },
  topBar: {
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    padding: "0 16px", height: "52px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 10,
    boxShadow: "0 2px 12px rgba(10,25,49,0.25)",
  },
  topLeft: { display: "flex", alignItems: "center", gap: "10px" },
  logoBox: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "9px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "700", color: "#fff",
  },
  topTitle: { fontSize: "14px", fontWeight: "700", color: "#fff" },
  topSub:   { fontSize: "10px", color: "rgba(255,255,255,0.65)" },
  signOutBtn: {
    fontSize: "12px", color: "#dc2626",
    background: "#fff", border: "none",
    borderRadius: "6px", padding: "6px 12px",
    cursor: "pointer", fontWeight: "500",
  },
  banner: {
    margin: "14px 16px",
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    borderRadius: "14px", padding: "16px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    boxShadow: "0 4px 16px rgba(10,25,49,0.2)",
  },
  bannerLeft:  {},
  bannerTitle: { fontSize: "14px", fontWeight: "600", color: "#fff" },
  bannerSub:   { fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "3px" },
  bannerIcon:  { fontSize: "36px" },
  statsRow: {
    display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px", padding: "0 16px 14px",
  },
  stat: {
    background: "#fff",
    border: "1px solid #E5E7EB",
    borderRadius: "12px", padding: "12px",
    textAlign: "center", position: "relative",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  statNum:   { fontSize: "24px", fontWeight: "700" },
  statLabel: { fontSize: "11px", color: "#6b7280", marginTop: "2px" },
  statIcon:  { fontSize: "18px", marginTop: "4px" },
  tabs: {
    display: "flex", background: "#fff",
    borderBottom: "1px solid #E5E7EB",
    padding: "0 12px",
  },
  tab: {
    flex: 1, padding: "11px 4px",
    fontSize: "12px", fontWeight: "500",
    border: "none", background: "none",
    cursor: "pointer", color: "#6b7280",
    borderBottom: "2px solid transparent",
    marginBottom: "-1px", transition: "all 0.12s",
  },
  tabOn: { color: "#1A3D63", borderBottom: "2px solid #1A3D63", fontWeight: "600" },
  tabBody: { padding: "14px 16px 40px" },
};