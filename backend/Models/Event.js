const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, default: "TBD" },
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" }, // Optional link to workspace
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    participants: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["invited", "accepted", "declined"], default: "invited" },
      },
    ],
  },
  { timestamps: true }
);

eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ date: 1 });

module.exports = mongoose.model("Event", eventSchema);
