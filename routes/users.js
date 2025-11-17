const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateProfile,
  createTestUser,
  getUsers,
  getUser,
} = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", createTestUser);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
