const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateCreateCard,
  validateCardLike,
} = require('../middlewares/validate');

router.get('/', getCards);
router.delete('/:cardId', validateCardLike, deleteCard);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', validateCardLike, likeCard);
router.delete('/:cardId/likes', validateCardLike, dislikeCard);

module.exports = router;
