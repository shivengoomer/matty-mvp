function notFound(_req, _res, next) {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, _req, res, _next) {
  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.errors.map(e => ({ path: e.path.join('.'), message: e.message }))
    });
  }

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    details: err.details || null,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
