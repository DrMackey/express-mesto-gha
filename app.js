const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth');
const { validateCreateUser, validateLogin } = require('./middlewares/validate');
const { createUser, login } = require('./controllers/users');
const NotFound = require('./errors/notfound');

const { PORT = 3000 } = process.env;
const app = express();

// const BADREQUEST = 404;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use((req, res, next) => {
//   req.user = {
//     _id: '65313410b07d8a607a201d21',
//   };

//   next();
// });

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use((req, res, next) => {
  next(new NotFound('Страница не найдена'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({ message: statusCode === 500 ? 'Что то пошло не так' : message });
});

app.listen(PORT);
