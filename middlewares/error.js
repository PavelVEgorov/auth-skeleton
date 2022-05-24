const logger = console;

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  logger.error(err);
  res.status(500).render('error');
};
