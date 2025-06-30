// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const { User } = require('../models');
const { sendVerificationEmail,sendResetEmail } = require('../services/email.services');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { fullName, email, password } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profileImage = req.file ? req.file.filename : null;

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImage,
      isVerified: false
    });

    // Generate email verification token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Registration successful! Please verify your email.' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    user.isVerified = true;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


exports.login = async (req, res) => {
   

  try {
     const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email first' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.refreshToken = async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Refresh token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(decoded.userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({ accessToken });

  } catch (err) {
    console.error('[refreshToken]', err);
    return res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
    await sendResetEmail(email, token);
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};



