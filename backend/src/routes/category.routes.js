const router = require("express").Router();
const { getCategories, createCategory, deleteCategory } = require("../controllers/category.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

router.get("/", getCategories);
router.post("/", authMiddleware, adminMiddleware, createCategory);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);

module.exports = router;
