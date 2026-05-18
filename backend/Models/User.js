const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" }, // admin role
    googleId: { type: String }, // for Google auth
    refreshTokens: {
      type: [String],
      default: [],
      select: false,
    },
    workspaces: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workspace' }]
  },
  { timestamps: true }
);

userSchema.index({ username: 1, email: 1 });

module.exports = mongoose.model("User", userSchema);
