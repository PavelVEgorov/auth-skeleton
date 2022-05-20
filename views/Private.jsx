const React = require('react');
const Layout = require('./Layout');

module.exports = function Main({ username }) {
  return (
    <Layout username={username}>
      Эта страница доступна только тебе, {username}!
    </Layout>
  );
};
