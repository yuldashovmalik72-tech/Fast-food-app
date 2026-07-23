const prisma = require("../config/db");

// GET /api/products?search=&category=&sort=price_asc|price_desc|rating&page=1&limit=12
async function getProducts(req, res, next) {
  try {
    const { search, category, sort, page = 1, limit = 12 } = req.query;

    const where = {
      isAvailable: true,
      ...(search && {
        name: { contains: search, mode: "insensitive" },
      }),
      ...(category && {
        category: { slug: category },
      }),
    };

    let orderBy = { createdAt: "desc" };
    if (sort === "price_asc") orderBy = { price: "asc" };
    if (sort === "price_desc") orderBy = { price: "desc" };
    if (sort === "rating") orderBy = { rating: "desc" };

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip,
        take: Number(limit),
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({ products, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
}

async function getProductById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ message: "Mahsulot topilmadi." });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

// Admin: create/update/delete
async function createProduct(req, res, next) {
  try {
    const { name, description, price, image, categoryId, rating } = req.body;
    const product = await prisma.product.create({
      data: { name, description, price: Number(price), image, categoryId, rating: rating ? Number(rating) : undefined },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

async function updateProduct(req, res, next) {
  try {
    const { name, description, price, image, categoryId, isAvailable, rating } = req.body;
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: Number(price) }),
        ...(image !== undefined && { image }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(rating !== undefined && { rating: Number(rating) }),
      },
    });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

async function deleteProduct(req, res, next) {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ message: "Mahsulot o'chirildi." });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
