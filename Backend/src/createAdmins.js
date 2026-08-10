const bcrypt = require("bcrypt");
require("dotenv").config();

const prisma = require("../src/lib/prisma");

async function createAdmin() {
  const email = "admin@impilomag.co.za";
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    throw new Error("ADMIN_PASSWORD is missing from .env");
  }

  const existing = await prisma.user.findUnique({
    where: { email }
  });

  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      email,
      passwordHash,
      username: "impilo_admin",
      displayName: "Impilo Administrator",
      role: "ADMIN"
    }
  });

  console.log("Admin created:", admin.email);
}

createAdmin()
  .catch((error) => {
    console.error("Admin creation failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });