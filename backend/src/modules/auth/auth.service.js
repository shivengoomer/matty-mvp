const bcrypt = require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');
const User = require('../../../Models/User');
const { createError } = require("../../utils/api");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../../utils/tokens");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "551070839040-qh22gqelveth5aaiqfan1fm43v0tvs7s.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthService {
  async register(data) {
    const { username, email, password } = data;
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) throw createError(400, "User already exists");

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPass,
      role: 'user',
    });
    
    await newUser.save();

    const token = signAccessToken(newUser);
    const refreshToken = signRefreshToken(newUser);

    newUser.refreshTokens = [refreshToken];
    await newUser.save();

    return { user: newUser, token, refreshToken };
  }

  async login(data) {
    const { username, password } = data;
    const user = await User.findOne({ username }).select("+refreshTokens");
    if (!user) throw createError(401, "Invalid username or password");
    if (!user.password) throw createError(400, "Please log in with Google for this account");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createError(401, "Invalid username or password");

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
    await user.save();

    return { user, token, refreshToken };
  }

  async googleLogin(tokenId) {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, email_verified, sub: googleId } = payload;

    if (!email_verified) throw createError(401, "Google account email is not verified");

    let user = await User.findOne({ email }).select("+refreshTokens");
    if (!user) {
      const baseUsername = (name || email).replace(/\s+/g, '');
      let availableUsername = baseUsername;
      let suffix = 1;
      while (await User.findOne({ username: availableUsername })) {
        availableUsername = `${baseUsername}${suffix++}`;
      }

      user = new User({
        username: availableUsername,
        email: email.toLowerCase(),
        googleId,
        password: "",
      });
      await user.save();
      user = await User.findById(user._id).select("+refreshTokens");
    }

    const token = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
    await user.save();

    return { user, token, refreshToken };
  }

  async refresh(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select("+refreshTokens");

    if (!user) throw createError(401, "Invalid refresh token");
    const hasToken = (user.refreshTokens || []).includes(refreshToken);
    if (!hasToken) throw createError(401, "Refresh token not recognized");

    const nextToken = signAccessToken(user);
    const nextRefreshToken = signRefreshToken(user);
    user.refreshTokens = (user.refreshTokens || [])
      .filter((token) => token !== refreshToken)
      .concat(nextRefreshToken)
      .slice(-5);
    await user.save();

    return { token: nextToken, refreshToken: nextRefreshToken };
  }

  async logout(refreshToken) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.id).select("+refreshTokens");
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter(
        (token) => token !== refreshToken
      );
      await user.save();
    }
  }
}

module.exports = new AuthService();
