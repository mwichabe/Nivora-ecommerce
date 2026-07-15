// Promote a user to admin (creating the account if it doesn't exist yet).
// Usage:
//   node prisma/makeAdmin.js <email> [password]
// If the user exists, they are promoted to admin (password unchanged).
// If not, a new admin account is created with the given password
// (defaults to "admin12345" — change it after first login).
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  const password = process.argv[3] || "admin12345";

  if (!email) {
    console.error("Usage: node prisma/makeAdmin.js <email> [password]");
    process.exit(1);
  }

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({ where: { email }, data: { isAdmin: true } });
    console.log(`✓ Existing user promoted to admin: ${email}`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email,
        phone: "0700000000",
        password: passwordHash,
        isAdmin: true,
      },
    });
    console.log(`✓ New admin account created: ${email}`);
    console.log(`  Temporary password: ${password}  (change it after logging in)`);
  }
}

main()
  .catch((e) => {
    console.error("make-admin failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
