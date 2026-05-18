const { verifyAccessToken } = require("../utils/tokens");
const { createError } = require("../utils/api");

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createError(401, "No auth token provided"));
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return next(createError(401, "Invalid or expired token"));
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(createError(401, "Not authenticated"));
  }
  if (req.user.role !== "admin") {
    return next(createError(403, "Admin privileges required"));
  }
  next();
};

module.exports = {
  requireAuth,
  requireAdmin,
};
