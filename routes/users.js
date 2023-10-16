const router = require("express").Router();
const {
  getUser,
  createUser,
  getUserId,
  patchMe,
  patchAvatar,
} = require("../controllers/users");

router.get("/", getUser);
router.get("/:userId", getUserId);
router.post("/", createUser);
router.patch("/me", patchMe);
router.patch("/me/avatar", patchAvatar);

module.exports = router;
