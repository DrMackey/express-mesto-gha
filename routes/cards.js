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
  validateCardId,
} = require('../middlewares/validate');

router.get('/', getCards);
router.delete('/:cardId', validateCardId, deleteCard);
router.post('/', validateCreateCard, createCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
