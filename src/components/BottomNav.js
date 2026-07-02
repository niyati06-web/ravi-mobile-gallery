import React from "react";
import { useNavigate } from "react-router-dom";

export default function BottomNav({ active, onFilterClick, onAIClick }) {
  const navigate = useNavigate();

  const TABS = [
    { key: "home",   label: "Browse",  icon: "🏠", action: () => navigate("/browse") },
    { key: "filter", label: "Filters", icon: "⚙️", action: onFilterClick },
    { key: "chat",   label: "Ask AI",  icon: "🤖", action: onAIClick },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {TABS.map((t) => (
          <button
            key={t.key}
            style={{ ...styles.btn, ...(active === t.key ? styles.btnOn : {}) }}
            onClick={t.action}
          >
            {active === t.key && <div style={styles.activeDot} />}
            <span style={{ fontSize: "20px" }}>{t.icon}</span>
            <span style={{ fontSize: "10px", fontWeight: active === t.key ? "600" : "400" }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    position: "fixed", bottom: 0, left: "50%",
    transform: "translateX(-50%)",
    width: "100%", maxWidth: "480px",
    padding: "0 12px 10px",
    background: "transparent", zIndex: 20,
  },
  inner: {
    background: "#fff", borderRadius: "20px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
    border: "1px solid #E5E7EB",
    display: "flex", padding: "5px",
  },
  btn: {
    flex: 1, display: "flex", flexDirection: "column",
    alignItems: "center", gap: "2px",
    padding: "8px 4px", border: "none",
    background: "none", cursor: "pointer",
    color: "#9ca3af", borderRadius: "14px",
    position: "relative", transition: "all 0.15s",
  },
  btnOn: {
    background: "linear-gradient(135deg, #EAF1F8, #E8EEF5)",
    color: "#1A3D63",
  },
  activeDot: {
    position: "absolute", top: "4px",
    width: "4px", height: "4px",
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    borderRadius: "50%",
  },
};