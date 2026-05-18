const express = require('express');
const workspaceController = require('./workspace.controller');
const validateResource = require('../../middleware/zodValidator');
const { createWorkspaceSchema } = require('../../core/zodSchemas');
const { requireAuth } = require('../../middleware/authMiddleware');

const router = express.Router();

// All workspace routes require authentication
router.use(requireAuth);

router.post('/', validateResource(createWorkspaceSchema), workspaceController.create);
router.get('/', workspaceController.getAll);
router.get('/:id', workspaceController.getOne);

module.exports = router;
