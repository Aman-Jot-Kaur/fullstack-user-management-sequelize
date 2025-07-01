// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const { verifyEmail,register,login, refreshToken,forgotPassword,resetPassword } = require('../controllers/auth.controller');
const passport = require('passport');
require('../config/passport');

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
const upload = require('../middlewares/multer.middleware');
const { registerValidator,validateLogin } = require('../validators/auth');

router.post('/register', upload.single('profileImage'), registerValidator, register);


router.get('/verify-email', verifyEmail);


router.post('/login', validateLogin, login);
router.get('/refreshToken', refreshToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/google',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Generate token here
    const accessToken = jwt.sign(
      { userId: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const refreshToken = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Redirect to frontend with token
    res.redirect(`http://localhost:5173/social-login?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);
module.exports = router;
