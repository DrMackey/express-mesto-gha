const Card = require('../models/card');

const NOTFOUND = 400;
const BADREQUEST = 404;
const INTERNALSERVER = 500;
const CREATED = 201;

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOTFOUND).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};

module.exports.getCard = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new Error('Карточка не найдена!');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(BADREQUEST).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(NOTFOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Карточка не найдена!');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(BADREQUEST).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(NOTFOUND).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error('Карточка не найдена!');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(BADREQUEST).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(NOTFOUND).send({ message: 'неверно заполнены поля' });
      } else {
        res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
      }
    });
};
