    // routes/orderRoutes.js

    import express from 'express';
    const router = express.Router();

    // Import the order controller functions
    import {
        addOrderItems,
        getOrderById,
        updateOrderToPaid,
        updateOrderToDelivered, // Added
        getMyOrders,
        getOrders, // Added
    } from '../controllers/orderController.js';

    // Import the authentication middleware
    import { protect, admin } from '../middleware/authMiddleware.js';

    // --- Define Order Routes ---

    // Route for creating a new order (Private) and getting all orders (Private/Admin)
    // POST /api/orders - creates a new order
    // GET /api/orders - gets all orders (admin only)
    router.route('/')
        .post(protect, addOrderItems) // Protected: Only logged-in users can create orders
        .get(protect, admin, getOrders); // Protected: Only logged-in admins can view all orders

    // Route for getting logged-in user's orders
    // GET /api/orders/myorders - gets orders for the authenticated user
    router.route('/myorders').get(protect, getMyOrders); // Protected: Only logged-in users can view their own orders

    // Route for getting a single order by ID (Private)
    // GET /api/orders/:id - gets a specific order
    router.route('/:id').get(protect, getOrderById); // Protected: Only logged-in user (owner or admin) can view a specific order

    // Route for updating an order to paid (Private)
    // PUT /api/orders/:id/pay - marks an order as paid
    router.route('/:id/pay').put(protect, updateOrderToPaid); // Protected: Only logged-in user (owner or admin) can mark as paid

    // Route for updating an order to delivered (Private/Admin)
    // PUT /api/orders/:id/deliver - marks an order as delivered
    router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered); // Protected: Only logged-in admins can mark as delivered

    // Export the router so it can be used in your main server.js file
    export default router;
    