import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WHATSAPP = process.env.REACT_APP_SHOP_WHATSAPP || "919999999999";

const SLIDES = [
  {
    tag: "Best Deals in Badnapur",
    title: "Best 2nd Hand",
    bold: "Phones.",
    desc: "Quality tested & star graded phones at unbeatable prices.",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #2a5a8a 100%)",
    accent: "#4A7FA7",
    side: { label: "New Arrival", name: "Samsung A-Series", bg: "linear-gradient(135deg,#7c3aed,#4c1d95)" },
    side2: { label: "Hot Deal", name: "iPhone 11 Like New", bg: "linear-gradient(135deg,#0f172a,#1e3a5f)" },
  },
  {
    tag: "Limited Stock Available",
    title: "Certified Quality",
    bold: "Guaranteed.",
    desc: "Every phone star graded 1-5. Know exactly what you are buying.",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)",
    accent: "#e94560",
    side: { label: "5 Star Grade", name: "iPhone 11 64GB", bg: "linear-gradient(135deg,#374151,#111827)" },
    side2: { label: "Budget Pick", name: "Redmi Note 10", bg: "linear-gradient(135deg,#dc2626,#7f1d1d)" },
  },
];

export default function HeroSlider({ phoneCount = 0 }) {
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  const s = SLIDES[idx];

  return (
    <div>
      {/* Trending bar */}
      <div style={styles.trendBar}>
        <span style={styles.trendLabel}>🔥 TRENDING:</span>
        <div style={styles.trendScroll}>
          {["Samsung A32", "iPhone 11", "Redmi Note 10", "Under ₹5000", "Like New"].map(t => (
            <button key={t} style={styles.trendChip} onClick={() => navigate("/browse")}>{t}</button>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ ...styles.hero, background: s.bg }}>
        <div style={styles.heroBg} />
        {/* Left */}
        <div style={styles.heroLeft}>
          <div style={styles.heroTag}>{s.tag}</div>
          <div style={styles.heroTitle}>
            {s.title}<br />
            <span style={{ ...styles.heroBold, color: s.accent }}>{s.bold}</span>
          </div>
          <div style={styles.heroDesc}>{s.desc}</div>
          <div style={styles.heroBtns}>
            <button style={styles.heroBtn} onClick={() => navigate("/browse")}>Shop Now →</button>
            <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" style={styles.heroWa}>💬 WhatsApp</a>
          </div>
          {/* Stats */}
          <div style={styles.heroStats}>
            <div style={styles.heroStat}><div style={styles.heroStatNum}>{phoneCount}+</div><div style={styles.heroStatLabel}>Phones</div></div>
            <div style={styles.heroStatDiv} />
            <div style={styles.heroStat}><div style={styles.heroStatNum}>5⭐</div><div style={styles.heroStatLabel}>Graded</div></div>
            <div style={styles.heroStatDiv} />
            <div style={styles.heroStat}><div style={styles.heroStatNum}>100%</div><div style={styles.heroStatLabel}>Verified</div></div>
          </div>
          {/* Dots */}
          <div style={styles.dots}>
            {SLIDES.map((_, i) => (
              <span key={i} onClick={() => setIdx(i)} style={{ ...styles.dot, background: i === idx ? "#fff" : "rgba(255,255,255,0.3)", width: i === idx ? "18px" : "6px" }} />
            ))}
          </div>
        </div>

        {/* Right side cards */}
        <div style={styles.heroRight}>
          <div style={{ ...styles.sideCard, background: s.side.bg }}>
            <div style={styles.sideTag}>{s.side.label}</div>
            <div style={styles.sideName}>{s.side.name}</div>
            <div style={styles.sidePhone}>📱</div>
            <button style={styles.sideBtn} onClick={() => navigate("/browse")}>Shop Now →</button>
          </div>
          <div style={{ ...styles.sideCard, background: s.side2.bg, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={styles.sideTag}>{s.side2.label}</div>
            <div style={styles.sideName}>{s.side2.name}</div>
            <div style={styles.sidePhone}>📱</div>
            <button style={styles.sideBtn} onClick={() => navigate("/browse")}>View Deal →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  trendBar: { background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "7px 20px", display: "flex", alignItems: "center", gap: "10px" },
  trendLabel: { fontSize: "10px", fontWeight: "700", color: "#6b7280", whiteSpace: "nowrap", letterSpacing: "0.5px" },
  trendScroll: { display: "flex", gap: "6px", overflowX: "auto", scrollbarWidth: "none" },
  trendChip: { padding: "3px 11px", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "20px", fontSize: "11px", color: "#374151", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "Poppins, sans-serif", fontWeight: "500" },
  hero: { display: "grid", gridTemplateColumns: "1.3fr 0.7fr", minHeight: "260px", position: "relative", overflow: "hidden" },
  heroBg: { position: "absolute", top: "-60px", left: "-30px", width: "300px", height: "300px", background: "radial-gradient(circle,rgba(255,255,255,0.06),transparent)", borderRadius: "50%", pointerEvents: "none" },
  heroLeft: { padding: "24px 20px 20px", position: "relative", zIndex: 1 },
  heroTag: { fontSize: "10px", fontWeight: "600", color: "rgba(255,255,255,0.6)", letterSpacing: "0.5px", marginBottom: "8px" },
  heroTitle: { fontSize: "28px", fontWeight: "800", color: "#fff", lineHeight: "1.1", marginBottom: "8px" },
  heroBold: { fontStyle: "normal" },
  heroDesc: { fontSize: "11px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", marginBottom: "14px", maxWidth: "220px" },
  heroBtns: { display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" },
  heroBtn: { padding: "8px 16px", background: "#fff", color: "#0A1931", border: "none", borderRadius: "7px", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "Poppins, sans-serif" },
  heroWa: { padding: "8px 14px", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "7px", fontSize: "11px", fontWeight: "600", cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center" },
  heroStats: { display: "flex", alignItems: "center", gap: "10px" },
  heroStat: { display: "flex", flexDirection: "column" },
  heroStatNum: { fontSize: "13px", fontWeight: "800", color: "#fff" },
  heroStatLabel: { fontSize: "9px", color: "rgba(255,255,255,0.45)" },
  heroStatDiv: { width: "1px", height: "22px", background: "rgba(255,255,255,0.12)" },
  dots: { display: "flex", gap: "4px", alignItems: "center", marginTop: "12px" },
  dot: { height: "6px", borderRadius: "3px", cursor: "pointer", transition: "all 0.25s" },
  heroRight: { display: "grid", gridTemplateRows: "1fr 1fr" },
  sideCard: { padding: "14px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" },
  sideTag: { fontSize: "8px", fontWeight: "700", color: "rgba(255,255,255,0.55)", letterSpacing: "1px", textTransform: "uppercase" },
  sideName: { fontSize: "13px", fontWeight: "800", color: "#fff", lineHeight: "1.2", marginTop: "4px" },
  sidePhone: { position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", fontSize: "28px", opacity: "0.8" },
  sideBtn: { fontSize: "10px", color: "rgba(255,255,255,0.7)", background: "none", border: "none", cursor: "pointer", fontWeight: "600", fontFamily: "Poppins, sans-serif", textAlign: "left", padding: "0" },
};