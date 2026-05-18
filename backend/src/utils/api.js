function sendSuccess(res, payload = {}, message = "OK", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data: payload,
  });
}

function createError(statusCode, message, details) {
  const error = new Error(message);
  error.statusCode = statusCode;
  if (details) error.details = details;
  return error;
}

module.exports = {
  sendSuccess,
  createError,
};
