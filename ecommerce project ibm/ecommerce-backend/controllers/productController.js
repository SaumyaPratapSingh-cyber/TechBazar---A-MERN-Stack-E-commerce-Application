// controllers/productController.js

import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * @desc    Fetch all products with search and filter
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
    // Extract query parameters for search and filter
    const keyword = req.query.keyword
        ? { name: { $regex: req.query.keyword, $options: 'i' } } // Case-insensitive search
        : {};

    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Infinity;

    // Build the filter object for MongoDB
    const priceFilter = { price: { $gte: minPrice, $lte: maxPrice } };

    // Find products based on keyword and price filters
    const products = await Product.find({ ...keyword, ...priceFilter });

    res.json(products);
});

/**
 * @desc    Fetch single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'Sample Name',
        price: 0,
        user: req.user._id,
        image: '/images/sample.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});

// Export the controller functions
export { getProducts, getProductById, createProduct };
