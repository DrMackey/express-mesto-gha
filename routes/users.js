const router = require('express').Router();
const {
  getUsers,
  getUser,
  getUserId,
  patchMe,
  patchAvatar,
} = require('../controllers/users');

const {
  validateUserId,
  validateUserUpdate,
  validateUserAvatar,
} = require('../middlewares/validate');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', validateUserUpdate, patchMe);
router.patch('/me/avatar', validateUserAvatar, patchAvatar);

module.exports = router;
