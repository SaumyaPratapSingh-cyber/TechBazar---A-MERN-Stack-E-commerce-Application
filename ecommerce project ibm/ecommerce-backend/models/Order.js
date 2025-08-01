// models/Order.js

import mongoose from 'mongoose';

// Schema for individual items within an order
const orderItemSchema = mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    product: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        required: true,
        ref: 'Product',
    },
});

// Schema for shipping address
const shippingAddressSchema = mongoose.Schema({
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    mobileNumber: { type: String, required: true }, // Added based on your initial requirement
});

// Main Order Schema
const orderSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId, // Reference to the User who placed the order
            required: true,
            ref: 'User',
        },
        orderItems: [orderItemSchema], // Array of items in the order
        shippingAddress: {
            type: shippingAddressSchema, // Embedded shipping address
            required: true,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentResult: { // Details from payment gateway (e.g., PayPal, Stripe)
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
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
        deliveryType: { // Added based on your initial requirement (week/now)
            type: String,
            required: false, // Not strictly required if default is implied
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

// Create the Order model from the schema, or use the existing one if it's already compiled
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default Order;
