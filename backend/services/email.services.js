// services/email.service.js
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.sendVerificationEmail = async (to, token) => {
  const verifyLink = `http://localhost:5000/api/auth/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"UserHub 🔐" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Verify Your Email',
    html: `<h3>Hello 👋</h3><p>Please <a href="${verifyLink}">click here to verify your email</a>.</p>`
  });
};
// services/email.services.js
exports.sendResetEmail = async (email, token) => {
  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
