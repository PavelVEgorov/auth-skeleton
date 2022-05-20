const React = require('react');
const Layout = require('./Layout');

module.exports = function Main({ username }) {
  return (
    <Layout username={username}>
      <p className="lead">Страница не найдена</p>
    </Layout>
  );
};
