// models/Cart.js

import mongoose from 'mongoose';

// Define the schema for individual items within the cart
const cartItemSchema = mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        required: true,
        ref: 'Product',
    },
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 }, // Quantity of this product in the cart
});

// Define the main Cart Schema
const cartSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User who owns this cart
            required: true,
            ref: 'User',
            unique: true, // A user should only have one cart
        },
        items: [cartItemSchema], // Array of cart items
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Pre-save middleware to calculate total price before saving the cart
cartSchema.pre('save', function (next) {
    this.totalPrice = this.items.reduce((acc, item) => acc + item.qty * item.price, 0);
    next();
});

// Create the Cart model from the schema, or use the existing one if it's already compiled
const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

export default Cart;
