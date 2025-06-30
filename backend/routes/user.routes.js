const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.middleware');
const { getMyProfile, getAllUsers,updateUser,deleteUser } = require('../controllers/user.controller');
const { isAdmin } = require('../middlewares/role.middleware');
router.get('/me', verifyToken, getMyProfile);
router.get('/', verifyToken, getAllUsers);

router.put('/:id', verifyToken, isAdmin, updateUser);
router.delete('/:id', verifyToken, isAdmin, deleteUser);


module.exports = router;
     