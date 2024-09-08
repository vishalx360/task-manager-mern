const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/profile', authController.getProfile);

// email and password login
router.post('/login', authController.login);
router.post('/signup', authController.signup);

// google login
router.get('/google/login', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

router.post('/logout', authController.logout);

module.exports = router;
