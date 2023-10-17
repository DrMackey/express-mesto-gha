const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();

const BADREQUEST = 404;

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '652bdb2dc33ae137064e79fc', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res, next) => {
  next(res.status(BADREQUEST).send({ message: 'ой, что то пошло не так' }));
});

app.listen(PORT);
