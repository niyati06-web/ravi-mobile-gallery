const express  = require("express");
const multer   = require("multer");
const path     = require("path");
const fs       = require("fs");
const Phone    = require("../models/Phone");
const auth     = require("../middleware/authMiddleware");
const router   = express.Router();

// ─── Multer storage setup ───────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg","image/png","image/webp","video/mp4"];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max per file
});

const uploadFields = upload.fields([
  { name: "images", maxCount: 5 },
  { name: "video",  maxCount: 1 },
]);

// ─── GET /api/phones — public, all unsold listings ─────────────────────────
router.get("/", async (req, res) => {
  try {
    const phones = await Phone.find({ sold: false }).sort({ createdAt: -1 });
    res.json(phones);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ─── GET /api/phones/stats — admin only ────────────────────────────────────
router.get("/stats", auth, async (req, res) => {
  try {
    const listed    = await Phone.countDocuments({ sold: false });
    const sold      = await Phone.countDocuments({ sold: true });
    res.json({ listed, sold, inquiries: 0 });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// ─── POST /api/phones — admin only, add new listing ────────────────────────
router.post("/", auth, uploadFields, async (req, res) => {
  try {
    const { name, brand, price, ram, storage, year, condition, stars, whatsapp } = req.body;

    // Build image URL array
    const images = (req.files?.images || []).map(
      (f) => `/uploads/${f.filename}`
    );

    // Build video object
    const videoFile = req.files?.video?.[0];
    const video = videoFile
      ? { url: `/uploads/${videoFile.filename}`, filename: videoFile.originalname }
      : { url: "", filename: "" };

    const phone = await Phone.create({
      name, brand,
      price:     Number(price),
      ram, storage,
      year:      year ? Number(year) : undefined,
      condition,
      stars:     Number(stars) || 0,
      images,
      video,
      whatsapp:  whatsapp || process.env.SHOP_WHATSAPP || "",
    });

    res.status(201).json(phone);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PATCH /api/phones/:id/sold — admin only ───────────────────────────────
router.patch("/:id/sold", auth, async (req, res) => {
  try {
    const phone = await Phone.findByIdAndUpdate(
      req.params.id,
      { sold: true },
      { new: true }
    );
    if (!phone) return res.status(404).json({ message: "Phone not found." });
    res.json(phone);
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

// ─── DELETE /api/phones/:id — admin only ───────────────────────────────────
router.delete("/:id", auth, async (req, res) => {
  try {
    const phone = await Phone.findByIdAndDelete(req.params.id);
    if (!phone) return res.status(404).json({ message: "Phone not found." });

    // Delete uploaded files from disk
    [...(phone.images || [])].forEach((imgPath) => {
      const full = path.join(__dirname, "..", imgPath);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    });
    if (phone.video?.url) {
      const full = path.join(__dirname, "..", phone.video.url);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    }

    res.json({ message: "Deleted." });
  } catch {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;