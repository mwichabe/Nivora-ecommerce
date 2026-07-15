// Regenerates placeholder images (3 per product) for every product already
// in the database. Safe to run repeatedly.
// Usage: node prisma/fixImages.js   (or: npm run fix-images)
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const { productImages } = require("./images");

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Updating images for ${products.length} product(s)…`);

  for (const p of products) {
    await prisma.product.update({
      where: { id: p.id },
      data: { imageUrls: productImages(p.name, p.category) },
    });
    console.log(`  ✓ ${p.name} → 3 images`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error("fix-images failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
