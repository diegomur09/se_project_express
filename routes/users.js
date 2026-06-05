const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateUserId } = require("../middlewares/validation");
const {
  createUserLegacy,
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

router.post("/", createUserLegacy);
router.get("/", getUsers);
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);
router.get("/:userId", validateUserId, getUserById);

module.exports = router;
