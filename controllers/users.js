/* eslint-disable no-useless-return */
/* eslint-disable no-else-return */
/* eslint-disable consistent-return */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Conflict = require('../errors/conflict');
const Unauthorized = require('../errors/unauthorized');

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
      next(err);
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.user.payload)
    .then((users) => {
      res.send({ data: users });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFound('Пользователь не найден!'));
        return;
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('неверно заполнены поля'));
        return;
      } else {
        next(err);
        return;
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(CREATED).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new BadRequest('Неверно заполнены поля'));
            return;
          } else if (err.code === 11000) {
            next(new Conflict('Пользователь уже зарегистрирован'));
            return;
          } else {
            next(err);
            return;
          }
        });
    })
    .catch((err) => next(err));
};

module.exports.patchMe = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user.payload,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotFound('Неверно заполнены поля'));
        return;
      } else {
        next(err);
        return;
      }
    });
};

module.exports.patchAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user.payload,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('неверно заполнены поля'));
        return;
      } else {
        next(err);
        return;
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('Неправильные почта или пароль'));
        return;
      }
      token = getJwtToken(user._id);
      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        next(new Unauthorized('Неправильные почта или пароль'));
        return;
      }

      return res
        .cookie('jwt', token, {
          maxage: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация.' });
    })
    .catch((err) => {
      next(err);
    });
};
