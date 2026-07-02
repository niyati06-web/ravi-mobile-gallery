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
    { icon: "🏠", label: "Browse phones",   bg: "#EAF1F8", action: () => { navigate("/browse"); closeMenu(); } },
    { icon: "⭐", label: "Saved phones",    bg: "#F5F3FF", action: closeMenu },
    { icon: "📞", label: "Contact shop",    bg: "#F0FDF4", action: closeMenu },
    { icon: "🔔", label: "Notifications",   bg: "#FFFBEB", action: closeMenu },
  ];

  return (
    <>
      {menuOpen && <div onClick={closeMenu} style={styles.overlay} />}

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
          <div style={styles.menuItem} onClick={closeMenu}>
            <div style={{ ...styles.menuIconBox, background: "#F9FAFB" }}>⚙️</div>
            <span style={styles.menuLabel}>Settings</span>
          </div>
          <div style={{ ...styles.menuItem, ...styles.menuLogout }} onClick={() => { onLogout(); closeMenu(); }}>
            <div style={{ ...styles.menuIconBox, background: "#FEF2F2" }}>🚪</div>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <button style={styles.navBtn} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <span style={styles.hamLine} />
            <span style={{ ...styles.hamLine, width: "14px" }} />
            <span style={styles.hamLine} />
          </button>

          {/* Logo — just shop initial, no phone emoji */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>R</div>
            <div>
              <div style={styles.logoName}>Ravi Mobile Gallery</div>
              <div style={styles.logoSub}>📍 Badnapur</div>
            </div>
          </div>
        </div>

        <div style={styles.navRight}>
          <button style={styles.navBtn} aria-label="Notifications">🔔</button>
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
    boxShadow: "0 2px 12px rgba(10,25,49,0.25)",
  },
  navLeft:  { display: "flex", alignItems: "center", gap: "10px" },
  navRight: { display: "flex", alignItems: "center", gap: "8px" },
  navBtn: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.12)",
    border: "none", borderRadius: "8px",
    cursor: "pointer", fontSize: "16px",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "3px",
    color: "#fff",
  },
  hamLine: { display: "block", width: "18px", height: "2px", background: "#fff", borderRadius: "2px" },
  logo:     { display: "flex", alignItems: "center", gap: "9px" },
  logoIcon: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.15)",
    borderRadius: "9px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", fontWeight: "700", color: "#fff",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.15)",
  },
  logoName: { fontSize: "13px", fontWeight: "700", color: "#fff" },
  logoSub:  { fontSize: "10px", color: "rgba(255,255,255,0.65)", marginTop: "1px" },
  avatar: {
    width: "34px", height: "34px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", color: "#fff",
    cursor: "pointer", border: "2px solid rgba(255,255,255,0.35)",
  },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 40 },
  sideMenu: {
    position: "fixed", top: 0, width: "265px", height: "100vh",
    background: "#fff", zIndex: 50,
    boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
    transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)",
    overflowY: "auto",
  },
  menuHeader: {
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    padding: "40px 20px 22px", color: "#fff",
  },
  menuAvatar: {
    width: "50px", height: "50px",
    background: "rgba(255,255,255,0.2)",
    borderRadius: "50%",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px", fontWeight: "700", marginBottom: "10px",
    border: "2px solid rgba(255,255,255,0.35)",
  },
  menuName:  { fontSize: "15px", fontWeight: "600" },
  menuEmail: { fontSize: "11px", opacity: 0.75, marginTop: "2px" },
  menuItem: {
    display: "flex", alignItems: "center", gap: "12px",
    padding: "11px 20px", fontSize: "13px", fontWeight: "500",
    color: "#111827", cursor: "pointer",
  },
  menuIconBox: {
    width: "34px", height: "34px", borderRadius: "9px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "16px", flexShrink: 0,
  },
  menuLabel:   { fontSize: "13px" },
  menuDivider: { height: "1px", background: "#E5E7EB", margin: "8px 16px" },
  menuLogout:  { color: "#dc2626" },
};