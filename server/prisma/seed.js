// Seeds an admin user and a starter product catalog with placeholder images.
// Run with: npm run seed   (or: node prisma/seed.js)
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const { productImages } = require("./images");

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    name: "Classic Oxford Shirt",
    description: "Crisp long-sleeve Oxford shirt in premium combed cotton. A wardrobe staple with a tailored fit.",
    price: 2500,
    stock: 25,
    category: "Top Wear",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    name: "Slim Fit Chino Trousers",
    description: "Versatile slim-fit chinos with a touch of stretch for all-day comfort. Smart yet casual.",
    price: 3200,
    stock: 18,
    category: "Bottom Wear",
    sizes: ["M", "L", "XL", "XXL"],
  },
  {
    name: "Merino Wool Crew Sweater",
    description: "Lightweight 100% merino wool crew-neck sweater. Breathable warmth with a refined finish.",
    price: 4500,
    stock: 12,
    category: "Men",
    sizes: ["S", "M", "L"],
  },
  {
    name: "Structured Blazer",
    description: "A sharp single-breasted blazer with structured shoulders. Elevates any occasion.",
    price: 8900,
    stock: 6,
    category: "Men",
    sizes: ["M", "L", "XL"],
  },
  {
    name: "Silk Wrap Dress",
    description: "An elegant silk wrap dress with a flattering silhouette and adjustable tie waist.",
    price: 6700,
    stock: 9,
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
  },
  {
    name: "High-Waist Tailored Trousers",
    description: "Flowing high-waist trousers with a clean drape. Effortlessly polished, day to night.",
    price: 3900,
    stock: 14,
    category: "Women",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    name: "Leather Weekender Bag",
    description: "Full-grain leather weekender with brass hardware. Ages beautifully, built to last.",
    price: 12500,
    stock: 4,
    category: "Accessories",
    sizes: [],
  },
  {
    name: "Minimalist Steel Watch",
    description: "A refined 40mm stainless-steel watch with a sapphire crystal and mesh strap.",
    price: 9800,
    stock: 3,
    category: "Accessories",
    sizes: [],
  },
];

async function main() {
  console.log("🌱 Seeding database…");

  // ── Admin user ──
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nivora.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { isAdmin: true },
    create: {
      name: process.env.ADMIN_NAME || "Store Admin",
      email: adminEmail,
      phone: process.env.ADMIN_PHONE || "0700000000",
      password: passwordHash,
      isAdmin: true,
    },
  });
  console.log(`✓ Admin user ready: ${admin.email}`);

  // ── Products ──
  let created = 0;
  for (const p of PRODUCTS) {
    const existing = await prisma.product.findUnique({ where: { name: p.name } });
    if (existing) {
      console.log(`  • skipped (exists): ${p.name}`);
      continue;
    }
    await prisma.product.create({
      data: { ...p, imageUrls: productImages(p.name, p.category), userId: admin.id },
    });
    created++;
    console.log(`  ✓ created: ${p.name}`);
  }

  console.log(`🌱 Done. ${created} new product(s) seeded.`);
  console.log(`\nAdmin login → email: ${adminEmail}  password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
