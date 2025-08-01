// server.js

// Import necessary modules
import express from 'express'; // Web framework for Node.js
import dotenv from 'dotenv';   // For loading environment variables from .env file
import mongoose from 'mongoose'; // ODM (Object Data Modeling) for MongoDB
import userRoutes from './routes/userRoutes.js'; // Import user routes
import productRoutes from './routes/productRoutes.js'; // Import product routes
import cartRoutes from './routes/cartRoutes.js'; // Import cart routes
import orderRoutes from './routes/orderRoutes.js'; // Import order routes
import cors from 'cors'; // Import cors middleware

// Load environment variables from .env file
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Enable CORS for all origins (for development)
app.use(cors());

// Get port and MongoDB URI from environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB using Mongoose
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // Log any connection errors and exit the process
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with a non-zero code to indicate an error
    }
};

// Call the connectDB function to establish database connection
connectDB();

// Basic route for the home page
app.get('/', (req, res) => {
    res.send('API is running...');
});

// --- API Routes ---
// Any requests to /api/users will be handled by userRoutes
app.use('/api/users', userRoutes);
// Any requests to /api/products will be handled by productRoutes
app.use('/api/products', productRoutes);
// Any requests to /api/cart will be handled by cartRoutes
app.use('/api/cart', cartRoutes);
// Any requests to /api/orders will be handled by orderRoutes
app.use('/api/orders', orderRoutes);


// Start the server and listen for incoming requests
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
