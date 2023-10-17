const router = require('express').Router();
const {
  getUsers,
  createUser,
  getUserId,
  patchMe,
  patchAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', patchMe);
router.patch('/me/avatar', patchAvatar);

module.exports = router;
