import express from 'express';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import dotenv from 'dotenv';
import morgan from 'morgan'

import dbConnect from './misc/db.js';
import privateRouter from './routes/private.js';
import userMiddleware from './middlewares/user.js';
import notFoundMiddleware from './middlewares/notfound.js';
import errorMiddleware from './middlewares/error.js';

import indexRouter from './routes/index.js';
import authRouter from './routes/auth.js';

dotenv.config();

dbConnect();

const app = express();
const FileStore = sessionFileStore(session);

app.set('view engine', 'hbs');

app.use(morgan("dev"));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  name: 'sid', //название куки для сессий
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
    expires: 600000
  },
}));
app.use(userMiddleware);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/private', privateRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT ?? 3000;
app.listen(port, () => {console.log('Server started at http://localhost:%s/', port)});
