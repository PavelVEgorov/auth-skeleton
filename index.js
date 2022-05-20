require('@babel/register');

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const sessionFileStore = require('session-file-store');
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const privateRouter = require('./routes/private');
const userMiddleware = require('./middlewares/user');
const notFoundMiddleware = require('./middlewares/notfound');
const errorMiddleware = require('./middlewares/error');

const logger = console;
const app = express();
const FileStore = sessionFileStore(session);

// Запоминаем название куки для сессий
app.set('session cookie name', 'sid');
// Доверять первому прокси (для Heroku и прочих)
app.set('trust proxy', 1);

app.use(express.static('public'));
app.use(express.json());
app.use(session({
  name: app.get('session cookie name'),
  secret: process.env.SESSION_SECRET,
  store: new FileStore({
    // Шифрование сессии
    secret: process.env.SESSION_SECRET,
  }),
  // Если true, сохраняет сессию, даже если она не поменялась
  resave: false,
  // Если false, куки появляются только при установке req.session
  saveUninitialized: false,
  cookie: {
    // В продакшне нужно "secure: true" для HTTPS
    secure: process.env.NODE_ENV === 'production',
  },
}));
app.use(userMiddleware);

app.use(indexRouter);
app.use(authRouter);
app.use('/private', privateRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {
  logger.log('Сервер запущен. Порт:', port);
});
