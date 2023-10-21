const Card = require('../models/card');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Unauthorized = require('../errors/unauthorized');
// const InternalServer = require('../errors/internalserver');

// const BADREQUEST = 400;
// const NOTFOUND = 404;
// const INTERNALSERVER = 500;
const CREATED = 201;

module.exports.createCard = (req, res, next) => {
  const owner = req.user.payload;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('неверно заполнены поля'));
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  const owner = req.user.payload;

  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена!'));
        // throw new Error('Карточка не найдена!');
      }
      if (owner === card.owner) {
        res.send({ data: card });
        card.deleteOne();
      } else {
        // return Promise.reject(new Error('Отказано в доступе'));
        next(new Unauthorized('Отказано в доступе'));
      }
    })
    .catch((err) => {
      if (err.name === 'Error') {
        next(new NotFound(err.message));
        // res.status(NOTFOUND).send({ message: err.message });
      } else if (err.name === 'CastError') {
        // res.status(BADREQUEST).send({ message: 'Карточка не найдена' });
        next(new BadRequest('Карточка не найдена'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена!'));
        // throw new Error('Карточка не найдена!');
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        // res.status(NOTFOUND).send({ message: 'Карточка не найдена' });
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
        next(new BadRequest('неверно заполнены поля'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        // throw new Error('Карточка не найдена!');
        next(new NotFound('Карточка не найдена'));
      }

      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        // res.status(NOTFOUND).send({ message: 'Карточка не найдена' });
        next(new NotFound('Карточка не найдена'));
      } else if (err.name === 'CastError') {
        // res.status(BADREQUEST).send({ message: 'неверно заполнены поля' });
        next(new BadRequest('неверно заполнены поля'));
      } else {
        // res.status(INTERNALSERVER).send({ message: 'ой, что то пошло не так' });
        next(err);
      }
    });
};
