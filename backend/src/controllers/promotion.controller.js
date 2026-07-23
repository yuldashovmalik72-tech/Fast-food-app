const prisma = require("../config/db");

async function getPromotions(req, res, next) {
  try {
    const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: "desc" } });
    res.json(promotions);
  } catch (err) {
    next(err);
  }
}

// POST /api/promotions/validate  { code }
async function validatePromoCode(req, res, next) {
  try {
    const { code } = req.body;
    const promo = await prisma.promotion.findUnique({ where: { code } });

    if (!promo || !promo.isActive) {
      return res.status(404).json({ message: "Promokod topilmadi yoki faol emas." });
    }
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Promokod muddati o'tgan." });
    }

    res.json(promo);
  } catch (err) {
    next(err);
  }
}

async function createPromotion(req, res, next) {
  try {
    const { code, title, description, discountType, discountValue, expiresAt } = req.body;
    const promo = await prisma.promotion.create({
      data: {
        code,
        title,
        description,
        discountType,
        discountValue: Number(discountValue),
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });
    res.status(201).json(promo);
  } catch (err) {
    next(err);
  }
}

async function updatePromotion(req, res, next) {
  try {
    const { title, description, discountType, discountValue, isActive, expiresAt } = req.body;
    const promo = await prisma.promotion.update({
      where: { id: req.params.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(discountType !== undefined && { discountType }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(isActive !== undefined && { isActive }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
      },
    });
    res.json(promo);
  } catch (err) {
    next(err);
  }
}

async function deletePromotion(req, res, next) {
  try {
    await prisma.promotion.delete({ where: { id: req.params.id } });
    res.json({ message: "Aksiya o'chirildi." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPromotions,
  validatePromoCode,
  createPromotion,
  updatePromotion,
  deletePromotion,
};
