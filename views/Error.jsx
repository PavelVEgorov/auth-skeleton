const React = require('react');
const Layout = require('./Layout');

module.exports = function Error({ username }) {
  return (
    <Layout username={username}>
      <div className="alert alert-danger" role="alert">
        Произошла непредвиденная ошибка.
      </div>
    </Layout>
  );
};
