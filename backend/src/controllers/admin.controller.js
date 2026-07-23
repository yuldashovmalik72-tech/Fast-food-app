const prisma = require("../config/db");

// GET /api/admin/stats — dashboard uchun umumiy statistika
async function getStats(req, res, next) {
  try {
    const [totalOrders, totalUsers, totalProducts, pendingOrders, revenueAgg] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "USER" } }),
      prisma.product.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.aggregate({
        _sum: { totalPrice: true },
        where: { status: "COMPLETED" },
      }),
    ]);

    res.json({
      totalOrders,
      totalUsers,
      totalProducts,
      pendingOrders,
      totalRevenue: revenueAgg._sum.totalPrice || 0,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStats };
