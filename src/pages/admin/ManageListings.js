import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export default function ManageListings() {
  const { getToken } = useAuth();
  const [phones, setPhones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPhones = () => {
    fetch("/api/phones", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => r.json())
      .then((data) => { setPhones(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchPhones(); }, []);

  const markSold = async (id) => {
    await fetch(`/api/phones/${id}/sold`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchPhones();
  };

  const deletePhone = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    setDeletingId(id);
    await fetch(`/api/phones/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    setDeletingId(null);
    fetchPhones();
  };

  if (loading) return <div className="loading-screen" style={{ minHeight: "200px" }}><div className="spinner" /></div>;

  if (phones.length === 0)
    return <p style={{ textAlign: "center", color: "var(--text3)", padding: "40px 0" }}>No listings yet. Add a phone first.</p>;

  return (
    <div style={styles.card}>
      {phones.map((p) => (
        <div key={p._id} style={styles.row}>
          {/* Icon */}
          <div style={styles.icon}>📱</div>

          {/* Info */}
          <div style={{ flex: 1 }}>
            <div style={styles.name}>{p.name}</div>
            <div style={styles.sub}>
              ₹{Number(p.price).toLocaleString("en-IN")} · {p.condition} · {"★".repeat(p.stars)}
              {p.sold && <span style={styles.soldBadge}> · SOLD</span>}
            </div>
            <div style={styles.mediaSub}>
              {p.images?.length > 0 && `📷 ${p.images.length} photo${p.images.length > 1 ? "s" : ""}`}
              {p.video?.url && "  🎥 Video"}
            </div>
          </div>

          {/* Actions */}
          <div style={styles.actions}>
            {!p.sold && (
              <button
                style={styles.soldBtn}
                onClick={() => markSold(p._id)}
                title="Mark as sold"
              >
                ✅
              </button>
            )}
            <button
              style={styles.deleteBtn}
              onClick={() => deletePhone(p._id)}
              disabled={deletingId === p._id}
              title="Delete listing"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "4px 14px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "11px 0",
    borderBottom: "1px solid var(--border)",
  },
  icon: {
    width: "38px", height: "38px",
    background: "var(--bg)",
    borderRadius: "8px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "20px",
    border: "1px solid var(--border)",
    flexShrink: 0,
  },
  name:     { fontSize: "13px", fontWeight: "500" },
  sub:      { fontSize: "11px", color: "var(--text3)", marginTop: "2px" },
  mediaSub: { fontSize: "10px", color: "var(--text3)", marginTop: "2px" },
  soldBadge:{ color: "var(--green)", fontWeight: "600" },
  actions:  { display: "flex", gap: "6px", flexShrink: 0 },
  soldBtn: {
    width: "30px", height: "30px",
    border: "1px solid var(--green-border)",
    borderRadius: "var(--radius)",
    background: "var(--green-light)",
    cursor: "pointer", fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  deleteBtn: {
    width: "30px", height: "30px",
    border: "1px solid var(--red-border)",
    borderRadius: "var(--radius)",
    background: "var(--red-light)",
    cursor: "pointer", fontSize: "14px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
};