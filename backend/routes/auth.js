const express = require("express");
const jwt     = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const router  = express.Router();

// Single admin account — credentials stored in .env
// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "Username and password required." });

  // Check username
  if (username !== process.env.ADMIN_USERNAME)
    return res.status(401).json({ message: "Invalid credentials." });

  // Check password (bcrypt compare)
  const match = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!match)
    return res.status(401).json({ message: "Invalid credentials." });

  const token = jwt.sign(
    { username },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }   // Token expires after 8 hours
  );

  res.json({ token });
});

module.exports = router;