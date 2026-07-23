const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed boshlandi...");

  // Admin foydalanuvchi
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@fastfood.uz" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@fastfood.uz",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  // Kategoriyalar
  const categoriesData = [
    { name: "Burgers", slug: "burgers", icon: "Beef" },
    { name: "Pizzas", slug: "pizzas", icon: "Pizza" },
    { name: "Drinks", slug: "drinks", icon: "CupSoda" },
    { name: "Combos", slug: "combos", icon: "Package" },
    { name: "Desserts", slug: "desserts", icon: "IceCream" },
  ];

  const categories = {};
  for (const c of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = cat;
  }

  // Mahsulotlar
  const productsData = [
    { name: "Classic Cheeseburger", price: 28000, categorySlug: "burgers", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500", rating: 4.7 },
    { name: "Double Beef Burger", price: 38000, categorySlug: "burgers", image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500", rating: 4.8 },
    { name: "Chicken Burger", price: 25000, categorySlug: "burgers", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500", rating: 4.5 },
    { name: "Pepperoni Pizza", price: 55000, categorySlug: "pizzas", image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500", rating: 4.9 },
    { name: "Margherita Pizza", price: 48000, categorySlug: "pizzas", image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500", rating: 4.6 },
    { name: "Coca-Cola 0.5L", price: 8000, categorySlug: "drinks", image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500", rating: 4.4 },
    { name: "Fresh Orange Juice", price: 12000, categorySlug: "drinks", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500", rating: 4.5 },
    { name: "Chocolate Sundae", price: 15000, categorySlug: "desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500", rating: 4.7 },
    { name: "French Fries", price: 14000, categorySlug: "burgers", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500", rating: 4.6 },
  ];

  const createdProducts = [];
  for (const p of productsData) {
    const prod = await prisma.product.create({
      data: {
        name: p.name,
        price: p.price,
        image: p.image,
        rating: p.rating,
        categoryId: categories[p.categorySlug].id,
        description: `${p.name} — mazali va yangi tayyorlangan.`,
      },
    });
    createdProducts.push(prod);
  }

  // Combo namuna
  const burger = createdProducts.find((p) => p.name === "Classic Cheeseburger");
  const fries = createdProducts.find((p) => p.name === "French Fries");
  const cola = createdProducts.find((p) => p.name === "Coca-Cola 0.5L");

  await prisma.combo.create({
    data: {
      name: "Combo #1 — Burger Set",
      description: "Cheeseburger + Fries + Cola",
      price: 42000,
      image: "https://images.unsplash.com/photo-1626078436898-baa1a2306d38?w=500",
      items: {
        create: [
          { productId: burger.id, quantity: 1 },
          { productId: fries.id, quantity: 1 },
          { productId: cola.id, quantity: 1 },
        ],
      },
    },
  });

  // Promo kod namuna
  await prisma.promotion.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      title: "Yangi mijozlar uchun 10% chegirma",
      discountType: "PERCENT",
      discountValue: 10,
    },
  });

  console.log("✅ Seed muvaffaqiyatli yakunlandi!");
  console.log("👤 Admin login: admin@fastfood.uz / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
