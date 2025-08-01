// C:\Users\Saumya Pratap Singh\OneDrive - United College of Engineering & Research\Desktop\ecommerce project ibm\ecommerce-backend\middleware\errorMiddleware.js

// This file contains middleware functions for handling errors in your Express application.

/**
 * @desc    Middleware for handling 404 Not Found errors
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Callback function to move to the next middleware
 */
const notFound = (req, res, next) => {
    // Create an error object for a 404 Not Found scenario
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404); // Set the response status to 404
    next(error); // Pass the error to the next error-handling middleware
};

/**
 * @desc    General error handling middleware
 * @param   {Object} err - The error object passed from previous middleware/route handler
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Callback function (though usually not called here)
 */
const errorHandler = (err, req, res, next) => {
    // Determine the status code: if it's already set (e.g., 404, 400), use that, otherwise default to 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode); // Set the response status

    // Send a JSON response with the error message
    res.json({
        message: err.message, // The error message
        // In development, include the stack trace for debugging.
        // In production, you might want to hide the stack trace for security.
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

// Export the middleware functions
export { notFound, errorHandler };
