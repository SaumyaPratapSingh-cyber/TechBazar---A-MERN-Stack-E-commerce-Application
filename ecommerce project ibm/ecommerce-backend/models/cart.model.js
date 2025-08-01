// C:\Users\Saumya Pratap Singh\OneDrive - United College of Engineering & Research\Desktop\ecommerce project ibm\ecommerce-backend\models\cart.model.js

// This file defines the structure of a user's shopping cart in MongoDB using Mongoose.

import mongoose from 'mongoose'; // Import mongoose for schema definition

// Define the schema for individual items within the cart
const CartItemSchema = new mongoose.Schema({
    // Reference to the Product model
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Links to your Product model
    },
    // Name of the product (denormalized for easier display, can be updated from product ref)
    name: {
        type: String,
        required: true
    },
    // Image of the product (denormalized)
    image: {
        type: String,
        required: true
    },
    // Price of the product at the time it was added to the cart (denormalized)
    price: {
        type: Number,
        required: true
    },
    // Quantity of this product in the cart
    qty: {
        type: Number,
        required: true,
        default: 1
    },
}, {
    _id: false // Do not create a default _id for subdocuments (cart items)
});

// Define the main Cart schema
const CartSchema = new mongoose.Schema({
    // Reference to the User who owns this cart
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User', // Links to your User model
        unique: true // Ensures each user has only one cart
    },
    // Array of items in the cart, using the CartItemSchema
    items: [CartItemSchema],
    // Total price of all items in the cart
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
}, {
    timestamps: true // Adds 'createdAt' and 'updatedAt' fields automatically
});

// Export the Cart model so it can be used in other parts of your application.
const Cart = mongoose.model('Cart', CartSchema);
export default Cart;
