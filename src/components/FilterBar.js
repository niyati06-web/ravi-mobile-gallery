import React from "react";

const FILTERS = ["All", "Samsung", "Apple", "Redmi", "Vivo", "Under ₹5k", "4+ Stars"];

export default function FilterBar({ active, onChange }) {
  return (
    <div style={styles.wrap}>
      {FILTERS.map((f) => (
        <button
          key={f}
          style={{
            ...styles.chip,
            ...(active === f ? styles.chipOn : {}),
          }}
          onClick={() => onChange(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

const styles = {
  wrap: {
    background: "#fff",
    padding: "10px 16px",
    borderBottom: "1px solid #E5E7EB",
    display: "flex", gap: "7px",
    overflowX: "auto", scrollbarWidth: "none",
  },
  chip: {
    fontSize: "12px", fontWeight: "500",
    padding: "6px 14px",
    border: "1px solid #D1D5DB",
    borderRadius: "6px",
    background: "#fff",
    color: "#374151",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.12s",
  },
  chipOn: {
    background: "#0A1931",
    borderColor: "#0A1931",
    color: "#fff",
  },
};