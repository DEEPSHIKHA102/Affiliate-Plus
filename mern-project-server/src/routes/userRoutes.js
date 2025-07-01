const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', userController.create);
router.get('/', userController.getAll);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

module.exports = router;