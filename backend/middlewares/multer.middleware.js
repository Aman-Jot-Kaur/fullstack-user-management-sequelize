// middlewares/multer.middleware.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (_, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
  cb(null, allowed.includes(file.mimetype));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
