import express from 'express';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import './misc/env.js';
import './misc/db.js';
import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';
import privateRouter from './routes/private.js';
import userMiddleware from './middlewares/user.js';
import notFoundMiddleware from './middlewares/notfound.js';
import errorMiddleware from './middlewares/error.js';

const logger = console;
const app = express();
const FileStore = sessionFileStore(session);

app.set('view engine', 'hbs');
// Запоминаем название куки для сессий
app.set('session cookie name', 'sid');

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
