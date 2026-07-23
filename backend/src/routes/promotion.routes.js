const router = require("express").Router();
const {
  getPromotions,
  validatePromoCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
} = require("../controllers/promotion.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

router.get("/", authMiddleware, adminMiddleware, getPromotions);
router.post("/validate", validatePromoCode);
router.post("/", authMiddleware, adminMiddleware, createPromotion);
router.put("/:id", authMiddleware, adminMiddleware, updatePromotion);
router.delete("/:id", authMiddleware, adminMiddleware, deletePromotion);

module.exports = router;
