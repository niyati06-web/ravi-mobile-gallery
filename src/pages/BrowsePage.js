import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import FilterBar from "../components/FilterBar";
import PhoneCard from "../components/PhoneCard";
import AIRequirementBox from "../components/AIRequirementBox";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

export default function BrowsePage() {
  const { user, logoutUser } = useAuth();
  const [phones, setPhones]             = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [listening, setListening]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Refs for scroll-to
  const aiRef     = useRef(null);
  const filterRef = useRef(null);

  // Cursor trail
  useEffect(() => {
    const handler = (e) => {
      const trail = document.createElement("div");
      trail.style.cssText = `
        position:fixed;left:${e.clientX}px;top:${e.clientY}px;
        width:8px;height:8px;border-radius:50%;pointer-events:none;
        background:rgba(26,61,99,0.35);z-index:9999;
        transform:translate(-50%,-50%);
        animation:rmgFade 0.5s ease forwards;
      `;
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 500);
    };
    // Add keyframe animation once
    if (!document.getElementById("rmg-cursor-style")) {
      const style = document.createElement("style");
      style.id = "rmg-cursor-style";
      style.innerHTML = `@keyframes rmgFade{0%{opacity:0.8;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0)}}`;
      document.head.appendChild(style);
    }
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    fetch("/api/phones")
      .then((r) => r.json())
      .then((data) => { setPhones(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...phones];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        String(p.price).includes(q)
      );
    }
    if (activeFilter !== "All") {
      if (activeFilter === "Under ₹5k")      list = list.filter((p) => p.price < 5000);
      else if (activeFilter === "★ 4+")       list = list.filter((p) => p.stars >= 4);
      else list = list.filter((p) => p.brand.toLowerCase() === activeFilter.toLowerCase());
    }
    setFiltered(list);
  }, [search, activeFilter, phones]);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice search not supported on this browser."); return; }
    const r = new SR(); r.lang = "en-IN"; r.start(); setListening(true);
    r.onresult = (e) => { setSearch(e.results[0][0].transcript); setListening(false); };
    r.onerror  = () => setListening(false);
    r.onend    = () => setListening(false);
  };

  const scrollToAI = () => {
    aiRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToFilter = () => {
    filterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setShowFilterPanel(true);
  };

  return (
    <div className="page-wrapper">
      <Navbar user={user} onLogout={logoutUser} />

      {/* Search */}
      <div style={styles.searchRow}>
        <div style={styles.searchBox}>
          <span style={{ fontSize: "15px" }}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phones..."
          />
          <button
            style={{ ...styles.micBtn, color: listening ? "#dc2626" : "#9ca3af" }}
            onClick={startVoice}
            aria-label="Voice search"
          >🎙</button>
        </div>
        <div style={styles.aiBadge}>✨ AI</div>
      </div>

      {/* Filters */}
      <div ref={filterRef}>
        <FilterBar active={activeFilter} onChange={setActiveFilter} />
      </div>

      {/* AI Box */}
      <div ref={aiRef}>
        <AIRequirementBox phones={phones} />
      </div>

      {/* Stats */}
      {!loading && (
        <div style={styles.statsBar}>
          <div style={styles.statsLeft}>
            <span style={styles.statsCount}>{filtered.length}</span>
            <span style={styles.statsLabel}>phones available</span>
          </div>
          {search && (
            <button style={styles.clearBtn} onClick={() => setSearch("")}>
              Clear ✕
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={styles.emptyWrap}><div className="spinner" /></div>
      ) : filtered.length === 0 ? (
        <div style={styles.emptyWrap}>
          <div style={{ fontSize: "48px", marginBottom: "10px" }}>📭</div>
          <p style={styles.emptyTitle}>No phones found</p>
          <p style={styles.emptyDesc}>
            {search ? "Try a different search" : "No phones listed yet — check back soon!"}
          </p>
          {search && (
            <button style={styles.emptyBtn} onClick={() => setSearch("")}>Show all</button>
          )}
        </div>
      ) : (
        <div style={styles.grid} className="page-content">
          {filtered.map((phone) => (
            <PhoneCard key={phone._id} phone={phone} />
          ))}
        </div>
      )}

      <BottomNav
        active="home"
        onFilterClick={scrollToFilter}
        onAIClick={scrollToAI}
      />
    </div>
  );
}

const styles = {
  searchRow: {
    background: "#fff", padding: "10px 16px",
    borderBottom: "1px solid #E5E7EB",
    display: "flex", gap: "8px", alignItems: "center",
  },
  searchBox: {
    flex: 1, display: "flex", alignItems: "center", gap: "8px",
    border: "1px solid #E5E7EB", borderRadius: "24px",
    padding: "0 12px", height: "40px", background: "#F9FAFB",
  },
  searchInput: {
    border: "none", background: "transparent",
    flex: 1, fontSize: "13px", color: "#111827", outline: "none",
  },
  micBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "16px" },
  aiBadge: {
    fontSize: "11px", fontWeight: "700",
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    color: "#fff", padding: "5px 10px",
    borderRadius: "20px", whiteSpace: "nowrap",
    boxShadow: "0 2px 8px rgba(10,25,49,0.2)",
  },
  statsBar: {
    padding: "10px 16px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
  },
  statsLeft:  { display: "flex", alignItems: "center", gap: "6px" },
  statsCount: { fontSize: "18px", fontWeight: "700", color: "#1A3D63" },
  statsLabel: { fontSize: "12px", color: "#6b7280" },
  clearBtn: {
    fontSize: "11px", color: "#dc2626",
    background: "#FEF2F2", border: "1px solid #FECACA",
    borderRadius: "20px", padding: "4px 10px", cursor: "pointer",
  },
  grid: {
    display: "grid", gridTemplateColumns: "1fr 1fr",
    gap: "12px", padding: "0 16px 90px",
  },
  emptyWrap: {
    padding: "60px 20px",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "6px",
  },
  emptyTitle: { fontSize: "15px", fontWeight: "600", color: "#111827" },
  emptyDesc:  { fontSize: "13px", color: "#9ca3af", textAlign: "center" },
  emptyBtn: {
    marginTop: "12px", padding: "8px 20px",
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    color: "#fff", border: "none", borderRadius: "20px",
    cursor: "pointer", fontSize: "13px", fontWeight: "500",
  },
};