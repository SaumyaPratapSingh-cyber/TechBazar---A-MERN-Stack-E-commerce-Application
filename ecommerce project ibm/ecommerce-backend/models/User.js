// models/User.js

import mongoose from 'mongoose'; // Import Mongoose to define the schema
import bcrypt from 'bcryptjs';   // Import bcrypt for password hashing

// Define the User Schema
const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true, // Name is a required field
        },
        email: {
            type: String,
            required: true,   // Email is required
            unique: true,     // Email must be unique for each user
            lowercase: true,  // Store email in lowercase
            trim: true,       // Remove whitespace from email
            match: [/.+@.+\..+/, 'Please enter a valid email address'], // Basic email format validation
        },
        password: {
            type: String,
            required: true, // Password is required
        },
        isAdmin: {
            type: Boolean,
            required: true,
            default: false, // Default role is a regular user, not admin
        },
        shippingAddress: { // Added based on your checkout process requirement
            address: { type: String },
            city: { type: String },
            postalCode: { type: String },
            country: { type: String },
            mobileNumber: { type: String }, // Added based on your checkout process requirement
        },
    },
    {
        timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields
    }
);

// --- Schema Middleware and Methods ---

// Method to compare entered password with hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
    // 'this.password' refers to the hashed password stored in the user document
    return await bcrypt.compare(enteredPassword, this.password);
};

// Pre-save middleware to hash the password before saving a new user or updating password
userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) {
        next(); // Move to the next middleware or save operation
    }

    // Generate a salt (random string) to hash the password
    const salt = await bcrypt.genSalt(10); // 10 is the number of salt rounds (higher = more secure, slower)

    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);
    next(); // Move to the next middleware or save operation
});

// Create the User model from the schema, or use the existing one if it's already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User; // Export the User model for use in other files
