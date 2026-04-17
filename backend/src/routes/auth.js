const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken, verifyRefreshToken } = require('../middleware/auth');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', verifyRefreshToken, authController.refresh);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.me);
router.patch('/me', verifyToken, authController.updateMe);
router.post('/change-password', verifyToken, authController.changePassword);

module.exports = router; 
