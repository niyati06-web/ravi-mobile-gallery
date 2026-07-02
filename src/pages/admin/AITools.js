import React, { useState } from "react";

export default function AITools() {
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("Good");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPrice = async () => {
    if (!model.trim()) { alert("Enter a phone model first."); return; }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/ai/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: model, condition }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ error: "Could not fetch price. Try again." });
    }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

      {/* Price Advisor */}
      <div style={styles.tool}>
        <div style={styles.toolTitle}>
          <span style={{ color: "var(--purple)" }}>✨</span> Price advisor
        </div>
        <div style={styles.toolDesc}>
          Enter a phone model and condition — AI gives you a fair resale price range.
        </div>
        <div className="row2">
          <div className="field">
            <label>Phone model</label>
            <input
              type="text"
              placeholder="e.g. Redmi Note 12"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Condition</label>
            <select value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option>Like new</option>
              <option>Good</option>
              <option>Fair</option>
              <option>For parts</option>
            </select>
          </div>
        </div>
        <button className="btn-primary" onClick={checkPrice} disabled={loading}>
          {loading ? "Checking..." : "✨ Check price"}
        </button>

        {result && !result.error && (
          <div style={styles.priceResult}>
            <div style={styles.priceRange}>
              ₹{Number(result.min).toLocaleString("en-IN")} – ₹{Number(result.max).toLocaleString("en-IN")}
            </div>
            <div style={styles.priceSuggest}>
              Suggested listing price: <strong>₹{Number(result.price).toLocaleString("en-IN")}</strong>
            </div>
            {result.note && <div style={styles.priceNote}>{result.note}</div>}
          </div>
        )}
        {result?.error && <div style={styles.errorMsg}>{result.error}</div>}
      </div>

      {/* Customer Chatbot */}
      <div style={styles.tool}>
        <div style={styles.toolTitle}>
          <span style={{ color: "var(--brand)" }}>🤖</span> Customer chatbot
        </div>
        <div style={styles.toolDesc}>
          Automatically answers customer questions on the browse page — "Is this phone available?", "What is the condition?", etc.
        </div>
        <div style={styles.statusOn}>
          <span>✅ Active on browse page</span>
        </div>
      </div>

      {/* AI Suggester status */}
      <div style={styles.tool}>
        <div style={styles.toolTitle}>
          <span style={{ color: "var(--amber)" }}>🔍</span> AI phone suggester
        </div>
        <div style={styles.toolDesc}>
          Customers describe what they need — AI picks best matching phones from your stock automatically.
        </div>
        <div style={styles.statusOn}>
          <span>✅ Active on browse page</span>
        </div>
      </div>

    </div>
  );
}

const styles = {
  tool: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "14px",
  },
  toolTitle: {
    fontSize: "13px",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  toolDesc: {
    fontSize: "11px",
    color: "var(--text3)",
    marginBottom: "12px",
    lineHeight: "1.5",
  },
  statusOn: {
    background: "var(--green-light)",
    border: "1px solid var(--green-border)",
    borderRadius: "var(--radius)",
    padding: "8px 12px",
    fontSize: "12px",
    color: "var(--green)",
    fontWeight: "500",
  },
  priceResult: {
    marginTop: "12px",
    background: "var(--brand-light)",
    border: "1px solid var(--brand-border)",
    borderRadius: "var(--radius)",
    padding: "12px",
  },
  priceRange: {
    fontSize: "18px",
    fontWeight: "600",
    color: "var(--brand)",
    marginBottom: "4px",
  },
  priceSuggest: { fontSize: "12px", color: "var(--text2)" },
  priceNote:   { fontSize: "11px", color: "var(--text3)", marginTop: "4px" },
  errorMsg: {
    marginTop: "10px",
    fontSize: "12px",
    color: "var(--red)",
    background: "var(--red-light)",
    border: "1px solid var(--red-border)",
    borderRadius: "var(--radius)",
    padding: "8px 10px",
  },
};