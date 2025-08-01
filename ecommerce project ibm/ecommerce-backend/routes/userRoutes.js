// routes/userRoutes.js

import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    getUsers,
    deleteUser,
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

// Define routes for user operations
// POST /api/users - Register a new user (Public)
// GET /api/users - Get all users (Admin only)
router.route('/')
    .post(registerUser)
    .get(protect, admin, getUsers);

// POST /api/users/login - Authenticate user & get token (Public)
router.post('/login', authUser);

// DELETE /api/users/:id - Delete a user (Admin only)
router.route('/:id').delete(protect, admin, deleteUser);

export default router;
