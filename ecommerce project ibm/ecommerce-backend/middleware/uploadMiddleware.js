// C:\Users\Saumya Pratap Singh\OneDrive - United College of Engineering & Research\Desktop\ecommerce project ibm\ecommerce-backend\middleware\uploadMiddleware.js

// This file contains middleware for handling file uploads using Multer.

import multer from 'multer'; // Import Multer
import path from 'path';    // Node.js built-in module for working with file paths
import fs from 'fs';        // Node.js built-in module for file system operations

// --- 1. Configure Storage Engine ---
// This tells Multer where to store the uploaded files and how to name them.
const storage = multer.diskStorage({
    // 'destination' is a function that determines the folder where uploaded files will be stored.
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/'; // Define your upload directory
        // Create the 'uploads' directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // Store files in the 'uploads/' directory
    },
    // 'filename' is a function that determines the name of the uploaded file.
    filename: (req, file, cb) => {
        // Generate a unique filename: fieldname-timestamp.ext (e.g., product-1678888888888.jpg)
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

// --- 2. File Filter ---
// This function determines which files should be uploaded.
// Here, we only allow image files.
const fileFilter = (req, file, cb) => {
    // Check file type
    const filetypes = /jpeg|jpg|png|gif/; // Allowed extensions
    const mimetype = filetypes.test(file.mimetype); // Check mimetype
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // Check extension

    if (mimetype && extname) {
        return cb(null, true); // Allow upload
    } else {
        cb(new Error('Only images (JPEG, JPG, PNG, GIF) are allowed!'), false); // Reject upload
    }
};

// --- 3. Initialize Multer Upload Middleware ---
// Configure Multer with the storage engine and file filter.
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB (optional)
});

// --- 4. Middleware for single image upload ---
// This is a wrapper to catch Multer errors and pass them to Express's error handler.
const uploadSingleImage = (req, res, next) => {
    // 'image' is the name of the field in the form that holds the file.
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.status(400); // Bad Request
            return next(new Error(`Multer Error: ${err.message}`));
        } else if (err) {
            // An unknown error occurred.
            res.status(400); // Bad Request
            return next(err);
        }
        // If no error, proceed to the next middleware/route handler.
        next();
    });
};

// Export the middleware
export { uploadSingleImage };
