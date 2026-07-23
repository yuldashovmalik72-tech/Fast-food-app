const prisma = require("../config/db");

// GET /api/combos — barcha faol combolar (mahsulotlari bilan)
async function getCombos(req, res, next) {
  try {
    const combos = await prisma.combo.findMany({
      where: { isActive: true },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(combos);
  } catch (err) {
    next(err);
  }
}

async function getComboById(req, res, next) {
  try {
    const combo = await prisma.combo.findUnique({
      where: { id: req.params.id },
      include: { items: { include: { product: true } } },
    });
    if (!combo) return res.status(404).json({ message: "Combo topilmadi." });
    res.json(combo);
  } catch (err) {
    next(err);
  }
}

// POST /api/combos (admin)
// body: { name, description, image, price, productIds: [{productId, quantity}] }
async function createCombo(req, res, next) {
  try {
    const { name, description, image, price, products } = req.body;

    if (!products || !Array.isArray(products) || products.length < 2) {
      return res.status(400).json({ message: "Combo kamida 2 ta mahsulotdan iborat bo'lishi kerak." });
    }

    const combo = await prisma.combo.create({
      data: {
        name,
        description,
        image,
        price: Number(price),
        items: {
          create: products.map((p) => ({
            productId: p.productId,
            quantity: p.quantity || 1,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(combo);
  } catch (err) {
    next(err);
  }
}

// PUT /api/combos/:id (admin) — mahsulotlar ro'yxatini to'liq yangilaydi
async function updateCombo(req, res, next) {
  try {
    const { name, description, image, price, isActive, products } = req.body;

    const data = {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(image !== undefined && { image }),
      ...(price !== undefined && { price: Number(price) }),
      ...(isActive !== undefined && { isActive }),
    };

    if (products && Array.isArray(products)) {
      // eskisini o'chirib, yangisini yaratamiz (join table)
      await prisma.comboItem.deleteMany({ where: { comboId: req.params.id } });
      data.items = {
        create: products.map((p) => ({ productId: p.productId, quantity: p.quantity || 1 })),
      };
    }

    const combo = await prisma.combo.update({
      where: { id: req.params.id },
      data,
      include: { items: { include: { product: true } } },
    });

    res.json(combo);
  } catch (err) {
    next(err);
  }
}

async function deleteCombo(req, res, next) {
  try {
    await prisma.combo.delete({ where: { id: req.params.id } });
    res.json({ message: "Combo o'chirildi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCombos, getComboById, createCombo, updateCombo, deleteCombo };
