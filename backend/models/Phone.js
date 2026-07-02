const mongoose = require("mongoose");

const PhoneSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    brand:     { type: String, required: true, trim: true },
    price:     { type: Number, required: true },
    ram:       { type: String, default: "" },
    storage:   { type: String, default: "" },
    year:      { type: Number },
    condition: {
      type: String,
      enum: ["Like new", "Good", "Fair", "For parts"],
      default: "Good",
    },
    stars: { type: Number, min: 0, max: 5, default: 0 },
    images: [{ type: String }],
    video: {
      url:      { type: String, default: "" },
      filename: { type: String, default: "" },
    },
    sold:     { type: Boolean, default: false },
    whatsapp: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Phone", PhoneSchema);