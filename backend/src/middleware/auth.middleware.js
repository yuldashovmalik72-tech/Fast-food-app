const jwt = require("jsonwebtoken");

// Foydalanuvchi tizimga kirganligini tekshiruvchi middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token topilmadi. Iltimos, tizimga kiring." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token yaroqsiz yoki muddati o'tgan." });
  }
}

// Faqat ADMIN kirishi mumkin bo'lgan yo'llar uchun
function adminMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Ruxsat yo'q. Faqat adminlar uchun." });
  }
  next();
}

module.exports = { authMiddleware, adminMiddleware };
