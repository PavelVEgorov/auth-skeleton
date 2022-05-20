const React = require('react');
const Layout = require('./Layout');

module.exports = function Main({ username }) {
  return (
    <Layout username={username}>
      <h1>Вход на сайт</h1>
      <form id="signinForm" method="POST" action="/signin">
        <div className="form-group">
          <label htmlFor="username">Логин:
            <input
              id="username"
              className="form-control"
              name="username"
              type="text"
              required
              pattern="[A-Za-z]\w+"
              minLength="4"
              title="Латинские буквы, цифры и _"
            />
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:
            <input id="password" className="form-control" name="password" type="password" required minLength="8" />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Войти</button>
      </form>

      <script defer src="/signin.js" />
    </Layout>
  );
};
