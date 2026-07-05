import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import HeroSlider from "../components/HeroSlider";
import FeatureStrip from "../components/FeatureStrip";
import FilterBar from "../components/FilterBar";
import PhoneCard from "../components/PhoneCard";
import AIRequirementBox from "../components/AIRequirementBox";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";

const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
const BENTO = [
  { label: "Most Popular", brand: "Samsung", filter: "Samsung", color: "linear-gradient(135deg,#1e3a5f,#0f172a)", count: "8+" },
  { label: "Premium",      brand: "Apple",   filter: "Apple",   color: "linear-gradient(135deg,#374151,#111827)", count: "3+" },
  { label: "Budget Pick",  brand: "Redmi",   filter: "Redmi",   color: "linear-gradient(135deg,#dc2626,#7f1d1d)", count: "5+" },
  { label: "Trending",     brand: "Vivo",    filter: "Vivo",    color: "linear-gradient(135deg,#7c3aed,#4c1d95)", count: "4+" },
  { label: "Best Value",   brand: "Under ₹5k", filter: "Under ₹5k", color: "linear-gradient(135deg,#d97706,#92400e)", count: "6+" },
];

export default function BrowsePage() {
  const { user, logoutUser } = useAuth();
  const [phones, setPhones]             = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [search, setSearch]             = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [listening, setListening]       = useState(false);
  const [loading, setLoading]           = useState(true);
  const aiRef     = useRef(null);
  const filterRef = useRef(null);
  const prodRef   = useRef(null);

  // Cursor trail
  useEffect(() => {
    if (!document.getElementById("rmg-cursor-style")) {
      const style = document.createElement("style");
      style.id = "rmg-cursor-style";
      style.innerHTML = `@keyframes rmgFade{0%{opacity:0.7;transform:translate(-50%,-50%) scale(1)}100%{opacity:0;transform:translate(-50%,-50%) scale(0)}}`;
      document.head.appendChild(style);
    }
    const handler = (e) => {
      const trail = document.createElement("div");
      trail.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:7px;height:7px;border-radius:50%;pointer-events:none;background:rgba(26,61,99,0.3);z-index:9999;transform:translate(-50%,-50%);animation:rmgFade 0.5s ease forwards;`;
      document.body.appendChild(trail);
      setTimeout(() => trail.remove(), 500);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/phones`)
      .then((r) => r.json())
      .then((data) => { setPhones(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    let list = [...phones];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || String(p.price).includes(q));
    }
    if (activeFilter !== "All") {
      if (activeFilter === "Under ₹5k")    list = list.filter(p => p.price < 5000);
      else if (activeFilter === "4+ Stars") list = list.filter(p => p.stars >= 4);
      else if (activeFilter === "Like new") list = list.filter(p => p.condition === "Like new");
      else list = list.filter(p => p.brand.toLowerCase() === activeFilter.toLowerCase());
    }
    setFiltered(list);
  }, [search, activeFilter, phones]);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice search not supported."); return; }
    const r = new SR(); r.lang = "en-IN"; r.start(); setListening(true);
    r.onresult = (e) => { setSearch(e.results[0][0].transcript); setListening(false); };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
  };

  const handleBentoClick = (filter) => {
    setActiveFilter(filter);
    prodRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="page-wrapper">
      <Navbar user={user} onLogout={logoutUser} />

      {/* Hero Slider */}
      <HeroSlider phoneCount={phones.length} />

      {/* Feature strip */}
      <FeatureStrip />

      {/* Category circles */}
      <div ref={filterRef}>
        <FilterBar active={activeFilter} onChange={(f) => { setActiveFilter(f); prodRef.current?.scrollIntoView({ behavior: "smooth" }); }} />
      </div>

      {/* Bento categories — VanMich style */}
      <div style={styles.bentoWrap}>
        <div style={styles.bentoHead}>
          <span style={styles.bentoTitle}>Shop by Brand</span>
          <button style={styles.bentoLink} onClick={() => setActiveFilter("All")}>View all →</button>
        </div>
        <div style={styles.bentoGrid}>
          {BENTO.map((b, i) => (
            <div
              key={b.brand}
              style={{ ...styles.bentoCard, background: b.color, ...(i === 0 ? styles.bentoWide : {}) }}
              onClick={() => handleBentoClick(b.filter)}
            >
              <div style={styles.bentoEye}>{b.label}</div>
              <div style={styles.bentoName}>{b.brand}</div>
              <div style={styles.bentoCnt}>{b.count} phones</div>
              <div style={styles.bentoBrowse}>Browse →</div>
              <div style={styles.bentoPhone}>📱</div>
            </div>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={styles.searchSection}>
        <div style={styles.searchBox}>
          <span style={{ fontSize: "15px", color: "#9ca3af" }}>🔍</span>
          <input
            style={styles.searchInput}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search phones, brands...'
          />
          <button style={{ ...styles.micBtn, color: listening ? "#dc2626" : "#9ca3af" }} onClick={startVoice}>🎙</button>
          {search && <button style={styles.clearX} onClick={() => setSearch("")}>✕</button>}
        </div>
      </div>

      {/* AI Box */}
      <div ref={aiRef}>
        <AIRequirementBox phones={phones} />
      </div>

      {/* Products */}
      <div ref={prodRef} style={styles.prodSection}>
        <div style={styles.prodHead}>
          <div>
            <div style={styles.prodTitle}>Available Phones</div>
            <div style={styles.prodSub}>{filtered.length} listing{filtered.length !== 1 ? "s" : ""}</div>
          </div>
          {search && <button style={styles.clearBtn} onClick={() => setSearch("")}>Clear search ✕</button>}
        </div>

        {loading ? (
          <div style={styles.emptyWrap}><div className="spinner" /></div>
        ) : filtered.length === 0 ? (
          <div style={styles.emptyWrap}>
            <div style={{ fontSize: "44px", marginBottom: "8px" }}>📭</div>
            <p style={styles.emptyTitle}>No phones found</p>
            <p style={styles.emptySub}>{search ? "Try a different search" : "No phones listed yet!"}</p>
            {search && <button style={styles.emptyBtn} onClick={() => setSearch("")}>Show all</button>}
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map(phone => <PhoneCard key={phone._id} phone={phone} />)}
          </div>
        )}
      </div>

      <BottomNav
        active="home"
        onFilterClick={() => filterRef.current?.scrollIntoView({ behavior: "smooth" })}
        onAIClick={() => aiRef.current?.scrollIntoView({ behavior: "smooth" })}
      />
    </div>
  );
}

const styles = {
  bentoWrap:  { padding: "16px 16px 8px" },
  bentoHead:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" },
  bentoTitle: { fontSize: "15px", fontWeight: "700", color: "#111827" },
  bentoLink:  { fontSize: "11px", color: "#1A3D63", fontWeight: "600", background: "none", border: "none", cursor: "pointer", fontFamily: "Poppins, sans-serif" },
  bentoGrid:  { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" },
  bentoCard: {
    borderRadius: "12px", padding: "14px 12px",
    cursor: "pointer", position: "relative", overflow: "hidden",
    minHeight: "90px", transition: "transform 0.15s",
    display: "flex", flexDirection: "column", justifyContent: "space-between",
  },
  bentoWide:  { gridColumn: "span 2" },
  bentoEye:   { fontSize: "9px", fontWeight: "600", color: "rgba(255,255,255,0.6)", letterSpacing: "0.8px", textTransform: "uppercase" },
  bentoName:  { fontSize: "17px", fontWeight: "800", color: "#fff", marginTop: "3px" },
  bentoCnt:   { fontSize: "10px", color: "rgba(255,255,255,0.55)" },
  bentoBrowse:{ display: "inline-block", marginTop: "8px", padding: "4px 12px", background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "20px", fontSize: "10px", color: "#fff", fontWeight: "600" },
  bentoPhone: { position: "absolute", right: "10px", bottom: "8px", fontSize: "32px", opacity: "0.7" },
  searchSection: { padding: "12px 16px 4px" },
  searchBox: { display: "flex", alignItems: "center", gap: "8px", border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "0 12px", height: "42px", background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
  searchInput: { border: "none", background: "transparent", flex: 1, fontSize: "13px", color: "#111827", outline: "none", fontFamily: "Poppins, sans-serif" },
  micBtn:  { background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "2px" },
  clearX:  { background: "none", border: "none", cursor: "pointer", fontSize: "12px", color: "#9ca3af", padding: "2px" },
  prodSection: { padding: "12px 16px 90px" },
  prodHead:  { display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" },
  prodTitle: { fontSize: "15px", fontWeight: "700", color: "#111827" },
  prodSub:   { fontSize: "11px", color: "#9ca3af", marginTop: "2px" },
  clearBtn:  { fontSize: "11px", color: "#dc2626", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "20px", padding: "4px 10px", cursor: "pointer", fontFamily: "Poppins, sans-serif" },
  grid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" },
  emptyWrap: { padding: "50px 20px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" },
  emptyTitle: { fontSize: "14px", fontWeight: "600", color: "#111827" },
  emptySub:   { fontSize: "12px", color: "#9ca3af", textAlign: "center" },
  emptyBtn:   { marginTop: "10px", padding: "8px 18px", background: "#0A1931", color: "#fff", border: "none", borderRadius: "20px", cursor: "pointer", fontSize: "12px", fontFamily: "Poppins, sans-serif" },
};