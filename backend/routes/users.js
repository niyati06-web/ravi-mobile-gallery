const express  = require("express");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto   = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User     = require("../models/User");
const router   = express.Router();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Store reset tokens temporarily (in production use Redis or DB)
const resetTokens = new Map();

const makeToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

// ── POST /api/users/signup ──────────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "All fields required." });
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered." });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = makeToken({ id: user._id, role: user.role });
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/users/login ───────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: "Email and password required." });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password." });
    if (!user.password) return res.status(401).json({ message: "Please login with Google." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password." });
    const token = makeToken({ id: user._id, role: user.role });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/users/google ──────────────────────────────────────────────────
router.post("/google", async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: "Google credential missing." });
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { name, email, sub: googleId, picture } = ticket.getPayload();
    let user = await User.findOne({ email });
    if (!user) user = await User.create({ name, email, googleId, avatar: picture });
    const token = makeToken({ id: user._id, role: user.role });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    });
  } catch (err) {
    res.status(500).json({ message: "Google login failed.", error: err.message });
  }
});

// ── POST /api/users/forgot-password ────────────────────────────────────────
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required." });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No account found with this email." });
    if (!user.password) return res.status(400).json({ message: "This account uses Google login." });

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000; // 15 minutes

    resetTokens.set(token, { userId: user._id.toString(), expiry });

    // Reset link
    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Send email
    await transporter.sendMail({
      from: `"Ravi Mobile Gallery" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Password Reset — Ravi Mobile Gallery",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
          <div style="text-align:center;margin-bottom:24px">
            <h2 style="color:#2563EB">📱 Ravi Mobile Gallery</h2>
          </div>
          <h3>Reset your password</h3>
          <p style="color:#6b7280;margin:12px 0">
            We received a request to reset your password. Click the button below to set a new password.
          </p>
          <a href="${resetLink}"
            style="display:block;text-align:center;background:linear-gradient(135deg,#2563EB,#7c3aed);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin:20px 0">
            Reset Password
          </a>
          <p style="color:#9ca3af;font-size:12px;text-align:center">
            This link expires in 15 minutes. If you didn't request this, ignore this email.
          </p>
        </div>
      `,
    });

    res.json({ message: "Reset link sent! Check your email." });
  } catch (err) {
    res.status(500).json({ message: "Failed to send email. Try again.", error: err.message });
  }
});

// ── POST /api/users/reset-password ─────────────────────────────────────────
router.post("/reset-password", async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: "Token and password required." });

  const data = resetTokens.get(token);
  if (!data) return res.status(400).json({ message: "Invalid or expired reset link." });
  if (Date.now() > data.expiry) {
    resetTokens.delete(token);
    return res.status(400).json({ message: "Reset link expired. Please request a new one." });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(data.userId, { password: hash });
    resetTokens.delete(token);
    res.json({ message: "Password reset successfully! You can now login." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;