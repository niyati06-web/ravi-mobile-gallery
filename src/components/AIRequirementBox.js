import React, { useState } from "react";

export default function AIRequirementBox({ phones }) {
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [listening, setListening]   = useState(false);
  const [expanded, setExpanded]     = useState(true);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR(); r.lang = "en-IN"; r.start(); setListening(true);
    r.onresult = (e) => { const t = e.results[0][0].transcript; setQuery(t); setListening(false); getSuggestions(t); };
    r.onerror = () => setListening(false);
    r.onend   = () => setListening(false);
  };

  const getSuggestions = async (q = query) => {
    if (!q.trim()) return;
    setLoading(true); setSuggestions([]);
    try {
      const res  = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/ai/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirement: q, phones }),
      });
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch { setSuggestions([]); }
    setLoading(false);
  };

  return (
    <div style={styles.box}>
      {/* Header */}
      <div style={styles.header} onClick={() => setExpanded(!expanded)}>
        <div style={styles.headerLeft}>
          <div style={styles.aiIconBox}>✨</div>
          <div>
            <div style={styles.headerTitle}>AI Phone Finder</div>
            <div style={styles.headerSub}>Describe what you need</div>
          </div>
        </div>
        <span style={{ fontSize: "12px", color: "#7c3aed" }}>{expanded ? "▲" : "▼"}</span>
      </div>

      {expanded && (
        <div style={styles.body}>
          <div style={styles.inputRow}>
            <input
              style={styles.input}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='e.g. "camera phone under 8000"'
              onKeyDown={(e) => e.key === "Enter" && getSuggestions()}
            />
            <button
              style={{ ...styles.micBtn, color: listening ? "#dc2626" : "#7c3aed" }}
              onClick={startVoice}
              aria-label="Voice"
            >🎙</button>
            <button style={styles.suggestBtn} onClick={() => getSuggestions()} disabled={loading}>
              {loading ? "..." : "Find"}
            </button>
          </div>

          {/* Quick prompts */}
          {!suggestions.length && !loading && (
            <div style={styles.quickRow}>
              {["Camera phone", "Gaming phone", "Under ₹5000", "Like new iPhone"].map((q) => (
                <button key={q} style={styles.quickChip} onClick={() => { setQuery(q); getSuggestions(q); }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div style={styles.loadingRow}>
              <div className="spinner" style={{ width: "18px", height: "18px", borderWidth: "2px" }} />
              <span style={{ fontSize: "12px", color: "#7c3aed" }}>AI is finding best matches...</span>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div style={styles.results}>
              <div style={styles.resultsLabel}>✨ AI picks for you</div>
              <div style={styles.sugCards}>
                {suggestions.map((s, i) => (
                  <div key={i} style={styles.sugCard}>
                    <div style={styles.sugRank}>#{i + 1}</div>
                    <div style={styles.sugName}>{s.name}</div>
                    <div style={styles.sugPrice}>₹{Number(s.price).toLocaleString("en-IN")}</div>
                    <div style={styles.sugWhy}>{s.reason}</div>
                  </div>
                ))}
              </div>
              <button style={styles.clearSug} onClick={() => setSuggestions([])}>Clear results</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  box: {
    margin: "12px 16px",
    background: "#fff",
    border: "1.5px solid #DDD6FE",
    borderRadius: "14px",
    overflow: "hidden",
    boxShadow: "0 2px 12px rgba(124,58,237,0.08)",
  },
  header: {
    padding: "12px 14px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    cursor: "pointer",
    background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: "10px" },
  aiIconBox: {
    width: "36px", height: "36px",
    background: "linear-gradient(135deg, #7c3aed, #2563EB)",
    borderRadius: "10px",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "18px",
    boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
  },
  headerTitle: { fontSize: "13px", fontWeight: "600", color: "#111827" },
  headerSub:   { fontSize: "11px", color: "#7c3aed" },
  body: { padding: "12px 14px", borderTop: "1px solid #EDE9FE" },
  inputRow: { display: "flex", gap: "6px", alignItems: "center" },
  input: {
    flex: 1, height: "36px", padding: "0 10px",
    border: "1.5px solid #DDD6FE", borderRadius: "8px",
    fontSize: "12px", color: "#111827", outline: "none", background: "#FAFAFA",
  },
  micBtn: { background: "none", border: "none", cursor: "pointer", fontSize: "16px", padding: "0 2px" },
  suggestBtn: {
    height: "36px", padding: "0 14px",
    background: "linear-gradient(135deg, #7c3aed, #2563EB)",
    color: "#fff", border: "none",
    borderRadius: "8px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer",
    boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
  },
  quickRow: { display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "10px" },
  quickChip: {
    fontSize: "11px", padding: "4px 10px",
    border: "1px solid #DDD6FE", borderRadius: "20px",
    background: "#F5F3FF", color: "#7c3aed",
    cursor: "pointer", fontWeight: "500",
  },
  loadingRow: {
    display: "flex", alignItems: "center", gap: "8px",
    marginTop: "10px", padding: "8px 0",
  },
  results:      { marginTop: "12px" },
  resultsLabel: { fontSize: "11px", color: "#7c3aed", fontWeight: "600", marginBottom: "8px" },
  sugCards: { display: "flex", gap: "8px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px" },
  sugCard: {
    minWidth: "140px", flexShrink: 0,
    background: "linear-gradient(135deg, #F5F3FF, #EFF6FF)",
    border: "1px solid #DDD6FE",
    borderRadius: "10px", padding: "12px",
    cursor: "pointer",
  },
  sugRank:  { fontSize: "10px", color: "#7c3aed", fontWeight: "700", marginBottom: "4px" },
  sugName:  { fontSize: "12px", fontWeight: "600", color: "#111827", marginBottom: "2px" },
  sugPrice: { fontSize: "14px", color: "#2563EB", fontWeight: "700" },
  sugWhy:   { fontSize: "10px", color: "#7c3aed", marginTop: "4px", lineHeight: "1.4" },
  clearSug: {
    marginTop: "10px", fontSize: "11px", color: "#9ca3af",
    background: "none", border: "none", cursor: "pointer",
    textDecoration: "underline",
  },
};