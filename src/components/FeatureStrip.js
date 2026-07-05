import React from "react";

const FEATURES = [
  { icon: "✅", title: "Quality Tested", sub: "All phones verified" },
  { icon: "⭐", title: "Star Graded",    sub: "1–5 condition rating" },
  { icon: "💬", title: "WhatsApp",       sub: "Instant response" },
  { icon: "🤖", title: "AI Powered",     sub: "Smart suggestions" },
];

export default function FeatureStrip() {
  return (
    <div style={styles.wrap}>
      {FEATURES.map((f) => (
        <div key={f.title} style={styles.item}>
          <div style={styles.icon}>{f.icon}</div>
          <div style={styles.title}>{f.title}</div>
          <div style={styles.sub}>{f.sub}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    display: "grid", gridTemplateColumns: "repeat(4,1fr)",
    borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB",
    background: "#fff",
  },
  item: {
    padding: "12px 8px", textAlign: "center",
    borderRight: "1px solid #E5E7EB",
  },
  icon:  { fontSize: "18px", marginBottom: "4px" },
  title: { fontSize: "10px", fontWeight: "600", color: "#111827" },
  sub:   { fontSize: "9px",  color: "#9ca3af", marginTop: "1px" },
};