const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const authorize = require('../middleware/authorizeMiddleware');
const paymentController = require('../controller/paymentController');

router.use(authMiddleware.protect);

router.post('/create-order', authorize('payment:create'), paymentController.createOrder);
router.post('/verify-order', authorize('payment:create'), paymentController.verifyOrder);

module.exports = router;
