// Server Entry Point
// Initializes Express, middleware, API route mounting, and graceful shutdown handlers
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const { prisma } = require('./models/productModel');

// Validate critical environment variables
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not configured in .env file');
}

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);

// Start HTTP Server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});

// Graceful Shutdown
// Disconnects Prisma client and terminates the HTTP server safely on termination signals
async function shutdown() {
  console.log('Initiating graceful shutdown...');
  await prisma.$disconnect();

  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
