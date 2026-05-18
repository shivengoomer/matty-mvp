const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., 'created_design', 'invited_user'
    details: { type: mongoose.Schema.Types.Mixed }, // Payload describing the action
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Logs don't update
);

activityLogSchema.index({ workspace: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);
