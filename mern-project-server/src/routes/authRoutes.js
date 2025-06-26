const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();//Instamce of Router
const {body} = require('express-validator');

const loginValidator = [
    body('username')
    .notEmpty().withMessage('Username is required')
    .isEmail().withMessage("Username must be a valid email"),
    body('password')
    .notEmpty().withMessage('Password is required')
    .isLength().withMessage("Password must be atleast 4 character long")
];

router.post('/login',loginValidator, authController.login);
router.post('/logout',authController.logout);
router.post('/is-user-logged-in',authController.isUserLoggedIn);
router.post('/register',authController.register);
router.post('/google-auth',authController.googleAuth);

module.exports = router;
