// models/Product.js

import mongoose from 'mongoose';

// Define the schema for product reviews
const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId, // Link to the User who wrote the review
            required: true,
            ref: 'User', // Reference the 'User' model
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt for reviews
    }
);

// Define the main Product Schema
const productSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Link to the User who created this product (e.g., admin)
            required: true,
            ref: 'User', // Reference the 'User' model
        },
        name: {
            type: String,
            required: true,
        },
        image: {
            type: String, // URL or path to the product image
            required: true,
        },
        brand: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        reviews: [reviewSchema], // Array of reviewSchema objects
        rating: {
            type: Number,
            required: true,
            default: 0, // Default rating
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0, // Default number of reviews
        },
        price: {
            type: Number,
            required: true,
            default: 0, // Default price
        },
        countInStock: {
            type: Number,
            required: true,
            default: 0, // Default stock quantity
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt for products
    }
);

// Create the Product model from the schema, or use the existing one if it's already compiled
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product; // Export the Product model
