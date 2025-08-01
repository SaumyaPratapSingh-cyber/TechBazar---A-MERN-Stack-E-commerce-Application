// utils/generateToken.js

import jwt from 'jsonwebtoken'; // Import jsonwebtoken library

// Function to generate a JSON Web Token
const generateToken = (id) => {
    // Sign the token with the user's ID and the JWT_SECRET from environment variables
    // The token expires in 30 days (adjust as needed for security and session management)
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
    });
};

export default generateToken; // Export the function
