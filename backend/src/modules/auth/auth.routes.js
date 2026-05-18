const express = require('express');
const { z } = require('zod');
const authController = require('./auth.controller');
const validateResource = require('../../middleware/zodValidator');
const { registerSchema, loginSchema } = require('../../core/zodSchemas');

const router = express.Router();

const tokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ required_error: "Refresh token is required" }),
  }),
});

const googleLoginSchema = z.object({
  body: z.object({
    tokenId: z.string({ required_error: "Token ID is required" }),
  }),
});

router.post('/register', validateResource(registerSchema), authController.register);
router.post('/login', validateResource(loginSchema), authController.login);
router.post('/google-login', validateResource(googleLoginSchema), authController.googleLogin);
router.post('/refresh', validateResource(tokenSchema), authController.refresh);
router.post('/logout', validateResource(tokenSchema), authController.logout);

module.exports = router;
