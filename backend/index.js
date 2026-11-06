require('dotenv').config();

const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const { prisma } = require('./models/productModel');

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL belum tersedia di file .env');
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/products', productRoutes);

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
