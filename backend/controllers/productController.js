const { getAllProducts } = require('../models/productModel');

async function getProducts(req, res) {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Gagal mengambil produk:', error);
    res.status(500).json({
      error: 'Gagal mengambil data produk',
    });
  }
}

module.exports = { getProducts };

