const prisma = require("../config/db");

// POST /api/orders
// body: { items: [{productId, quantity}], address, phone, note, promoCode }
async function createOrder(req, res, next) {
  try {
    const { items, address, phone, note, promoCode } = req.body;
    const userId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Savat bo'sh. Mahsulot tanlang." });
    }
    if (!address || !phone) {
      return res.status(400).json({ message: "Manzil va telefon raqami kiritilishi shart." });
    }

    // Narxlarni bazadan olib, umumiy summani xavfsiz hisoblaymiz
    const productIds = items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    let total = 0;
    const orderItemsData = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw { status: 404, message: `Mahsulot topilmadi: ${item.productId}` };
      total += product.price * item.quantity;
      return { productId: item.productId, quantity: item.quantity, price: product.price };
    });

    // Promokodni tekshirish va chegirmani qo'llash
    let promotion = null;
    if (promoCode) {
      promotion = await prisma.promotion.findUnique({ where: { code: promoCode } });
      if (promotion && promotion.isActive) {
        if (promotion.discountType === "PERCENT") {
          total -= (total * promotion.discountValue) / 100;
        } else {
          total -= promotion.discountValue;
        }
        if (total < 0) total = 0;
      } else {
        promotion = null;
      }
    }

    const order = await prisma.order.create({
      data: {
        userId,
        address,
        phone,
        note,
        totalPrice: Number(total.toFixed(2)),
        promotionId: promotion ? promotion.id : null,
        items: { create: orderItemsData },
      },
      include: { items: { include: { product: true } }, promotion: true },
    });

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/my — foydalanuvchining buyurtmalar tarixi
async function getMyOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, promotion: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// GET /api/orders (admin) — barcha buyurtmalar
async function getAllOrders(req, res, next) {
  try {
    const { status } = req.query;
    const orders = await prisma.order.findMany({
      where: status ? { status } : {},
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, name: true, email: true, phone: true } },
        promotion: true,
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/orders/:id/status (admin)
async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const validStatuses = ["PENDING", "PREPARING", "DELIVERING", "COMPLETED", "CANCELLED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Noto'g'ri status." });
    }
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(order);
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getMyOrders, getAllOrders, updateOrderStatus };
