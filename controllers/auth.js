import User from "../models/user.js";
import bcrypt from "bcrypt";

/**
 * Завершает запрос с ошибкой аутентификации
 * @param {object} res Ответ express
 */
function failAuth(res) {
  return res.status(401).end();
}

/**
 * Подготавливает пользователя для записи в сессию
 * @param {object} user Объект пользователя из БД
 */
function serializeUser(user) {
  return {
    id: user.id,
    username: user.username,
  };
}


export const signinForm = (req, res) => res.render('signin');
export const signupForm = (req, res) => res.render("signup");

export const signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Пытаемся сначала найти пользователя в БД
    const user = await User.findOne({username}).exec();
    if (!user) return failAuth(res);

    // Сравниваем хэш в БД с хэшем введённого пароля
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return failAuth(res);
    req.session.user = serializeUser(user);
  } catch (err) {
    console.error(err);
    return failAuth(res);
  }
  return res.end();
};

export const signup = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // Мы не храним пароль в БД, только его хэш
    const salt = Number(process.env.SALT_ROUNDS) ?? 10;
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      username,
      password: hashedPassword,
      role
    });
    req.session.user = serializeUser(user);
  } catch (err) {
    console.error(err);
    return failAuth(res);
  }
  return res.end();
};

export const signout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("sid");
    return res.redirect("/");
  });
};
