// C:\Users\Saumya Pratap Singh\OneDrive - United College of Engineering & Research\Desktop\ecommerce project ibm\ecommerce-backend\middleware\authMiddleware.js

import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

// REMOVED: const JWT_SECRET = process.env.JWT_SECRET; // This line is removed from here

const protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // --- DEBUG LOGS START ---
            console.log('--- Auth Middleware Debug ---');
            console.log('Token received:', token);
            // NOW ACCESSING JWT_SECRET directly inside the function
            console.log('JWT_SECRET being used for verification (from process.env):', process.env.JWT_SECRET);
            // --- DEBUG LOGS END ---

            // FIX: Use process.env.JWT_SECRET directly here
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // --- DEBUG LOGS START ---
            console.log('Token successfully decoded. Decoded payload:', decoded);
            // --- DEBUG LOGS END ---

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }

            next();

        } catch (error) {
            // --- DEBUG LOGS START ---
            console.error('Token verification failed. Error details:', error.message);
            // --- DEBUG LOGS END ---
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403);
        throw new Error('Not authorized as an admin');
    }
};

export { protect, admin };
