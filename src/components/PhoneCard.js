import React, { useState } from "react";

const CONDITION_STYLE = {
  "Like new": { bg: "#EAF1F8", color: "#1A3D63" },
  "Good":     { bg: "#F0FDF4", color: "#16a34a" },
  "Fair":     { bg: "#FFFBEB", color: "#d97706" },
  "For parts":{ bg: "#FEF2F2", color: "#dc2626" },
};

function Stars({ count }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: "12px", letterSpacing: "-1px" }}>
      {"★".repeat(count)}
      <span style={{ color: "#E5E7EB" }}>{"★".repeat(5 - count)}</span>
    </span>
  );
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const t = new Date();
  return d.getDate() === t.getDate() && d.getMonth() === t.getMonth() && d.getFullYear() === t.getFullYear();
}

export default function PhoneCard({ phone }) {
  const [imgIdx, setImgIdx]     = useState(0);
  const [gallery, setGallery]   = useState(false);
  const [galIdx, setGalIdx]     = useState(0);

  const hasImages = phone.images?.length > 0;
  const hasVideo  = phone.video?.url;
  const cond      = CONDITION_STYLE[phone.condition] || {};
  const isNew     = isToday(phone.createdAt);
  const allMedia  = [...(phone.images || []), ...(hasVideo ? [phone.video.url] : [])];

  const waUrl = `https://wa.me/${phone.whatsapp || "919999999999"}?text=Hi! I'm interested in ${phone.name} (₹${phone.price}) listed on Ravi Mobile Gallery.`;

  return (
    <>
      {/* ── GALLERY MODAL ── */}
      {gallery && (
        <div style={styles.modalOverlay} onClick={() => setGallery(false)}>
          <div style={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button style={styles.closeBtn} onClick={() => setGallery(false)}>✕</button>

            {/* Media */}
            <div style={styles.galMedia}>
              {allMedia[galIdx]?.endsWith(".mp4") || allMedia[galIdx] === phone.video?.url ? (
                <video
                  src={allMedia[galIdx]}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }}
                />
              ) : hasImages ? (
                <img
                  src={allMedia[galIdx]}
                  alt={phone.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "10px" }}
                />
              ) : (
                <div style={{ fontSize: "80px", textAlign: "center" }}>📱</div>
              )}
            </div>

            {/* Info */}
            <div style={styles.galInfo}>
              <div style={styles.galName}>{phone.name}</div>
              <div style={styles.galPrice}>₹{Number(phone.price).toLocaleString("en-IN")}</div>
            </div>

            {/* Dot nav */}
            {allMedia.length > 1 && (
              <div style={styles.galDots}>
                {allMedia.map((_, i) => (
                  <span
                    key={i}
                    onClick={() => setGalIdx(i)}
                    style={{
                      ...styles.galDot,
                      background: i === galIdx ? "#fff" : "rgba(255,255,255,0.35)",
                      width: i === galIdx ? "20px" : "7px",
                    }}
                  />
                ))}
              </div>
            )}

            {/* Prev / Next */}
            {allMedia.length > 1 && (
              <>
                <button
                  style={{ ...styles.navArrow, left: "10px" }}
                  onClick={() => setGalIdx((galIdx - 1 + allMedia.length) % allMedia.length)}
                >‹</button>
                <button
                  style={{ ...styles.navArrow, right: "10px" }}
                  onClick={() => setGalIdx((galIdx + 1) % allMedia.length)}
                >›</button>
              </>
            )}

            {/* WhatsApp in gallery */}
            <a href={waUrl} target="_blank" rel="noreferrer" style={styles.galWa}>
              💬 Contact on WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* ── CARD ── */}
      <div style={styles.card} onClick={() => { setGallery(true); setGalIdx(0); }}>
        <div style={styles.media}>
          {hasImages ? (
            <img src={phone.images[imgIdx]} alt={phone.name} style={styles.img} loading="lazy" />
          ) : (
            <div style={styles.placeholder}>📱</div>
          )}

          <div style={styles.badges}>
            {isNew && <span style={styles.newBadge}>🆕 New</span>}
            {phone.sold && <span style={styles.soldBadge}>SOLD</span>}
          </div>
          {hasVideo && <span style={styles.videoBadge}>▶ Video</span>}

          {hasImages && phone.images.length > 1 && (
            <div style={styles.dots}>
              {phone.images.map((_, i) => (
                <span
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i); }}
                  style={{ ...styles.dot, background: i === imgIdx ? "#1A3D63" : "rgba(255,255,255,0.6)" }}
                />
              ))}
            </div>
          )}

          {/* View gallery hint */}
          <div style={styles.viewHint}>👆 Tap to view</div>
        </div>

        <div style={styles.body}>
          <div style={styles.name}>{phone.name}</div>
          <div style={styles.spec}>
            {[phone.ram, phone.storage, phone.year].filter(Boolean).join(" · ")}
          </div>
          <div style={styles.priceRow}>
            <span style={styles.price}>₹{Number(phone.price).toLocaleString("en-IN")}</span>
            <span style={{ ...styles.condBadge, background: cond.bg, color: cond.color }}>
              {phone.condition}
            </span>
          </div>
          <div style={styles.starsRow}>
            <Stars count={phone.stars || 0} />
            <span style={styles.starsCount}>{phone.stars}/5</span>
          </div>
          <a href={waUrl} target="_blank" rel="noreferrer" style={styles.waBtn} onClick={(e) => e.stopPropagation()}>
            <span>💬</span> WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}

const styles = {
  /* Modal */
  modalOverlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.88)",
    zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px",
  },
  modalBox: {
    background: "#111",
    borderRadius: "16px",
    width: "100%", maxWidth: "420px",
    padding: "16px",
    position: "relative",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  closeBtn: {
    position: "absolute", top: "10px", right: "10px",
    width: "30px", height: "30px",
    background: "rgba(255,255,255,0.15)",
    border: "none", borderRadius: "50%",
    color: "#fff", fontSize: "14px", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2,
  },
  galMedia: {
    height: "260px", borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "#1a1a1a", overflow: "hidden",
  },
  galInfo: { textAlign: "center" },
  galName:  { fontSize: "15px", fontWeight: "600", color: "#fff" },
  galPrice: { fontSize: "18px", fontWeight: "700", color: "#4ade80", marginTop: "2px" },
  galDots: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
  },
  galDot: {
    height: "7px", borderRadius: "4px",
    cursor: "pointer", transition: "all 0.2s",
  },
  navArrow: {
    position: "absolute", top: "50%", transform: "translateY(-50%)",
    width: "32px", height: "32px",
    background: "rgba(255,255,255,0.15)", border: "none",
    borderRadius: "50%", color: "#fff", fontSize: "20px",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 2,
  },
  galWa: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
    padding: "10px", background: "#16a34a",
    color: "#fff", borderRadius: "10px",
    fontSize: "13px", fontWeight: "600", textDecoration: "none",
  },

  /* Card */
  card: {
    background: "#fff", border: "1px solid #E5E7EB",
    borderRadius: "14px", overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s",
  },
  media: {
    position: "relative", height: "120px",
    background: "#F9FAFB", borderBottom: "1px solid #E5E7EB",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  img:         { width: "100%", height: "100%", objectFit: "cover" },
  placeholder: { fontSize: "42px" },
  badges: {
    position: "absolute", top: "6px", left: "6px",
    display: "flex", flexDirection: "column", gap: "3px",
  },
  newBadge: {
    fontSize: "9px", fontWeight: "700",
    background: "linear-gradient(135deg, #1A3D63, #0A1931)",
    color: "#fff", padding: "2px 7px", borderRadius: "20px",
  },
  soldBadge: {
    fontSize: "9px", fontWeight: "700",
    background: "#dc2626", color: "#fff",
    padding: "2px 7px", borderRadius: "20px",
  },
  videoBadge: {
    position: "absolute", top: "6px", right: "6px",
    fontSize: "9px", fontWeight: "600",
    background: "rgba(0,0,0,0.55)", color: "#fff",
    padding: "2px 7px", borderRadius: "20px",
  },
  viewHint: {
    position: "absolute", bottom: "6px", right: "6px",
    fontSize: "9px", color: "rgba(255,255,255,0.85)",
    background: "rgba(0,0,0,0.45)",
    padding: "2px 7px", borderRadius: "20px",
  },
  dots: {
    position: "absolute", bottom: "5px", left: "50%",
    transform: "translateX(-50%)", display: "flex", gap: "4px",
  },
  dot: { width: "5px", height: "5px", borderRadius: "50%", cursor: "pointer" },
  body:      { padding: "10px 12px" },
  name:      { fontSize: "13px", fontWeight: "600", color: "#111827", marginBottom: "2px" },
  spec:      { fontSize: "11px", color: "#9ca3af", marginBottom: "6px" },
  priceRow:  { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" },
  price:     { fontSize: "16px", fontWeight: "700", color: "#16a34a" },
  condBadge: { fontSize: "10px", fontWeight: "600", padding: "2px 8px", borderRadius: "20px" },
  starsRow:  { display: "flex", alignItems: "center", gap: "5px", marginBottom: "8px" },
  starsCount:{ fontSize: "10px", color: "#9ca3af" },
  waBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
    width: "100%", padding: "7px",
    background: "linear-gradient(135deg, #16a34a, #15803d)",
    color: "#fff", borderRadius: "8px",
    fontSize: "12px", fontWeight: "600", textDecoration: "none",
    boxShadow: "0 2px 6px rgba(22,163,74,0.25)",
  },
};