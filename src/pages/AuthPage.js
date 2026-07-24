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
    script.async = true;
    script.defer = true;
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
    return () => { if (document.body.contains(script)) document.body.removeChild(script); };
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
    e.preventDefault();
    setError("");
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

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail) { setError("Enter your email."); return; }
    setLoading(true);
    try {
      const API = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${API}/api/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSuccess("Password reset link sent! Check your email.");
      setForgotEmail("");
      setTimeout(() => { setSuccess(""); setForgotMode(false); }, 3000);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div style={S.wrap}>
      <div style={S.bgTop} />
      <div style={S.bgBottom} />
      <div style={S.card}>
        <div style={S.logoWrap}>
          <div style={S.logoBox}><span style={S.logoR}>R</span></div>
          <h1 style={S.shopName}>Ravi Mobile Gallery</h1>
          <div style={S.tagRow}>
            <span style={S.tag}>2nd Hand Phones</span>
            <span style={S.dot}>·</span>
            <span style={S.tag}>Best Deals</span>
          </div>
        </div>

        {forgotMode ? (
          <div>
            <button style={S.backBtn} onClick={() => { setForgotMode(false); setError(""); setSuccess(""); }}>← Back to login</button>
            <h2 style={S.forgotTitle}>Reset password</h2>
            <p style={S.forgotDesc}>Enter your email — we will send a reset link.</p>
            <form onSubmit={handleForgot}>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
              </div>
              {error   && <p style={S.error}>{error}</p>}
              {success && <p style={S.successMsg}>{success}</p>}
              <button className="btn-primary" type="submit" disabled={loading} style={S.submitBtn}>
                {loading ? "Sending..." : "Send reset link"}
              </button>
            </form>
          </div>
        ) : (
          <>
            <div style={S.tabs}>
              <button style={{ ...S.tabBtn, ...(tab === "login"  ? S.tabOn : {}) }} onClick={() => { setTab("login");  setError(""); }}>Login</button>
              <button style={{ ...S.tabBtn, ...(tab === "signup" ? S.tabOn : {}) }} onClick={() => { setTab("signup"); setError(""); }}>Sign up</button>
            </div>

            <form onSubmit={handleSubmit}>
              {tab === "signup" && (
                <div className="field">
                  <label>Full name</label>
                  <div style={S.inputWrap}>
                    <span style={S.inputIcon}>👤</span>
                    <input type="text" placeholder="Enter your name" value={form.name} onChange={(e) => set("name", e.target.value)} style={S.iconInput} />
                  </div>
                </div>
              )}
              <div className="field">
                <label>Email</label>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}>✉️</span>
                  <input type="email" placeholder="Enter your email" value={form.email} onChange={(e) => set("email", e.target.value)} style={S.iconInput} />
                </div>
              </div>
              <div className="field">
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"4px" }}>
                  <label style={{ margin:0, fontSize:"11px", color:"var(--text2)", fontFamily:"Poppins,sans-serif" }}>Password</label>
                  {tab === "login" && (
                    <button type="button" style={S.forgotBtn} onClick={() => { setForgotMode(true); setError(""); }}>Forgot password?</button>
                  )}
                </div>
                <div style={S.inputWrap}>
                  <span style={S.inputIcon}>🔒</span>
                  <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={form.password} onChange={(e) => set("password", e.target.value)} style={S.iconInput} />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowPass(!showPass)}>{showPass ? "🙈" : "👁"}</button>
                </div>
              </div>

              {error && <p style={S.error}>{error}</p>}

              <button className="btn-primary" type="submit" disabled={loading} style={S.submitBtn}>
                {loading ? "Please wait..." : tab === "login" ? "Login →" : "Create account →"}
              </button>
            </form>

            <div style={S.divider}>
              <span style={S.dividerLine} />
              <span style={S.dividerText}>or continue with</span>
              <span style={S.dividerLine} />
            </div>

            <div id="google-btn" style={{ width:"100%" }} />
            <p style={S.note}>🔒 Your data is safe and secure</p>
          </>
        )}
      </div>
    </div>
  );
}

const S = {
  wrap:     { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", padding:"24px", background:"#F0F4FF", position:"relative", overflow:"hidden" },
  bgTop:    { position:"absolute", top:"-80px", left:"-80px", width:"300px", height:"300px", background:"radial-gradient(circle,#B3CFE5 0%,transparent 70%)", borderRadius:"50%", zIndex:0 },
  bgBottom: { position:"absolute", bottom:"-80px", right:"-80px", width:"300px", height:"300px", background:"radial-gradient(circle,#B3CFE5 0%,transparent 70%)", borderRadius:"50%", zIndex:0 },
  card:     { background:"#fff", borderRadius:"20px", padding:"28px 24px", width:"100%", maxWidth:"360px", boxShadow:"0 8px 32px rgba(10,25,49,0.10)", position:"relative", zIndex:1 },
  logoWrap: { textAlign:"center", marginBottom:"22px" },
  logoBox:  { width:"64px", height:"64px", background:"linear-gradient(135deg,#1A3D63,#0A1931)", borderRadius:"18px", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 10px", boxShadow:"0 4px 16px rgba(10,25,49,0.25)" },
  logoR:    { fontSize:"28px", fontWeight:"900", color:"#fff", fontFamily:"Poppins,sans-serif" },
  shopName: { fontSize:"17px", fontWeight:"700", color:"#111827", marginBottom:"4px", fontFamily:"Poppins,sans-serif" },
  tagRow:   { display:"flex", alignItems:"center", justifyContent:"center", gap:"6px" },
  tag:      { fontSize:"11px", color:"#6b7280", fontFamily:"Poppins,sans-serif" },
  dot:      { fontSize:"11px", color:"#d1d5db" },
  tabs:     { display:"flex", border:"1px solid #E5E7EB", borderRadius:"10px", padding:"3px", marginBottom:"16px", background:"#F9FAFB" },
  tabBtn:   { flex:1, padding:"8px", border:"none", borderRadius:"8px", fontSize:"13px", cursor:"pointer", background:"none", color:"#6b7280", fontWeight:"400", fontFamily:"Poppins,sans-serif" },
  tabOn:    { background:"#fff", color:"#111827", fontWeight:"600", boxShadow:"0 1px 4px rgba(0,0,0,0.08)" },
  inputWrap:{ display:"flex", alignItems:"center", border:"1px solid #D1D5DB", borderRadius:"8px", background:"#fff", overflow:"hidden" },
  inputIcon:{ padding:"0 10px", fontSize:"14px", background:"#F9FAFB", borderRight:"1px solid #E5E7EB", height:"38px", display:"flex", alignItems:"center" },
  iconInput:{ flex:1, height:"38px", border:"none", outline:"none", padding:"0 10px", fontSize:"13px", color:"#111827", background:"transparent", fontFamily:"Poppins,sans-serif" },
  eyeBtn:   { background:"none", border:"none", cursor:"pointer", padding:"0 10px", fontSize:"14px" },
  forgotBtn:{ background:"none", border:"none", cursor:"pointer", fontSize:"11px", color:"#2563EB", fontWeight:"500", padding:0, fontFamily:"Poppins,sans-serif" },
  error:    { fontSize:"12px", color:"#dc2626", background:"#FEF2F2", border:"1px solid #FECACA", borderRadius:"8px", padding:"8px 10px", marginBottom:"10px", fontFamily:"Poppins,sans-serif" },
  successMsg:{ fontSize:"12px", color:"#16a34a", background:"#F0FDF4", border:"1px solid #BBF7D0", borderRadius:"8px", padding:"8px 10px", marginBottom:"10px" },
  submitBtn:{ background:"linear-gradient(135deg,#2563EB,#1A3D63)", border:"none", boxShadow:"0 4px 12px rgba(10,25,49,0.2)" },
  divider:  { display:"flex", alignItems:"center", gap:"10px", margin:"16px 0" },
  dividerLine:{ flex:1, height:"1px", background:"#E5E7EB" },
  dividerText:{ fontSize:"11px", color:"#9ca3af", whiteSpace:"nowrap", fontFamily:"Poppins,sans-serif" },
  note:     { textAlign:"center", fontSize:"11px", color:"#9ca3af", marginTop:"14px", fontFamily:"Poppins,sans-serif" },
  backBtn:  { background:"none", border:"none", cursor:"pointer", color:"#2563EB", fontSize:"13px", fontWeight:"500", padding:0, marginBottom:"14px", display:"block", fontFamily:"Poppins,sans-serif" },
  forgotTitle:{ fontSize:"16px", fontWeight:"600", marginBottom:"6px", fontFamily:"Poppins,sans-serif" },
  forgotDesc: { fontSize:"12px", color:"#6b7280", marginBottom:"16px", fontFamily:"Poppins,sans-serif" },
};