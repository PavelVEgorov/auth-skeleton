const ReactDOMServer = require('react-dom/server');
const React = require('react');
const NotFound = require('../views/NotFound');

module.exports = (req, res) => {
  const main = React.createElement(NotFound, res.locals);
  const html = ReactDOMServer.renderToStaticMarkup(main);

  res.status(404);
  res.write('<!DOCTYPE html>');
  res.end(html);
};
