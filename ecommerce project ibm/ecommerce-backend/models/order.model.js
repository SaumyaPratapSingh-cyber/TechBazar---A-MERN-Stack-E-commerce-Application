// C:\Users\Saumya Pratap Singh\OneDrive - United College of Engineering & Research\Desktop\ecommerce project ibm\ecommerce-backend\models\order.model.js

// This file defines the structure of an order in MongoDB using Mongoose.

import mongoose from 'mongoose'; // Import mongoose for schema definition

// Define the schema for individual items within an order
const OrderItemSchema = new mongoose.Schema({
    // Name of the product at the time of order
    name: {
        type: String,
        required: true
    },
    // Quantity of this product in the order
    qty: {
        type: Number,
        required: true
    },
    // Image of the product at the time of order
    image: {
        type: String,
        required: true
    },
    // Price of the product at the time of order
    price: {
        type: Number,
        required: true
    },
    // Reference to the actual Product model (for historical lookup, if needed)
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product' // Links to your Product model
    },
});

// Define the main Order schema
const OrderSchema = new mongoose.Schema({
    // Reference to the User who placed this order
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Links to your User model
    },
    // Array of items in this order, using the OrderItemSchema
    orderItems: [OrderItemSchema],
    // Shipping address details
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    // Payment method used (e.g., 'PayPal', 'Stripe', 'Credit Card')
    paymentMethod: {
        type: String,
        required: true,
    },
    // Details received from the payment gateway (e.g., transaction ID, status)
    paymentResult: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    // Calculated prices
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    // Order status flags
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true // Adds 'createdAt' and 'updatedAt' fields automatically
});

// Export the Order model so it can be used in other parts of your application.
const Order = mongoose.model('Order', OrderSchema);
export default Order;
