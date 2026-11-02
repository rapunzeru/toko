require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum tersedia di file .env');
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.json(products);
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    res.status(500).json({
      error: 'Gagal mengambil data produk',
    });
  }
});

const server = app.listen(5000, () => {
  console.log('Backend start http://localhost:5000');
});

async function shutdown() {
  await prisma.$disconnect();

  server.close(() => {
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);