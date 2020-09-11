import User from '../models/user.js';

export const isAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/signin');
  }
  return next();
};

export const isAdmin = async (req, res, next) => {
  try {
    const { role } = await User.findById(req.session.user.id, 'role');
    console.log(' role : ', role);
    if (role === 0) return res.render('noadmin');
  } catch (err) {
    console.log('Error to get role: ', err.message);
  }

  return next();
};
