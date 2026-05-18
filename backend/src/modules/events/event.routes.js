const express = require('express');
const eventController = require('./event.controller');
const validateResource = require('../../middleware/zodValidator');
const { createEventSchema } = require('../../core/zodSchemas');
const { requireAuth } = require('../../middleware/authMiddleware');

const router = express.Router();

router.use(requireAuth);

router.post('/', validateResource(createEventSchema), eventController.create);
router.get('/', eventController.getAll);
router.get('/:id', eventController.getOne);

module.exports = router;
