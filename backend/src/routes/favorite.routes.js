const router = require("express").Router();
const { getFavorites, toggleFavorite } = require("../controllers/favorite.controller");
const { authMiddleware } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getFavorites);
router.post("/:productId", authMiddleware, toggleFavorite);

module.exports = router;
