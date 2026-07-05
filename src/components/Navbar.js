import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  const closeMenu = () => setMenuOpen(false);

  const MENU_ITEMS = [
    { icon: "🏠", label: "Browse phones",  bg: "#EAF1F8", action: () => { navigate("/browse"); closeMenu(); } },
    { icon: "⭐", label: "Saved phones",   bg: "#F5F3FF", action: () => { navigate("/saved"); closeMenu(); } },
    { icon: "📞", label: "Contact shop",   bg: "#F0FDF4", action: () => { navigate("/contact"); closeMenu(); } },
    { icon: "🔔", label: "Notifications",  bg: "#FFFBEB", action: () => { navigate("/notifications"); closeMenu(); } },
    { icon: "⚙️", label: "Settings",       bg: "#F9FAFB", action: () => { navigate("/settings"); closeMenu(); } },
  ];

  return (
    <>
      {menuOpen && <div onClick={closeMenu} style={styles.overlay} />}

      {/* Side menu */}
      <div style={{ ...styles.sideMenu, left: menuOpen ? 0 : "-270px" }}>
        <div style={styles.menuHeader}>
          <div style={styles.menuAvatar}>{initials}</div>
          <div style={styles.menuName}>{user?.name || "User"}</div>
          <div style={styles.menuEmail}>{user?.email}</div>
        </div>
        <div style={{ padding: "10px 0" }}>
          {MENU_ITEMS.map((item) => (
            <div key={item.label} style={styles.menuItem} onClick={item.action}>
              <div style={{ ...styles.menuIconBox, background: item.bg }}>{item.icon}</div>
              <span style={styles.menuLabel}>{item.label}</span>
            </div>
          ))}
          <div style={styles.menuDivider} />
          <div style={{ ...styles.menuItem, ...styles.menuLogout }} onClick={() => { onLogout(); closeMenu(); }}>
            <div style={{ ...styles.menuIconBox, background: "#FEF2F2" }}>🚪</div>
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Top navbar */}
      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <button style={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="Menu">
            <span style={styles.hamLine} />
            <span style={{ ...styles.hamLine, width: "14px" }} />
            <span style={styles.hamLine} />
          </button>

          {/* Clean text logo — no emoji */}
          <div style={styles.logo} onClick={() => navigate("/browse")}>
            <div style={styles.logoMark}>RMG</div>
            <div>
              <div style={styles.logoName}>Ravi Mobile</div>
              <div style={styles.logoSub}>Gallery · Badnapur</div>
            </div>
          </div>
        </div>

        <div style={styles.navRight}>
          <button style={styles.navIconBtn} aria-label="Notifications">🔔</button>
          <div style={styles.avatar} onClick={() => setMenuOpen(true)}>{initials}</div>
        </div>
      </nav>
    </>
  );
}

const styles = {
  nav: {
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    padding: "0 16px", height: "52px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    position: "sticky", top: 0, zIndex: 30,
    boxShadow: "0 2px 10px rgba(10,25,49,0.2)",
  },
  navLeft:  { display: "flex", alignItems: "center", gap: "10px" },
  navRight: { display: "flex", alignItems: "center", gap: "8px" },
  hamburger: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.1)",
    border: "none", borderRadius: "8px",
    cursor: "pointer",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "3px",
  },
  hamLine: { display: "block", width: "18px", height: "1.5px", background: "#fff", borderRadius: "2px" },
  logo: { display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" },
  logoMark: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "10px", fontWeight: "800", color: "#fff",
    letterSpacing: "0.5px",
  },
  logoName: { fontSize: "13px", fontWeight: "700", color: "#fff", letterSpacing: "0.2px" },
  logoSub:  { fontSize: "9px", color: "rgba(255,255,255,0.55)", marginTop: "1px" },
  navIconBtn: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.1)",
    border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "15px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  avatar: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.18)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "11px", fontWeight: "700", color: "#fff",
    cursor: "pointer", border: "1.5px solid rgba(255,255,255,0.3)",
    letterSpacing: "0.5px",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 },
  sideMenu: {
    position: "fixed", top: 0, width: "265px", height: "100vh",
    background: "#fff", zIndex: 50,
    boxShadow: "4px 0 24px rgba(0,0,0,0.12)",
    transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
    overflowY: "auto",
  },
  menuHeader: {
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    padding: "40px 20px 22px", color: "#fff",
  },
  menuAvatar: {
    width: "48px", height: "48px",
    background: "rgba(255,255,255,0.18)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "700", marginBottom: "10px",
    border: "1.5px solid rgba(255,255,255,0.3)",
  },
  menuName:  { fontSize: "15px", fontWeight: "600" },
  menuEmail: { fontSize: "11px", opacity: 0.7, marginTop: "2px" },
  menuItem: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "11px 20px", fontSize: "13px", fontWeight: "500",
    color: "#111827", cursor: "pointer", transition: "background 0.1s",
  },
  menuIconBox: {
    width: "34px", height: "34px", borderRadius: "9px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", flexShrink: 0,
  },
  menuLabel:   { fontSize: "13px", fontWeight: "500" },
  menuDivider: { height: "1px", background: "#F3F4F6", margin: "6px 16px" },
  menuLogout:  { color: "#dc2626" },
};