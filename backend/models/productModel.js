// Product Model (Data Access Layer)
// Manages database operations for the Product entity using Prisma ORM with pg adapter
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// Initialize Prisma PostgreSQL adapter
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

// Retrieve all products from the database
async function getAllProducts() {
  return await prisma.product.findMany();
}

// Create a new product entry in the database
// Expects data: { nama: string, harga: number|string, stok?: number|string }
async function createProduct(data) {
  return await prisma.product.create({
    data: {
      nama: data.nama,
      harga: Number(data.harga),
      stok: Number(data.stok) || 0,
    },
  });
}

module.exports = { prisma, getAllProducts, createProduct };
