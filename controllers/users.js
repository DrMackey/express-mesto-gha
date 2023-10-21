const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Conflict = require('../errors/conflict');
// const Unauthorized = require('../errors/unauthorized');

// const BADREQUEST = 400;
// const NOTFOUND = 404;
// const INTERNALSERVER = 500;
const CREATED = 201;
const JWT_SECRET = 'token';

let token = '';

function getJwtToken(id) {
  token = jwt.sign({ payload: id }, JWT_SECRET, { expiresIn: '7d' });
  return token;
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        // throw new Error('Пользователь не найден!');
        next(new NotFound('Пользователь не найден!'));
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        // res.status(NOTFOUND).send({ message: 'Пользователь не найден' });
        next(new NotFound('Пользователь не найден!'));
      } else if (err.name === 'CastError') {
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
        next(new BadRequest('неверно заполнены поля'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
        next(new BadRequest('неверно заполнены поля'));
      } else if (err.code === 11000) {
        next(new Conflict('неверно заполнены поля'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};

module.exports.patchMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
        next(new NotFound('Карточка не найдена!'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
        next(new BadRequest('неверно заполнены поля'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ошибка по-умолчанию' });
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        next(new BadRequest('Неправильные почта или пароль'));
      }
      token = getJwtToken(user._id);
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // return Promise.reject(new Error('Неправильные почта или пароль'));
        next(new BadRequest('Неправильные почта или пароль'));
      }

      return res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация.' });
    })
    .catch((err) => {
      // res.status(401).send({ message: err.message });
      next(err);
    });
};
