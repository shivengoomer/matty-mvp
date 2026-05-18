// Models/Designs.js
const mongoose = require("mongoose");

const DesignSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    Shapes: {
      type: [mongoose.Schema.Types.Mixed], // flexible shape objects
      required: true,
      default: [],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    assetUrl: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
    versions: [
      {
        shapes: [mongoose.Schema.Types.Mixed],
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

DesignSchema.index({ createdBy: 1, updatedAt: -1 });
DesignSchema.index({ name: "text" });

module.exports = mongoose.model("Design", DesignSchema);
