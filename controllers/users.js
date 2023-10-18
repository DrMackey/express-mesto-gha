const User = require('../models/user');

const BADREQUEST = 400;
const NOTFOUND = 404;
const INTERNALSERVER = 500;
const CREATED = 201;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => {
      res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
    });
};

module.exports.getUserId = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new Error('Пользователь не найден!');
      }

      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(NOTFOUND).send({ message: 'Пользователь не найден' });
      } else if (err.name === 'CastError') {
        res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.status(CREATED).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};

module.exports.patchMe = (req, res) => {
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
        res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ошибка по-умолчанию' });
      }
    });
};
