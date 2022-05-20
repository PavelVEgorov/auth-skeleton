const React = require('react');
const Layout = require('./Layout');

module.exports = function Main({ username }) {
  return (
    <Layout username={username}>
      <h1>Добро пожаловать!</h1>
    </Layout>
  );
};
