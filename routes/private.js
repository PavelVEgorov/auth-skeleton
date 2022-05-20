const express = require('express');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

const Private = require('../views/Private');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  const privatePage = React.createElement(Private, res.locals);
  const html = ReactDOMServer.renderToStaticMarkup(privatePage);
  res.write('<!DOCTYPE html>');
  res.end(html);
});

module.exports = router;
