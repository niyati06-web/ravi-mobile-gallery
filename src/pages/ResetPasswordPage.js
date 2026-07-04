import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");
  const [showPass, setShowPass]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirm) { setError("Please fill all fields."); return; }
    if (password.length < 6)   { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm)  { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"}/api/users/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess(data.message);
      setTimeout(() => navigate("/"), 3000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.bgTop} />
      <div style={styles.bgBottom} />
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>
            <span style={{ fontSize: "30px" }}>📱</span>
          </div>
          <h1 style={styles.shopName}>Ravi Mobile Gallery</h1>
        </div>

        <h2 style={styles.title}>Set new password</h2>
        <p style={styles.desc}>Enter your new password below.</p>

        {success ? (
          <div style={styles.successMsg}>
            ✅ {success}
            <p style={{ fontSize: "11px", marginTop: "6px", color: "#16a34a" }}>
              Redirecting to login...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>New password</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.iconInput}
                />
                <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <div className="field">
              <label>Confirm password</label>
              <div style={styles.inputWrap}>
                <span style={styles.inputIcon}>🔒</span>
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={styles.iconInput}
                />
              </div>
            </div>

            {error && <p style={styles.error}>{error}</p>}

            <button className="btn-primary" type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? "Resetting..." : "Reset password →"}
            </button>

            <button
              type="button"
              style={styles.backBtn}
              onClick={() => navigate("/")}
            >
              ← Back to login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap:     { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", background:"#F0F4FF", position:"relative", overflow:"hidden" },
  bgTop:    { position:"absolute", top:"-80px", left:"-80px", width:"300px", height:"300px", background:"radial-gradient(circle, #BFDBFE 0%, transparent 70%)", borderRadius:"50%", zIndex:0 },
  bgBottom: { position:"absolute", bottom:"-80px", right:"-80px", width:"300px", height:"300px", background:"radial-gradient(circle, #DDD6FE 0%, transparent 70%)", borderRadius:"50%", zIndex:0 },
  card:     { background:"#fff", borderRadius:"20px", padding:"28px 24px", width:"100%", maxWidth:"360px", boxShadow:"0 8px 32px rgba(37,99,235,0.10)", position:"relative", zIndex:1 },
  logoWrap: { textAlign:"center", marginBottom:"20px" },
  logoBox:  { width:"64px", height:"64px", background:"linear-gradient(135deg, #2563EB, #7c3aed)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", boxShadow:"0 4px 16px rgba(37,99,235,0.3)" },
  shopName: { fontSize:"17px", fontWeight:"700", color:"#111827" },
  title:    { fontSize:"16px", fontWeight:"600", marginBottom:"6px" },
  desc:     { fontSize:"12px", color:"#6b7280", marginBottom:"16px" },
  inputWrap:  { display:"flex", alignItems:"center", border:"1px solid #D1D5DB", borderRadius:"8px", background:"#fff", overflow:"hidden" },
  inputIcon:  { padding:"0 10px", fontSize:"14px", background:"#F9FAFB", borderRight:"1px solid #E5E7EB", height:"38px", display:"flex", alignItems:"center" },
  iconInput:  { flex:1, height:"38px", border:"none", outline:"none", padding:"0 10px", fontSize:"13px", color:"#111827", background:"transparent" },
  eyeBtn:     { background:"none", border:"none", cursor:"pointer", padding:"0 10px", fontSize:"14px" },
  error:      { fontSize:"12px", color:"#dc2626", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:"8px 10px", marginBottom:"10px" },
  successMsg: { fontSize:"13px", color:"#16a34a", background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"10px", padding:"14px", textAlign:"center" },
  submitBtn:  { marginTop:"4px", background:"linear-gradient(135deg, #2563EB, #7c3aed)", border:"none", boxShadow:"0 4px 12px rgba(37,99,235,0.3)" },
  backBtn:    { display:"block", width:"100%", marginTop:"12px", background:"none", border:"none", cursor:"pointer", color:"#6b7280", fontSize:"13px", textAlign:"center" },
};