// utils/autoSeedAdmin.js
const { User } = require('../models');
const bcrypt = require('bcryptjs');

const autoSeedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@user.com' } });
    if (adminExists) return;

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      fullName: 'Admin User',
      email: 'admin@user.com',
      password: hashedPassword,
      isVerified: true,
      role: 'admin',
    });

    console.log('✅ Admin user seeded: admin@user.com / admin123');
  } catch (err) {
    console.error('❌ Failed to seed admin user:', err.message);
  }
};

module.exports = autoSeedAdmin;
