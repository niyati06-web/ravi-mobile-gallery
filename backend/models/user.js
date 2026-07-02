const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, default: "" }, // empty if Google login
    googleId: { type: String, default: "" }, // only for Google login
    avatar:   { type: String, default: "" },
    role:     { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);