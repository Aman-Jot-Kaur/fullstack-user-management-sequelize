// middlewares/role.middleware.js
exports.isAdmin = (req, res, next) => {
  console.log("checking is admin")
  if (req.user && req.user.role === 'admin') {
    console.log("admin role")
    next();
  } else {
    console.log(req)
    console.log(req.user)
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};
