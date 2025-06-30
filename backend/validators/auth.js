// validators/auth.js
const { body } = require('express-validator');

exports.registerValidator = [
  body('fullName').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
];

exports.validateLogin = [
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password is required').notEmpty()
];
