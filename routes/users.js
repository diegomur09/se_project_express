const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateProfile,
  createTestUser,
  getUsers,
  getUser,
} = require("../controllers/users");

// Test routes (for backwards compatibility with tests)
router.get("/", getUsers); // Get all users (for tests)
router.get("/:userId", getUser); // Get user by ID (for tests)
router.post("/", createTestUser); // Create user (for tests)

// Protected user routes (authentication required)
router.get("/me", auth, getCurrentUser); // Get own profile
router.patch("/me", auth, updateProfile); // Update own profile

module.exports = router;
