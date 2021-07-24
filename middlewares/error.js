const logger = console

module.exports = (err, req, res, next) => {
  logger.error(err)
  res.status(500).render('error')
}
