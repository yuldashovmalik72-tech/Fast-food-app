const prisma = require("../config/db");

async function getFavorites(req, res, next) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { category: true } } },
    });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
}

// POST /api/favorites/:productId — toggle (qo'shish/o'chirish)
async function toggleFavorite(req, res, next) {
  try {
    const { productId } = req.params;
    const existing = await prisma.favorite.findUnique({
      where: { userId_productId: { userId: req.user.id, productId } },
    });

    if (existing) {
      await prisma.favorite.delete({ where: { id: existing.id } });
      return res.json({ favorited: false, message: "Sevimlilardan olib tashlandi." });
    }

    await prisma.favorite.create({ data: { userId: req.user.id, productId } });
    res.json({ favorited: true, message: "Sevimlilarga qo'shildi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getFavorites, toggleFavorite };
