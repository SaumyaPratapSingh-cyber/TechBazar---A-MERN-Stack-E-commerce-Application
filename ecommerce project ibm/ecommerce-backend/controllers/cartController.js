// controllers/cartController.js

import asyncHandler from 'express-async-handler'; // For handling async errors
import Cart from '../models/Cart.js';           // Import the Cart model
import Product from '../models/Product.js';     // Corrected import path for Product model

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private (User must be logged in)
 */
const getUserCart = asyncHandler(async (req, res) => {
    // Find the cart for the logged-in user
    // Populate the 'product' field in cart items to get full product details
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name image price countInStock');

    if (cart) {
        res.json(cart);
    } else {
        // If no cart exists for the user, return an empty cart
        res.json({ user: req.user._id, items: [], totalPrice: 0 });
    }
});

/**
 * @desc    Add item to cart or update quantity
 * @route   POST /api/cart
 * @access  Private (User must be logged in)
 */
const addItemToCart = asyncHandler(async (req, res) => {
    const { productId, qty } = req.body; // Expect productId and quantity

    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    // Check if product is in stock
    if (product.countInStock < qty) {
        res.status(400);
        throw new Error(`Not enough stock for ${product.name}. Available: ${product.countInStock}`);
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        // Cart exists for user
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Product already in cart, update quantity
            cart.items[itemIndex].qty = qty;
            // Ensure updated quantity doesn't exceed stock
            if (cart.items[itemIndex].qty > product.countInStock) {
                 res.status(400);
                 throw new Error(`Cannot add ${qty} of ${product.name}. Only ${product.countInStock} available.`);
            }
        } else {
            // Product not in cart, add new item
            cart.items.push({
                product: productId,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: qty,
            });
        }
    } else {
        // No cart for user, create a new one
        cart = new Cart({
            user: req.user._id,
            items: [{
                product: productId,
                name: product.name,
                image: product.image,
                price: product.price,
                qty: qty,
            }],
        });
    }

    const updatedCart = await cart.save(); // Save the cart (totalPrice will be calculated by pre-save middleware)
    res.status(200).json(updatedCart);
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private (User must be logged in)
 */
const removeItemFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found for this user');
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(item => item.product.toString() !== productId);

    const updatedCart = await cart.save(); // Save the cart (totalPrice will be recalculated)
    res.status(200).json(updatedCart);
});

// Export the controller functions
export {
    getUserCart,
    addItemToCart,
    removeItemFromCart,
};
