// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sendVerificationEmail } = require('../services/email.services');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

exports.getMyProfile = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'fullName', 'email', 'role', 'profileImage', 'isVerified']
    });

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// controllers/user.controller.js
// exports.getAllUsers = async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = 5; // per page
//   const offset = (page - 1) * limit;
//   const search = req.query.search || '';

//   try {
//     const { count, rows } = await User.findAndCountAll({
//       where: {
//         fullName: {
//           [Op.like]: `%${search}%`
//         }
//       },
//       attributes: ['id', 'fullName', 'email', 'role', 'profileImage'],
//       limit,
//       offset
//     });

//     res.status(200).json({
//       users: rows,
//       totalPages: Math.ceil(count / limit),
//       currentPage: page,
//       totalUsers: count
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// };
exports.getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;

  try {
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereCondition = search
      ? {
          [Op.or]: [
            { fullName: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { rows: users, count: total } = await User.findAndCountAll({
      where: whereCondition,
      attributes: ['id', 'fullName', 'email', 'profileImage', 'role'],
      limit: parseInt(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({ users, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};



// controllers/user.controller.js

   exports.updateUser = async (req, res) => {
  const { fullName, role } = req.body;

  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.fullName = fullName || user.fullName;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await user.destroy();
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
