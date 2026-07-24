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
    { icon: "⭐", label: "Saved phones",   bg: "#F5F3FF", action: () => { navigate("/saved");  closeMenu(); } },
    { icon: "📞", label: "Contact shop",   bg: "#F0FDF4", action: () => { navigate("/contact"); closeMenu(); } },
    { icon: "🔔", label: "Notifications",  bg: "#FFFBEB", action: () => { navigate("/notifications"); closeMenu(); } },
    { icon: "⚙️", label: "Settings",       bg: "#F9FAFB", action: () => { navigate("/settings"); closeMenu(); } },
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
          <div style={{ ...styles.menuItem, color: "#dc2626" }} onClick={() => { onLogout(); closeMenu(); }}>
            <div style={{ ...styles.menuIconBox, background: "#FEF2F2" }}>🚪</div>
            <span>Logout</span>
          </div>
        </div>
      </div>

      <nav style={styles.nav}>
        <div style={styles.navLeft}>
          <button style={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="Menu">
            <span style={styles.hamLine} />
            <span style={{ ...styles.hamLine, width: "13px" }} />
            <span style={styles.hamLine} />
          </button>
          <div style={styles.logo} onClick={() => navigate("/browse")}>
            <div style={styles.logoIcon}>
              <span style={styles.logoLetter}>R</span>
            </div>
            <div>
              <div style={styles.logoText}>Ravi Mobile Gallery</div>
              <div style={styles.logoSub}>Badnapur · Since 2010</div>
            </div>
          </div>
        </div>
        <div style={styles.navRight}>
          <button style={styles.navIconBtn}>🔔</button>
          <div style={styles.avatar} onClick={() => setMenuOpen(true)}>{initials}</div>
        </div>
      </nav>
    </>
  );
}

const styles = {
  nav: { background: "linear-gradient(135deg,#1A3D63,#0A1931)", padding: "0 20px", height: "58px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 30, boxShadow: "0 2px 16px rgba(10,25,49,0.25)" },
  navLeft: { display: "flex", alignItems: "center", gap: "12px" },
  navRight: { display: "flex", alignItems: "center", gap: "10px" },
  hamburger: { width: "36px", height: "36px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "9px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" },
  hamLine: { display: "block", width: "18px", height: "1.5px", background: "#fff", borderRadius: "2px" },
  logo: { display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  logoIcon: { width: "38px", height: "38px", background: "#fff", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" },
  logoLetter: { fontSize: "20px", fontWeight: "900", color: "#0A1931", fontFamily: "Poppins,sans-serif", lineHeight: 1 },
  logoText: { fontSize: "14px", fontWeight: "700", color: "#fff", letterSpacing: "0.2px", lineHeight: 1.2, fontFamily: "Poppins,sans-serif" },
  logoSub: { fontSize: "9px", color: "rgba(255,255,255,0.5)", marginTop: "2px", fontFamily: "Poppins,sans-serif" },
  navIconBtn: { width: "36px", height: "36px", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "9px", cursor: "pointer", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center" },
  avatar: { width: "36px", height: "36px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "700", color: "#fff", cursor: "pointer", border: "2px solid rgba(255,255,255,0.3)", fontFamily: "Poppins,sans-serif" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 40 },
  sideMenu: { position: "fixed", top: 0, width: "270px", height: "100vh", background: "#fff", zIndex: 50, boxShadow: "4px 0 24px rgba(0,0,0,0.12)", transition: "left 0.3s cubic-bezier(0.4,0,0.2,1)", overflowY: "auto" },
  menuHeader: { background: "linear-gradient(135deg,#1A3D63,#0A1931)", padding: "44px 20px 22px", color: "#fff" },
  menuAvatar: { width: "52px", height: "52px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", fontWeight: "700", marginBottom: "10px", border: "2px solid rgba(255,255,255,0.3)" },
  menuName: { fontSize: "15px", fontWeight: "600" },
  menuEmail: { fontSize: "11px", opacity: 0.65, marginTop: "2px" },
  menuItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 20px", fontSize: "13px", fontWeight: "500", color: "#111827", cursor: "pointer" },
  menuIconBox: { width: "36px", height: "36px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },
  menuLabel: { fontSize: "13px", fontWeight: "500" },
  menuDivider: { height: "1px", background: "#F3F4F6", margin: "6px 16px" },
};