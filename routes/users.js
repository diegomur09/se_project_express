const router = require("express").Router();
const auth = require("../middlewares/auth");
const { getCurrentUser, updateProfile } = require("../controllers/users");

// Protected user routes (authentication required)
router.get("/me", auth, getCurrentUser);     // Get own profile
router.patch("/me", auth, updateProfile);    // Update own profile

module.exports = router;
