export default (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/signin');
  }
  return next();
};
