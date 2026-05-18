const jwt = require("jsonwebtoken");

function getJwtSecret() {
  return process.env.JWT_SECRET || "your_jwt_secret";
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || `${getJwtSecret()}_refresh`;
}

function signAccessToken(user) {
  return jwt.sign(
    {
      id: user._id,
      _id: user._id,
      username: user.username,
      role: user.role || "user",
    },
    getJwtSecret(),
    { expiresIn: "1h" }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    {
      id: user._id,
      tokenType: "refresh",
    },
    getRefreshSecret(),
    { expiresIn: "7d" }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
