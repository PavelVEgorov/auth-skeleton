import User from "../models/user.js";

export const isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/signin');
  }
  return next();
};

export const isAdmin = async (req, res, next) => {
  const {role} = await User.findById(req.session.user.id, 'role');
  console.log(' role : ', role);
  if (role === 0) {
    return res.render('noadmin');
  }
  return next();
};

