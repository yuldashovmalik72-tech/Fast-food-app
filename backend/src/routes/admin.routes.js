const router = require("express").Router();
const { getStats } = require("../controllers/admin.controller");
const { authMiddleware, adminMiddleware } = require("../middleware/auth.middleware");

router.get("/stats", authMiddleware, adminMiddleware, getStats);

module.exports = router;
