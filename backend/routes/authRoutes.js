const express = require('express');
const router = express.Router();
const {authMiddleware, verifyToken, authenticate} = require('../middlewares/authMiddleware'); 
const { signup, verifyOtp, login, sendSignupLinks, resendOtp, forgotPassword, resetPassword, editProfile, changePassword, profile, logout} = require('../controllers/authController');

router.post('/signup', signup);

router.post('/send-signupLinks', sendSignupLinks);


router.post('/verifyOtp', verifyOtp);

router.post('/login', login);

router.post('/forgot-password',forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.post('/resendOtp', resendOtp)

router.get('/profile', authenticate, profile);


router.put('/edit-profile/:userId', authMiddleware, editProfile);
router.put('/change-password/:userId', authMiddleware, changePassword); 
router.post('/logout', verifyToken, logout);


module.exports = router;
