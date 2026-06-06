const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserId,
  validateUserProfileBody,
} = require("../middlewares/validation");
const {
  createUserLegacy,
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.post("/", validateUserProfileBody, createUserLegacy);
router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, validateUserProfileBody, updateProfile);
router.get("/:userId", validateUserId, getUserById);

module.exports = router;
