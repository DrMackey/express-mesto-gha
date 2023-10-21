/* eslint-disable no-else-return */
/* eslint-disable no-useless-return */
/* eslint-disable eqeqeq */
const Card = require('../models/card');
const BadRequest = require('../errors/badrequest');
const NotFound = require('../errors/notfound');
const Forbidden = require('../errors/forbidden');

const CREATED = 201;

module.exports.createCard = (req, res, next) => {
  const owner = req.user.payload;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED).send({ data: card }))
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
        return;
      }
      if (owner == card.owner) {
        card
          .deleteOne()
          .then(() => {
            res.send({ data: card });
          })
          .catch((err) => {
            next(err);
          });
        return;
      } else {
        next(new Forbidden('Отказано в доступе'));
        return;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('неверный id'));
        return;
      } else {
        next(err);
        return;
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.payload } },
    { new: true },
  )

    .then((card) => {
      if (!card) {
        next(new NotFound('Карточка не найдена!'));
        return;
      }

      res.send({ data: card });
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

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user.payload } },
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (card === null) {
        return next(new NotFound('Карточка не найдена'));
      }

      res.send({ data: card });
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
