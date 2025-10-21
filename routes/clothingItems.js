const router = require("express").Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  likeItem,
  unlikeItem,
  deleteItem,
} = require("../controllers/clothingItems");

// Public route - no auth required
router.get("/", getItems);

// Protected routes - auth required
router.post("/", auth, createItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
