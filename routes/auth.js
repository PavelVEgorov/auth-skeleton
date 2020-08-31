import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

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
  .get((req, res) => res.render('signin'))
  // Аутентификация пользователя
  .post(async (req, res) => {
    const { username, password } = req.body;
    try {
      // Пытаемся сначала найти пользователя в БД
      const user = await User.findOne({
        username,
      }).exec();
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
  .get((req, res) => res.render('signup'))
  // Регистрация пользователя
  .post(async (req, res) => {
    const { username, password, email } = req.body;
    try {
      // Мы не храним пароль в БД, только его хэш
      const salt = Number(process.env.SALT_ROUNDS) ?? 10;
      const hashedPassword = await bcrypt.hash(password, salt);
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

export default router;
