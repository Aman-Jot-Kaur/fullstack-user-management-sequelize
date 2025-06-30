// models/index.js
const { sequelize } = require('../config/db');
const User = require('./user.model');

const syncModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // change to { force: true } for clean reset
    console.log('✅ All models synced successfully');
  } catch (error) {
    console.error('❌ Error syncing models:', error);
  }
};

module.exports = { User, syncModels };
