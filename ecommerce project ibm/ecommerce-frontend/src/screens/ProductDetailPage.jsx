// src/screens/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react'; // Corrected import syntax
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProductDetailPage() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [addToCartMessage, setAddToCartMessage] = useState('');

  const { id } = useParams();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error("Failed to fetch product details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    return (
      <div className="flex items-center text-yellow-500">
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </div>
    );
  };

  const handleAddToCart = async () => {
    if (!user) { // Check if user is logged in
      setAddToCartMessage("Please log in to add items to cart.");
      setTimeout(() => setAddToCartMessage(''), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`, // Get token from localStorage
        },
        body: JSON.stringify({ productId: product._id, qty }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add item to cart: ${errorData.message || 'Unknown error'}`);
      }

      setAddToCartMessage(`Added ${qty} of ${product.name} to cart!`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setAddToCartMessage(`Error: ${err.message}`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading product details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {error}</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4">Go Back to Products</Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="text-center text-2xl text-gray-700 font-bold mb-4">Product Not Found</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4">Go Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex justify-center items-start">
      {/* Header with Cart Link */}
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-white rounded-b-lg shadow-md z-10">
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
          TechBazar
        </Link>
        <nav className="flex items-center space-x-6">
          {user ? (
            <>
              {user.isAdmin && ( // Conditionally render Admin Dashboard link
                <Link to="/admin/dashboard" className="text-purple-600 hover:text-purple-800 font-bold transition-colors">
                  Admin
                </Link>
              )}
              <Link to="/myorders" className="text-gray-700 hover:text-blue-600 font-medium hidden md:block">
                My Orders
              </Link>
              <Link to="/myprofile" className="text-gray-700 hover:text-blue-600 font-medium hidden md:block">
                My Profile
              </Link>
              <span className="text-gray-700 font-medium hidden md:block">Hello, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} className="text-red-600 hover:text-red-800 font-bold transition-colors">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
              Login
            </Link>
          )}
          <Link to="/cart" className="relative text-gray-700 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </Link>
        </nav>
      </header>

      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full flex flex-col md:flex-row gap-8 mt-20">
        {/* Product Image */}
        <div className="md:w-1/2 flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-96 object-contain rounded-lg border border-gray-200 p-2"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e0e0e0/555555?text=No+Image'; }}
          />
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-lg text-gray-700 mb-2">
              <span className="font-semibold">Brand:</span> {product.brand}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-gray-800 text-base leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-center mb-4">
              {renderStars(product.rating)}
              <span className="text-gray-600 text-md ml-2">({product.numReviews} reviews)</span>
            </div>

            <div className="text-4xl font-extrabold text-blue-700 mb-6">${product.price.toFixed(2)}</div>
          </div>

          {/* Stock, Quantity Selector, and Add to Cart */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <p className="text-lg text-gray-700 mb-4">
              <span className="font-semibold">Status:</span>{' '}
              {product.countInStock > 0 ? (
                <span className="text-green-600">In Stock ({product.countInStock})</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>

            {product.countInStock > 0 && (
              <div className="flex items-center mb-4">
                <label htmlFor="qty" className="text-lg text-gray-700 font-semibold mr-3">Qty:</label>
                <select
                  id="qty"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              className={`py-3 px-6 rounded-lg w-full font-semibold transition-all duration-300 transform shadow-lg ${
                product.countInStock > 0
                  ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white hover:from-blue-700 hover:to-blue-900 hover:scale-105'
                  : 'bg-gray-400 text-gray-700 cursor-not-allowed'
              }`}
              disabled={product.countInStock === 0}
            >
              {product.countInStock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <Link to="/" className="block text-center text-blue-600 hover:underline mt-4">
              Go Back to Products
            </Link>
            {addToCartMessage && (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md text-center">
                {addToCartMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
