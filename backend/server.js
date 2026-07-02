require("dotenv").config();
const express   = require("express");
const mongoose  = require("mongoose");
const cors      = require("cors");
const path      = require("path");

const authRoutes  = require("./routes/auth");
const phoneRoutes = require("./routes/phones");
const aiRoutes    = require("./routes/ai");
const userRoutes  = require("./routes/users");

const app = express();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use("/api/auth",   authRoutes);   // admin login
app.use("/api/phones", phoneRoutes);  // phone listings
app.use("/api/ai",     aiRoutes);     // AI features
app.use("/api/users",  userRoutes);   // user signup/login/google

// ─── MongoDB ────────────────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });