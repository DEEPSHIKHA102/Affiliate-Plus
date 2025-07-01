const express = require('express');
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const linksController = require('../controller/linksController');
const authController = require('../controller/authController');
const authorize = require('../middleware/authorizeMiddleware');

router.get('/r/:id', linksController.redirect);

router.use(authMiddleware.protect);
router.post('/', authorize('user:create'),linksController.create);
router.get('/', authorize('user:read'),linksController.getAll);
router.get('/:id', authorize('user:read'),linksController.getById);
router.put('/:id', authorize('user:update'),linksController.update);
router.delete('/:id', authorize('user:delete'),linksController.delete);

module.exports = router;

