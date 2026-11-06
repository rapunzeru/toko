// Product Routes
// Defines API endpoints for product resources and maps them to controller handlers
// Base Path: /api/products
const express = require('express');
const { getProducts, addProduct } = require('../controllers/productController');

const router = express.Router();

// GET /api/products - Retrieve product list
router.get('/', getProducts);

// POST /api/products - Add a new product
router.post('/', addProduct);

module.exports = router;
