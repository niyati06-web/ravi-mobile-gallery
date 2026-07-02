import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const CONDITIONS = ["Like new", "Good", "Fair", "For parts"];

export default function AddPhone() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    name: "", brand: "", price: "", ram: "",
    storage: "", year: "", condition: "Good", stars: 0,
  });
  const [images, setImages]     = useState([]);   // File objects
  const [video, setVideo]       = useState(null);  // File object
  const [previews, setPreviews] = useState([]);    // Image preview URLs
  const [mediaTab, setMediaTab] = useState("images");
  const [listening, setListening] = useState(null); // which field is listening
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  // Voice input for a field
  const voiceInput = (fieldKey) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported on this browser."); return; }

    const r = new SR();
    r.lang = "en-IN";
    r.start();
    setListening(fieldKey);

    r.onresult = (e) => {
      set(fieldKey, e.results[0][0].transcript);
      setListening(null);
    };
    r.onerror = () => setListening(null);
    r.onend   = () => setListening(null);
  };

  // AI price suggestion
  const suggestPrice = async () => {
    if (!form.name) { alert("Enter phone name first."); return; }
    try {
      const res = await fetch("/api/ai/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, condition: form.condition }),
      });
      const data = await res.json();
      set("price", data.price || "");
    } catch {
      alert("Could not get AI price suggestion.");
    }
  };

  // Image upload — max 5
  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 5);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (i) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  // Video upload — max 1
  const handleVideo = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 50 * 1024 * 1024) {
      alert("Video must be under 50MB.");
      return;
    }
    setVideo(file || null);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.brand) {
      setError("Name, brand and price are required.");
      return;
    }

    setSubmitting(true);
    setError("");

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    images.forEach((img) => fd.append("images", img));
    if (video) fd.append("video", video);

    try {
      const res = await fetch("/api/phones", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");

      setSuccess(true);
      setForm({ name:"", brand:"", price:"", ram:"", storage:"", year:"", condition:"Good", stars:0 });
      setImages([]); setPreviews([]); setVideo(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to add listing. Please try again.");
    }

    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          New listing
          <span style={styles.aiBadge}>Voice + AI</span>
        </h3>

        {success && (
          <div style={styles.successMsg}>✅ Phone listed successfully!</div>
        )}
        {error && <div style={styles.errorMsg}>{error}</div>}

        {/* Phone name */}
        <div className="field">
          <label>Phone name</label>
          <VoiceField
            value={form.name}
            onChange={(v) => set("name", v)}
            onVoice={() => voiceInput("name")}
            listening={listening === "name"}
            placeholder="e.g. Samsung Galaxy A53"
          />
        </div>

        {/* Brand */}
        <div className="field">
          <label>Brand</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            placeholder="Samsung / Apple / Redmi..."
          />
        </div>

        {/* Price + AI suggestion */}
        <div className="row2">
          <div className="field">
            <label>Price (₹)</label>
            <VoiceField
              value={form.price}
              onChange={(v) => set("price", v)}
              onVoice={() => voiceInput("price")}
              listening={listening === "price"}
              placeholder="8500"
              type="number"
            />
          </div>
          <div className="field">
            <label>AI price suggestion</label>
            <button
              type="button"
              style={styles.aiPriceBtn}
              onClick={suggestPrice}
            >
              ✨ Suggest price
            </button>
          </div>
        </div>

        {/* RAM + Storage */}
        <div className="row2">
          <div className="field">
            <label>RAM</label>
            <input
              type="text"
              value={form.ram}
              onChange={(e) => set("ram", e.target.value)}
              placeholder="6GB"
            />
          </div>
          <div className="field">
            <label>Storage</label>
            <input
              type="text"
              value={form.storage}
              onChange={(e) => set("storage", e.target.value)}
              placeholder="128GB"
            />
          </div>
        </div>

        {/* Year + Condition */}
        <div className="row2">
          <div className="field">
            <label>Year</label>
            <input
              type="number"
              value={form.year}
              onChange={(e) => set("year", e.target.value)}
              placeholder="2022"
            />
          </div>
          <div className="field">
            <label>Condition</label>
            <select
              value={form.condition}
              onChange={(e) => set("condition", e.target.value)}
            >
              {CONDITIONS.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Star grade */}
        <div className="field">
          <label>Star grade</label>
          <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onClick={() => set("stars", n)}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  color: form.stars >= n ? "var(--amber)" : "var(--border2)",
                  transition: "color 0.1s",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Media upload */}
        <div className="field">
          <label>Photos & video</label>
          <div style={styles.mediaUpload}>
            {/* Tabs */}
            <div style={styles.mediaTabs}>
              <button
                type="button"
                style={{
                  ...styles.mediaTab,
                  ...(mediaTab === "images" ? styles.mediaTabOn : {}),
                }}
                onClick={() => setMediaTab("images")}
              >
                📷 Photos
              </button>
              <button
                type="button"
                style={{
                  ...styles.mediaTab,
                  ...(mediaTab === "video" ? styles.mediaTabOn : {}),
                }}
                onClick={() => setMediaTab("video")}
              >
                🎥 Video
              </button>
            </div>

            {/* Images */}
            {mediaTab === "images" && (
              <div style={styles.mediaZone}>
                <label htmlFor="img-upload" style={{ cursor: "pointer" }}>
                  <div style={styles.uploadPlaceholder}>
                    <span style={{ fontSize: "26px" }}>📸</span>
                    <p style={{ fontSize: "12px", color: "var(--text3)", marginTop: "5px" }}>
                      Tap to upload phone photos
                    </p>
                    <p style={{ fontSize: "10px", color: "var(--text3)" }}>
                      JPG, PNG · Max 5 photos · 5MB each
                    </p>
                  </div>
                </label>
                <input
                  id="img-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImages}
                />

                {/* Preview strip */}
                {previews.length > 0 && (
                  <div style={styles.previewStrip}>
                    {previews.map((url, i) => (
                      <div key={i} style={styles.previewItem}>
                        <img
                          src={url}
                          alt={`preview-${i}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }}
                        />
                        <button
                          type="button"
                          style={styles.removeBtn}
                          onClick={() => removeImage(i)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Video */}
            {mediaTab === "video" && (
              <div style={styles.mediaZone}>
                <label htmlFor="vid-upload" style={{ cursor: "pointer" }}>
                  <div style={styles.uploadPlaceholder}>
                    <span style={{ fontSize: "26px" }}>🎥</span>
                    <p style={{ fontSize: "12px", color: "var(--text3)", marginTop: "5px" }}>
                      Tap to upload a demo video
                    </p>
                    <p style={{ fontSize: "10px", color: "var(--text3)" }}>
                      MP4 only · Max 1 video · 50MB
                    </p>
                  </div>
                </label>
                <input
                  id="vid-upload"
                  type="file"
                  accept="video/mp4"
                  style={{ display: "none" }}
                  onChange={handleVideo}
                />

                {video && (
                  <div style={styles.videoPreview}>
                    <span style={{ fontSize: "18px" }}>▶</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: "500" }}>{video.name}</div>
                      <div style={{ fontSize: "10px", color: "var(--text3)" }}>
                        {(video.size / 1024 / 1024).toFixed(1)} MB
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideo(null)}
                      style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--red)", fontSize: "16px" }}
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <button
          className="btn-primary"
          type="submit"
          disabled={submitting}
          style={{ marginTop: "4px" }}
        >
          {submitting ? "Adding..." : "➕ Add listing"}
        </button>
      </div>
    </form>
  );
}

// Reusable voice input field
function VoiceField({ value, onChange, onVoice, listening, placeholder, type = "text" }) {
  return (
    <div style={{ display: "flex", gap: "6px" }}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1 }}
      />
      <button
        type="button"
        onClick={onVoice}
        style={{
          width: "36px", height: "36px",
          border: `1px solid ${listening ? "var(--red-border)" : "var(--border)"}`,
          borderRadius: "var(--radius)",
          background: listening ? "var(--red-light)" : "#fff",
          cursor: "pointer",
          fontSize: "14px",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
        aria-label="Voice input"
      >
        🎙
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "16px",
  },
  cardTitle: {
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  aiBadge: {
    fontSize: "10px",
    background: "var(--purple-light)",
    color: "var(--purple)",
    padding: "2px 8px",
    borderRadius: "20px",
  },
  aiPriceBtn: {
    width: "100%", height: "36px",
    border: "1px solid var(--purple-border)",
    borderRadius: "var(--radius)",
    background: "var(--purple-light)",
    color: "var(--purple)",
    fontSize: "12px",
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
  },
  successMsg: {
    fontSize: "13px", color: "var(--green)",
    background: "var(--green-light)",
    border: "1px solid var(--green-border)",
    borderRadius: "var(--radius)",
    padding: "8px 12px",
    marginBottom: "12px",
  },
  errorMsg: {
    fontSize: "13px", color: "var(--red)",
    background: "var(--red-light)",
    border: "1px solid var(--red-border)",
    borderRadius: "var(--radius)",
    padding: "8px 12px",
    marginBottom: "12px",
  },
  mediaUpload: {
    border: "1px dashed var(--border2)",
    borderRadius: "var(--radius)",
    overflow: "hidden",
    background: "var(--bg)",
  },
  mediaTabs: {
    display: "flex",
    borderBottom: "1px solid var(--border)",
  },
  mediaTab: {
    flex: 1, padding: "8px",
    fontSize: "12px",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: "var(--text3)",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
  },
  mediaTabOn: {
    background: "#fff",
    color: "var(--brand)",
    fontWeight: "500",
  },
  mediaZone: { padding: "14px" },
  uploadPlaceholder: { textAlign: "center" },
  previewStrip: {
    display: "flex", gap: "8px",
    flexWrap: "wrap",
    marginTop: "10px",
  },
  previewItem: {
    position: "relative",
    width: "60px", height: "60px",
    borderRadius: "6px",
    border: "1px solid var(--border)",
    overflow: "visible",
  },
  removeBtn: {
    position: "absolute",
    top: "-8px", right: "-8px",
    width: "18px", height: "18px",
    background: "var(--red)",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    fontSize: "11px",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  videoPreview: {
    marginTop: "10px",
    background: "#fff",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius)",
    padding: "10px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "20px",
  },
};