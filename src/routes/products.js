const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');

// Apply authentication to all product routes
router.use(authMiddleware);

// Create a new product
router.post('/', productController.createProduct);

// Batch create/update products
router.post('/batch', productController.batchProducts);

// Check if product exists by fingerprint
router.get('/by-fingerprint/:fingerprint', productController.getProductByFingerprint);

// Update a product
router.put('/:id', productController.updateProduct);

module.exports = router;
