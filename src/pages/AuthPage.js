import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const { loginUser, signup, loginGoogle, user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab]           = useState("login");
  const [form, setForm]         = useState({ name: "", email: "", password: "" });
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  useEffect(() => { if (user) navigate("/browse"); }, [user, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true; script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      if (window.google && process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleGoogle,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-btn"),
          { theme: "outline", size: "large", width: "100%", text: "continue_with" }
        );
      }
    };
    return () => document.body.removeChild(script);
  }, []);

  const handleGoogle = async (response) => {
    setError(""); setLoading(true);
    const result = await loginGoogle(response.credential);
    setLoading(false);
    if (result.success) navigate("/browse");
    else setError(result.message);
  };

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
    if (!form.email || !form.password) { setError("Please fill all fields."); return; }
    if (tab === "signup" && !form.name) { setError("Please enter your name."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const result = tab === "login"
      ? await loginUser(form.email, form.password)
      : await signup(form.name, form.email, form.password);
    setLoading(false);
    if (result.success) navigate("/browse");
    else setError(result.message);
  };

  const handleForgot = (e) => {
    e.preventDefault();
    if (!forgotEmail) { setError("Enter your email."); return; }
    setSuccess("Password reset link sent! Check your email.");
    setForgotEmail("");
    setTimeout(() => { setSuccess(""); setForgotMode(false); }, 3000);
  };

  return (
    <div style={styles.wrap}>
      <div style={styles.bgTop} />
      <div style={styles.bgBottom} />
      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logoWrap}>
          <div style={styles.logoBox}>
            <span style={styles.logoEmoji}>R</span>
          </div>
          <h1 style={styles.shopName}>Ravi Mobile Gallery</h1>
          <div style={styles.tagRow}>
            <span style={styles.tag}>2nd Hand Phones</span>
            <span style={styles.dot}>·</span>
            <span style={styles.tag}>Best Deals</span>
          </div>
        </div>

        {forgotMode ? (
          <div>
            <button style={styles.backBtn} onClick={() => { setForgotMode(false); setError(""); setSuccess(""); }}>
              ← Back to login
            </button>
            <h2 style={styles.forgotTitle}>Reset password</h2>
            <p style={styles.forgotDesc}>Enter your email — we will send a reset link.</p>
            <form onSubmit={handleForgot}>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              {error   && <p style={styles.error}>{error}</p>}
              {success && <p style={styles.successMsg}>{success}</p>}
              <button className="btn-primary" type="submit" style={styles.submitBtn}>Send reset link</button>
            </form>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div style={styles.tabs}>
              <button style={{ ...styles.tabBtn, ...(tab === "login"  ? styles.tabOn : {}) }} onClick={() => { setTab("login");  setError(""); }}>Login</button>
              <button style={{ ...styles.tabBtn, ...(tab === "signup" ? styles.tabOn : {}) }} onClick={() => { setTab("signup"); setError(""); }}>Sign up</button>
            </div>

            <form onSubmit={handleSubmit}>
              {tab === "signup" && (
                <div className="field">
                  <label>Full name</label>
                  <div style={styles.inputWrap}>
                    <span style={styles.inputIcon}>👤</span>
                    <input type="text" placeholder="Enter your name" value={form.name} onChange={(e) => set("name", e.target.value)} style={styles.iconInput} />
                  </div>
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>✉️</span>
                  <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => set("email", e.target.value)} style={styles.iconInput} />
                </div>
              </div>
              <div className="field">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                  <label style={{ margin:0, fontSize:"11px", color:"var(--text2)" }}>Password</label>
                  {tab === "login" && (
                    <button type="button" style={styles.forgotBtn} onClick={() => { setForgotMode(true); setError(""); }}>
                      Forgot password?
                    </button>
                  )}
                </div>
                <div style={styles.inputWrap}>
                  <span style={styles.inputIcon}>🔒</span>
                  <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={(e) => set("password", e.target.value)} style={styles.iconInput} />
                  <button type="button" style={styles.eyeBtn} onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                </div>
              </div>

              {error && <p style={styles.error}>{error}</p>}

              <button className="btn-primary" type="submit" disabled={loading} style={styles.submitBtn}>
                {loading ? "Please wait..." : tab === "login" ? "Login →" : "Create account →"}
              </button>
            </form>

            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>or continue with</span>
              <span style={styles.dividerLine} />
            </div>

            <div id="google-btn" style={{ width: "100%" }} />
            <p style={styles.note}>🔒 Your data is safe and secure</p>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrap: { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", background:"#F0F4FF", position:"relative", overflow:"hidden" },
  bgTop:    { position:"absolute", top:"-80px", left:"-80px", width:"300px", height:"300px", background:"radial-gradient(circle, #BFDBFE 0%, transparent 70%)", borderRadius:"50%", zIndex:0 },
  bgBottom: { position:"absolute", bottom:"-80px", right:"-80px", width:"300px", height:"300px", background:"radial-gradient(circle, #DDD6FE 0%, transparent 70%)", borderRadius:"50%", zIndex:0 },
  card: { background:"#fff", borderRadius:"20px", padding:"28px 24px", width:"100%", maxWidth:"360px", boxShadow:"0 8px 32px rgba(37,99,235,0.10)", position:"relative", zIndex:1 },
  logoWrap: { textAlign:"center", marginBottom:"22px" },
  logoBox:  { width:"64px", height:"64px", background:"linear-gradient(135deg, #1A3D63, #0A1931)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", boxShadow:"0 4px 16px rgba(10,25,49,0.25)" },
  logoEmoji: { fontSize:"26px", fontWeight:"700", color:"#fff" },
  shopName: { fontSize:"17px", fontWeight:"700", color:"#111827", marginBottom:"4px" },
  tagRow:   { display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" },
  tag:  { fontSize:"11px", color:"#6b7280" },
  dot:  { fontSize:"11px", color:"#d1d5db" },
  tabs: { display:"flex", border:"1px solid #E5E7EB", borderRadius:"10px", padding:"3px", marginBottom:"16px", background:"#F9FAFB" },
  tabBtn: { flex:1, padding:"8px", border:"none", borderRadius:"8px", fontSize:"13px", cursor:"pointer", background:"none", color:"#6b7280", fontWeight:"400", transition:"all 0.12s" },
  tabOn:  { background:"#fff", color:"#111827", fontWeight:"600", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" },
  inputWrap: { display:"flex", alignItems:"center", border:"1px solid #D1D5DB", borderRadius:"8px", background:"#fff", overflow:"hidden" },
  inputIcon: { padding:"0 10px", fontSize:"14px", background:"#F9FAFB", borderRight:"1px solid #E5E7EB", height:"38px", display:"flex", alignItems:"center" },
  iconInput: { flex:1, height:"38px", border:"none", outline:"none", padding:"0 10px", fontSize:"13px", color:"#111827", background:"transparent" },
  eyeBtn:    { background:"none", border:"none", cursor:"pointer", padding:"0 10px", fontSize:"14px" },
  forgotBtn: { background:"none", border:"none", cursor:"pointer", fontSize:"11px", color:"#2563EB", fontWeight:"500", padding:0 },
  error:      { fontSize:"12px", color:"#dc2626", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:"8px 10px", marginBottom:"10px" },
  successMsg: { fontSize:"12px", color:"#16a34a", background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"8px", padding:"8px 10px", marginBottom:"10px" },
  submitBtn:  { marginTop:"4px", background:"linear-gradient(135deg, #1A3D63, #0A1931)", border:"none", boxShadow:"0 4px 12px rgba(10,25,49,0.25)" },
  divider:     { display:"flex", alignItems:"center", gap:"10px", margin:"16px 0" },
  dividerLine: { flex:1, height:"1px", background:"#E5E7EB" },
  dividerText: { fontSize:"11px", color:"#9ca3af", whiteSpace:"nowrap" },
  note:        { textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"14px" },
  backBtn:     { background:"none", border:"none", cursor:"pointer", color:"#2563EB", fontSize:"13px", fontWeight:"500", padding:0, marginBottom:"14px", display:"block" },
  forgotTitle: { fontSize:"16px", fontWeight:"600", marginBottom:"6px" },
  forgotDesc:  { fontSize:"12px", color:"#6b7280", marginBottom:"16px" },
};