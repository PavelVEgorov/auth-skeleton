const express = require('express');
const bcrypt = require('bcrypt');
const ReactDOMServer = require('react-dom/server');
const React = require('react');

const SignIn = require('../views/SignIn');
const SignUp = require('../views/SignUp');
const { User } = require('../db/models/index');

const logger = console;
const router = express.Router();

/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 */
function failAuth(res) {
  return res.status(401).end();
}

/**
 * Подготавливает пользователя для записи в сессию
 * Мы не хотим хранить пароль в сессии, поэтому извлекаем только нужные данные
 * @param {object} user Объект пользователя из БД
 */
function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
  };
}

router
  .route('/signin')
  // Страница аутентификации пользователя
  .get((req, res) => {
    const signIn = React.createElement(SignIn);
    const html = ReactDOMServer.renderToStaticMarkup(signIn);
    res.write('<!DOCTYPE html>');
    res.end(html);
  })
  // Аутентификация пользователя
  .post(async (req, res) => {
    const { username, password } = req.body;
    try {
      // Пытаемся сначала найти пользователя в БД
      const user = await User.findOne({
        where: {
          username,
        },
        raw: true,
      });
      if (!user) {
        return failAuth(res);
      }
      // Сравниваем хэш в БД с хэшем введённого пароля
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return failAuth(res);
      }
      req.session.user = serializeUser(user);
    } catch (err) {
      logger.error(err);
      return failAuth(res);
    }
    return res.end();
  });

router
  .route('/signup')
  // Страница регистрации пользователя
  .get((req, res) => {
    const signUp = React.createElement(SignUp);
    const html = ReactDOMServer.renderToStaticMarkup(signUp);
    res.write('<!DOCTYPE html>');
    res.end(html);
  })
  // Регистрация пользователя
  .post(async (req, res) => {
    const { username, password, email } = req.body;
    try {
      // Мы не храним пароль в БД, только его хэш
      const saltRounds = Number(process.env.SALT_ROUNDS ?? 10);
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        username,
        password: hashedPassword,
        email,
      });
      req.session.user = serializeUser(user);
    } catch (err) {
      logger.error(err);
      return failAuth(res);
    }
    return res.end();
  });

router.get('/signout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie(req.app.get('session cookie name'));
    return res.redirect('/');
  });
});

module.exports = router;
