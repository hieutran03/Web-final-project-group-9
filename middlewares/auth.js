const {User} = require("../models/user");
const jwt = require('jsonwebtoken');

const requireAuth = async (req, res, next) => {
  const secret = process.env.secret;
  if (!req.cookies.token) {
    res.redirect('/users/login');
  } else {
    const payload = await jwt.verify(req.cookies.token, secret);
    const user = await User.findOne({ _id: payload.userId }).select("-passHash");
    if (!user) {
      res.redirect('/users/login');
    } else {
      req.user = user;
      next();
    }
  }
};
const getAuth = async(req, res, next)=>{
  const secret = process.env.secret;
  if (!req.cookies.token) {
    next();
  } else {
    const payload = await jwt.verify(req.cookies.token, secret);
    const user = await User.findOne({ _id: payload.userId }).select("-passHash");
    if (!user) {
      next();
    } else {
      req.user = user;
      next();
    }
  }
}
module.exports = {
  requireAuth: requireAuth,
  getAuth: getAuth
}