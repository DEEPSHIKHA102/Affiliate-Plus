const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const linksController = require('../controller/linksController');
const authorize = require('../middleware/authorizeMiddleware');

router.get('/r/:id', linksController.redirect);

router.use(authMiddleware.protect);
router.get('/analytics', authorize('link:read'), linksController.analytics);
router.post('/', authorize('link:create'), linksController.create);
router.get('/', authorize('link:read'), linksController.getAll);
router.get('/:id', authorize('link:read'), linksController.getById);
router.put('/:id', authorize('link:update'), linksController.update);
router.delete('/:id', authorize('link:delete'), linksController.delete);

module.exports = router;