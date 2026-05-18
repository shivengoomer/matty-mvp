const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    json: { type: Object, required: true }, // Store full fabric.js JSON object
    imageUrl: { type: String }, // For preview in template gallery (optional)
    isStarter: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Template", templateSchema);
