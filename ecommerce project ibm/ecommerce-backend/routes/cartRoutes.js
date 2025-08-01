// C:\Users\Saumya Pratap Singh\OneDrive - United College of Engineering & Research\Desktop\ecommerce project ibm\ecommerce-backend\routes\cartRoutes.js

// This file defines the API endpoints (routes) for the shopping cart.

import express from 'express';
const router = express.Router(); // Create an Express router instance

// Import the cart controller functions we just created
import {
    getUserCart,
    addItemToCart,
    removeItemFromCart
} from '../controllers/cartController.js'; // Adjust path if necessary

// Import the authentication middleware to protect these routes
import { protect } from '../middleware/authMiddleware.js'; // Cart operations are private to the user

// --- Define Cart Routes ---

// Route for fetching the user's cart (GET) and adding/updating items (POST)
// GET /api/cart - fetches the authenticated user's cart
// POST /api/cart - adds a new item to the cart or updates an existing item's quantity
router.route('/')
    .get(protect, getUserCart)   // Protected: Only logged-in users can view their cart
    .post(protect, addItemToCart); // Protected: Only logged-in users can add/update items in their cart

// Route for removing a specific item from the cart
// DELETE /api/cart/:productId - removes a product from the authenticated user's cart
router.route('/:productId')
    .delete(protect, removeItemFromCart); // Protected: Only logged-in users can remove items from their cart

// Export the router so it can be used in your main server.js file
export default router;
