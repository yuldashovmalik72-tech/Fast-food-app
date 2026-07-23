const router = require("express").Router();
const {
  getCombos,
  getComboById,
  createCombo,
  updateCombo,
  deleteCombo,
} = require("../controllers/combo.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

router.get("/", getCombos);
router.get("/:id", getComboById);
router.post("/", authMiddleware, adminMiddleware, createCombo);
router.put("/:id", authMiddleware, adminMiddleware, updateCombo);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCombo);

module.exports = router;
