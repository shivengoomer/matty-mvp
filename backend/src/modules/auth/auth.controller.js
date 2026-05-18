const asyncHandler = require("../../middleware/asyncHandler");
const authService = require("./auth.service");
const { successResponse } = require("../../core/responses");

class AuthController {
  register = asyncHandler(async (req, res) => {
    const result = await authService.register(req.body);
    return successResponse(res, 201, "User registered successfully", {
      token: result.token,
      refreshToken: result.refreshToken,
      username: result.user.username,
      role: result.user.role,
      _id: result.user._id,
    });
  });

  login = asyncHandler(async (req, res) => {
    const result = await authService.login(req.body);
    return successResponse(res, 200, "Login successful", {
      token: result.token,
      refreshToken: result.refreshToken,
      username: result.user.username,
      role: result.user.role,
      _id: result.user._id,
    });
  });

  googleLogin = asyncHandler(async (req, res) => {
    const { tokenId } = req.body;
    const result = await authService.googleLogin(tokenId);
    return successResponse(res, 200, "Google login successful", {
      token: result.token,
      refreshToken: result.refreshToken,
      username: result.user.username,
      role: result.user.role,
      _id: result.user._id,
    });
  });

  refresh = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await authService.refresh(refreshToken);
    return successResponse(res, 200, "Token refreshed", {
      token: result.token,
      refreshToken: result.refreshToken,
    });
  });

  logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await authService.logout(refreshToken);
    return successResponse(res, 200, "Logged out successfully");
  });
}

module.exports = new AuthController();
