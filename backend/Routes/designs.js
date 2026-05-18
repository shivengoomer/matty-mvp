// Routes/designs.js
const express = require("express");
const router = express.Router();
const Design = require("../Models/Designs");
const Template = require("../Models/Template");
const cloudinary = require("../Config/cloudinary");
const { requireAuth } = require("../src/middleware/authMiddleware");
const asyncHandler = require("../src/middleware/asyncHandler");
const { validateDesignPayload } = require("../src/middleware/validate");
const { createError } = require("../src/utils/api");

const listCache = new Map();

function getCacheKey({ userId, page, limit, search }) {
  return `${userId}:${page}:${limit}:${search || ""}`;
}

// ---------------------------
// GET /api/designs?userId=...
// ---------------------------
router.get("/", requireAuth, asyncHandler(async (req, res) => {
  const { userId } = req.query;
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
  const search = (req.query.search || "").trim();
  if (!userId) throw createError(400, "userId is required");

  if (req.user?.id && String(req.user.id) !== String(userId)) {
    throw createError(403, "Forbidden");
  }

  const cacheKey = getCacheKey({ userId, page, limit, search });
  const cached = listCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 15 * 1000) {
    return res.json(cached.payload);
  }

  const filter = { createdBy: userId };
  if (search) {
    filter.name = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;
  const [designs, total] = await Promise.all([
    Design.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
    Design.countDocuments(filter),
  ]);

  const payload = {
    success: true,
    data: designs,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
  listCache.set(cacheKey, { payload, timestamp: Date.now() });
  res.json(payload);
}));

// -----------------------------------------------------------
// POST /api/designs  (supports admin saving as template)
// body: { Shapes[], name, username, imageData?, asTemplate?:bool, category?:string }
// -----------------------------------------------------------
router.post("/", requireAuth, validateDesignPayload, asyncHandler(async (req, res) => {
  const { Shapes, name, username, imageData, asTemplate, category } =
    req.body;
  const createdBy = req.user?.id;

  let uploadResult = null;
  if (typeof imageData === "string" && imageData.startsWith("data:image/")) {
    try {
      uploadResult = await cloudinary.uploader.upload(imageData, {
        folder: `matty/${createdBy}`,
      });
    } catch (err) {
      console.warn("Cloudinary upload failed, continuing without thumbnail");
    }
  }

  const doc = await Design.create({
    Shapes,
    name: String(name).trim(),
    createdBy,
    username: String(username).trim(),
    thumbnailUrl: uploadResult?.secure_url || "",
    assetUrl: uploadResult?.secure_url || "",
    cloudinaryPublicId: uploadResult?.public_id || "",
  });

  listCache.clear();

  if (req.user.role === "admin" && asTemplate) {
    await Template.create({
      name: String(name).trim(),
      category: category || "Uncategorized",
      imageUrl: uploadResult?.secure_url || "",
      cloudinaryPublicId: uploadResult?.public_id || "",
      shapes: Shapes,
      createdBy,
    });
  }

  return res.status(201).json({
    success: true,
    message: "Design saved",
    data: doc,
  });
}));

// -----------------------------------------------------------
// PUT /api/designs/:id
// -----------------------------------------------------------
router.put("/:id", requireAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, Shapes, imageData } = req.body;

  const existing = await Design.findById(id);
  if (!existing) throw createError(404, "Design not found");

  if (req.user?.id && String(existing.createdBy) !== String(req.user.id)) {
    throw createError(403, "Forbidden");
  }

  const updates = {};
  if (typeof name === "string") updates.name = name.trim();
  if (Array.isArray(Shapes)) updates.Shapes = Shapes;

  if (
    imageData &&
    typeof imageData === "string" &&
    imageData.startsWith("data:")
  ) {
    if (existing.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
      } catch {}
    }
    const newUpload = await cloudinary.uploader.upload(imageData, {
      folder: `matty/${existing.createdBy}`,
      resource_type: "image",
    });
    updates.thumbnailUrl = newUpload.secure_url;
    updates.assetUrl = newUpload.secure_url;
    updates.cloudinaryPublicId = newUpload.public_id;
  }

  const updated = await Design.findByIdAndUpdate(id, updates, { new: true });
  listCache.clear();
  return res.json({ success: true, data: updated });
}));

// -----------------------------------------------------------
// PUT /api/designs/:id/autosave
// -----------------------------------------------------------
router.put("/:id/autosave", requireAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { Shapes } = req.body;

  const design = await Design.findById(id);
  if (!design) throw createError(404, "Design not found");

  if (req.user?.id && String(design.createdBy) !== String(req.user.id)) {
    throw createError(403, "Forbidden");
  }

  // Add to versions if shapes have changed significantly or periodically
  // For simplicity, we add a version every time autosave is called, capped at 10
  design.Shapes = Shapes;
  
  // Rotate versions: add current state to history
  design.versions.unshift({ shapes: Shapes, timestamp: new Date() });
  if (design.versions.length > 10) {
    design.versions = design.versions.slice(0, 10);
  }

  await design.save();
  listCache.clear();

  return res.json({ 
    success: true, 
    message: "Autosaved to cloud",
    versions: design.versions.map(v => ({ id: v._id, savedAt: v.timestamp }))
  });
}));

// -----------------------------------------------------------
// DELETE /api/designs/:id
// -----------------------------------------------------------
router.delete("/:id", requireAuth, asyncHandler(async (req, res) => {
  const { id } = req.params;

  const existing = await Design.findById(id);
  if (!existing) throw createError(404, "Design not found");

  if (req.user?.id && String(existing.createdBy) !== String(req.user.id)) {
    throw createError(403, "Forbidden");
  }

  if (existing.cloudinaryPublicId) {
    try {
      await cloudinary.uploader.destroy(existing.cloudinaryPublicId);
    } catch (e) {
      console.warn("Cloudinary delete warning:", e?.message);
    }
  }

  await existing.deleteOne();
  listCache.clear();
  res.status(200).json({ success: true, message: "Design deleted successfully" });
}));

module.exports = router;
