const router = require('express').Router();
const {
  getUsers,
  getUser,
  // createUser,
  getUserId,
  patchMe,
  patchAvatar,
  // login,
} = require('../controllers/users');

const {
  validateUserId,
  validateUserUpdate,
  validateUserAvatar,
} = require('../middlewares/validate');
// const auth = require('../middlewares/auth');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validateUserId, getUserId);
router.patch('/me', validateUserUpdate, patchMe);
router.patch('/me/avatar', validateUserAvatar, patchAvatar);
// router.post('/signin', auth);
// router.post('/signin', login);
// router.post('/signup', createUser);

module.exports = router;
