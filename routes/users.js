const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  createUser,
  getCurrentUser,
  updateProfile,
  getUsers,
  getUser,
} = require("../controllers/users");

// TEMPORARY: These routes are for testing only
router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
