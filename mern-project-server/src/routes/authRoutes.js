const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();
const { body } = require('express-validator');

// Validation middleware for login
const loginValidator = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isEmail().withMessage('Username must be a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 4 }).withMessage('Password must be at least 4 characters long')
];

// Auth routes
router.post('/login', loginValidator, authController.login);
router.post('/logout', authController.logout);
router.post('/is-user-logged-in', authController.isUserLoggedIn);
router.post('/register', authController.register);
router.post('/google-auth', authController.googleAuth);

// 🔐 Password Reset Routes
router.post('/send-reset-code', authController.sendResetPasswordToken);     // Step 1: Send code
router.post('/verify-reset-code', authController.resetPassword); // Step 2: Verify + Reset password

module.exports = router;
