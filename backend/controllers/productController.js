// Product Controller
// Handles incoming HTTP requests, validates request payloads, and delegates
// data manipulation to the Product Model
const { getAllProducts, createProduct } = require('../models/productModel');

// GET /api/products
// Fetch all available products
async function getProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Failed to retrieve products:', error);
    res.status(500).json({
      error: 'Failed to retrieve product data from database',
    });
  }
}

// POST /api/products
// Validate request body and insert a new product record
async function addProduct(req, res) {
  try {
    const { nama, harga, stok } = req.body;

    // Field validation: Product name is required
    if (!nama || nama.trim() === '') {
      return res.status(400).json({ error: 'Product name cannot be empty.' });
    }

    // Field validation: Price must be a non-negative number
    if (harga === undefined || harga === null || isNaN(Number(harga)) || Number(harga) < 0) {
      return res.status(400).json({ error: 'Price must be a valid number greater than or equal to 0.' });
    }

    const newProduct = await createProduct({
      nama: nama.trim(),
      harga: Math.round(Number(harga)),
      stok: stok !== undefined && stok !== '' ? Math.max(0, parseInt(stok, 10)) : 0,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Failed to create product:', error);
    res.status(500).json({
      error: 'Failed to insert product into database',
    });
  }
}

module.exports = { getProducts, addProduct };
