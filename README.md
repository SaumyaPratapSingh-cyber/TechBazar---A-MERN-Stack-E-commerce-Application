# TechBazar - A MERN Stack E-commerce Application

## Project Description

TechBazar is a modern, full-stack e-commerce website designed for selling tech products. Built with the **MERN** stack (**MongoDB**, **Express.js**, **React**, **Node.js**), this application provides a robust and responsive platform for browsing products, managing a shopping cart, and processing orders. The user experience is enhanced with a clean, minimalist design and dynamic features, while a secure, protected admin panel allows for full control over the store's data.

## Key Features

* **User Authentication:** Secure user registration, login, and logout functionality with **JWT** (JSON Web Tokens).
* **Product Catalog:** A dynamic homepage featuring a hero carousel, a stylish display of all products, and dedicated pages for individual product details.
* **Search & Filtering:** Users can easily search for products by name and filter by price range and category directly from the homepage.
* **Shopping Cart:** A fully functional cart where users can add items, view selected products, adjust quantities, and remove items.
* **Checkout Flow:** A multi-step process for entering shipping information, selecting a payment method (including COD and UPI options), and placing an order.
* **Order Management:** A dedicated "My Orders" page allows users to view their order history and track the payment and delivery status of each order.
* **Admin Panel:** A protected dashboard provides administrators with an interface to manage users, products, and orders.
* **Responsive UI/UX:** A minimalist, professional, and mobile-friendly design built with **Tailwind CSS**.

## Technologies Used

### Backend
* **Node.js:** JavaScript runtime for server-side logic.
* **Express.js:** Web application framework for building the RESTful API.
* **MongoDB Atlas:** A flexible, cloud-hosted NoSQL database.
* **Mongoose:** An elegant MongoDB object modeling tool for Node.js.
* **JWT (jsonwebtoken):** For secure, token-based user authentication.
* **Bcrypt.js:** For hashing user passwords.
* **CORS:** Middleware for enabling cross-origin requests.

### Frontend
* **React:** A JavaScript library for building the user interface.
* **Vite:** A fast and modern build tool for the development server.
* **React Router DOM:** For declarative routing within the application.
* **Tailwind CSS:** A utility-first CSS framework for rapid and responsive UI development.
* **React Context API:** For global state management (specifically for user authentication).

## Getting Started

Follow these steps to set up and run the project on your local machine.

### Prerequisites
* Node.js (LTS version recommended)
* npm (Node Package Manager) or Yarn
* A MongoDB Atlas cluster and its connection string.

### 1. Backend Setup
1.  **Clone the backend repository:**
    (Since the backend is part of the larger project folder, navigate to `ecommerce-backend`.)
2.  **Install backend dependencies:**
    ```bash
    cd ecommerce-backend
    npm install
    ```
    _or_
    ```bash
    cd ecommerce-backend
    yarn install
    ```
3.  **Configure environment variables:**
    * Create a `.env` file in the `ecommerce-backend` directory.
    * Add your MongoDB Atlas connection string and a JWT secret:
      ```
      MONGO_URI="your_mongodb_atlas_connection_string"
      PORT=5000
      JWT_SECRET="a_very_long_and_secure_secret_key"
      ```
    
4.  **Populate the database with products:**
    * Go to your MongoDB Atlas dashboard.
    * Insert sample product JSON documents into the `products` collection.
    * Ensure the `user` field in each product document references a valid `_id` from a user in your `users` collection.
5.  **Run the backend server:**
    ```bash
    npm run dev
    ```
    The server should start on `http://localhost:5000`. Keep this terminal running.

### 2. Frontend Setup
1.  **Navigate to the frontend directory:**
    ```bash
    cd ecommerce-frontend
    ```
2.  **Install frontend dependencies:**
    ```bash
    yarn install
    ```
3.  **Generate Tailwind CSS:**
    * The project uses a direct generation approach.
    * Run the following command to create the `src/output.css` file:
      ```bash
      yarn tailwind:build
      ```
4.  **Run the frontend development server:**
    ```bash
    yarn dev
    ```
    The frontend should be available at `http://localhost:5173`. Keep this terminal running.

## Project Structure
```
ecommerce-project-ibm/
├── ecommerce-backend/
│   ├── controllers/      # API logic for users, products, etc.
│   ├── models/           # Mongoose schemas for data models
│   ├── middleware/       # Authentication middleware
│   ├── routes/           # API endpoints
│   ├── .env              # Environment variables
│   ├── package.json      # Backend dependencies
│   └── server.js         # Main server file
└── ecommerce-frontend/
    ├── src/
    │   ├── components/   # Reusable React components (AuthForm, ProductCard, etc.)
    │   ├── context/      # React Context for global state (AuthContext)
    │   ├── screens/      # Main page components (HomePage, CartScreen, etc.)
    │   ├── App.jsx       # Main component with routing
    │   ├── main.jsx      # React entry point
    │   └── output.css    # Generated Tailwind CSS output
    ├── package.json      # Frontend dependencies
    └── tailwind.config.js # Tailwind CSS configuration
```

## Contributing
Contributions, issues, and feature requests are welcome!

## License
This project is open-source and available under the MIT License
