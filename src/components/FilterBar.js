import React from "react";

const CATS = [
  { label: "All",        emoji: "📱", filter: "All" },
  { label: "Samsung",    emoji: "S",  filter: "Samsung",   color: "#1A3D63" },
  { label: "Apple",      emoji: "A",  filter: "Apple",     color: "#374151" },
  { label: "Redmi",      emoji: "R",  filter: "Redmi",     color: "#dc2626" },
  { label: "Vivo",       emoji: "V",  filter: "Vivo",      color: "#7c3aed" },
  { label: "Under ₹5k",  emoji: "₹",  filter: "Under ₹5k", color: "#d97706" },
  { label: "4+ Stars",   emoji: "★",  filter: "4+ Stars",  color: "#f59e0b" },
  { label: "Like New",   emoji: "✦",  filter: "Like new",  color: "#16a34a" },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div style={styles.wrap}>
      <div style={styles.scroll}>
        {CATS.map((c) => {
          const isOn = active === c.filter;
          return (
            <div key={c.label} style={styles.item} onClick={() => onChange(c.filter)}>
              <div style={{
                ...styles.circle,
                background: isOn ? (c.color || "#0A1931") : "#fff",
                borderColor: isOn ? (c.color || "#0A1931") : "#E5E7EB",
                boxShadow: isOn ? `0 4px 12px ${c.color || "#0A1931"}40` : "0 2px 6px rgba(0,0,0,0.05)",
                transform: isOn ? "translateY(-3px)" : "none",
              }}>
                <span style={{ fontSize: c.label === "All" ? "20px" : "14px", fontWeight: "800", color: isOn ? "#fff" : (c.color || "#374151") }}>
                  {c.emoji}
                </span>
              </div>
              <span style={{ ...styles.label, color: isOn ? (c.color || "#0A1931") : "#6b7280", fontWeight: isOn ? "700" : "500" }}>
                {c.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: { background: "#F0F4FF", padding: "14px 16px 10px", borderBottom: "1px solid #E5E7EB" },
  scroll: { display: "flex", gap: "16px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px" },
  item: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", cursor: "pointer", flexShrink: 0 },
  circle: {
    width: "52px", height: "52px",
    borderRadius: "50%",
    border: "2px solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    transition: "all 0.2s",
  },
  label: { fontSize: "10px", whiteSpace: "nowrap", transition: "all 0.2s" },
};