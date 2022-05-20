const React = require('react');

module.exports = function Layout({ username, children }) {
  return (
    <html lang="ru">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Express аутентификация</title>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
          integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
          crossOrigin="anonymous"
        />
      </head>

      <body>
        <ul className="nav">
          <li className="nav-item">
            <a className="nav-link" href="/">Главная</a>
          </li>
          {username
            ? (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/private">Конфиденциальная информация</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/signout">Выйти</a>
                </li>
              </>
            )
            : (
              <>
                <li className="nav-item">
                  <a className="nav-link" href="/signin">Войти</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/signup">Зарегистрироваться</a>
                </li>
              </>
            )}
        </ul>
        <div className="container-fluid">
          {children}
        </div>
      </body>

    </html>
  );
};
