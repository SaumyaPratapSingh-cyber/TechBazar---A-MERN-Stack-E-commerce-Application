// routes/productRoutes.js

import express from 'express';
const router = express.Router();
import {
    getProducts,
    getProductById,
    createProduct
} from '../controllers/productController.js'; // Import product controller functions
// Removed createProductReview as it's not in productController.js yet

// Define routes for products
// GET /api/products - fetch all products
// POST /api/products - create a new product (Admin only, will add middleware later)
router.route('/').get(getProducts).post(createProduct);

// GET /api/products/:id - fetch a single product by ID
router.route('/:id').get(getProductById);
// Removed route for product reviews as createProductReview is not implemented yet
// router.route('/:id/reviews').post(protect, createProductReview);

export default router;
