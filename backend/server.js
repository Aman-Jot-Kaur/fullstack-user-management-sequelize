// server.js
require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');
const { syncModels } = require('./models');
const autoSeedAdmin = require('./utils/autoSeedAdmin');

const PORT = process.env.PORT || 8080;

(async () => {
  await connectDB();
  await syncModels();
  await autoSeedAdmin();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
