require('dotenv').config()
const express = require('express')
const session = require('express-session')
const sessionFileStore = require('session-file-store')
const indexRouter = require('./routes/index.js')
const authRouter = require('./routes/auth.js')
const privateRouter = require('./routes/private.js')
const userMiddleware = require('./middlewares/user.js')
const notFoundMiddleware = require('./middlewares/notfound.js')
const errorMiddleware = require('./middlewares/error.js')

const logger = console
const app = express()
const FileStore = sessionFileStore(session)

app.set('view engine', 'hbs')
// Запоминаем название куки для сессий
app.set('session cookie name', 'sid')
// Доверять первому прокси (для Heroku и прочих)
app.set('trust proxy', 1)

app.use(express.static('public'))
app.use(express.json())
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
}))
app.use(userMiddleware)

app.use(indexRouter)
app.use(authRouter)
app.use('/private', privateRouter)

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT ?? 3000
app.listen(port, () => {
  logger.log('Сервер запущен. Порт:', port)
})
