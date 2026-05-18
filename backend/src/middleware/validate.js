const { createError } = require("../utils/api");

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validate(requiredFields = []) {
  return (req, _res, next) => {
    const missing = requiredFields.filter((field) => {
      const value = req.body[field];
      return value === undefined || value === null || value === "";
    });

    if (missing.length) {
      return next(createError(400, "Missing required fields", { missing }));
    }

    next();
  };
}

function validateRegistration(req, _res, next) {
  const { username, email, password } = req.body;

  if (!username || username.trim().length < 3) {
    return next(createError(400, "Username must be at least 3 characters"));
  }
  if (!email || !isEmail(email)) {
    return next(createError(400, "A valid email is required"));
  }
  if (!password || password.length < 6) {
    return next(createError(400, "Password must be at least 6 characters"));
  }

  next();
}

function validateDesignPayload(req, _res, next) {
  const { Shapes, name, username } = req.body;

  if (!Array.isArray(Shapes) || Shapes.length === 0) {
    return next(createError(400, "At least one canvas element is required"));
  }
  if (!name || String(name).trim().length < 2) {
    return next(createError(400, "Design name must be at least 2 characters"));
  }
  if (!username || String(username).trim().length < 2) {
    return next(createError(400, "Username is required"));
  }

  next();
}

module.exports = {
  validate,
  validateRegistration,
  validateDesignPayload,
};
