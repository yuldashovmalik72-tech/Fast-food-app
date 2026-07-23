const prisma = require("../config/db");

async function getCategories(req, res, next) {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, slug, icon } = req.body;
    const category = await prisma.category.create({ data: { name, slug, icon } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.json({ message: "Kategoriya o'chirildi." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, createCategory, deleteCategory };
