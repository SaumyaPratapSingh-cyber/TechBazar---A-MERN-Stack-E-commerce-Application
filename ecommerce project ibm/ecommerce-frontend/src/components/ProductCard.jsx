// src/components/ProductCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const [addToCartMessage, setAddToCartMessage] = useState('');
  const { user } = useAuth();

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <div className="flex items-center text-yellow-400"> {/* Adjusted star color */}
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </div>
    );
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent navigating to product detail page

    if (!user) {
      setAddToCartMessage("Please log in to add items to cart.");
      setTimeout(() => setAddToCartMessage(''), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify({ productId: product._id, qty: 1 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to add item to cart: ${errorData.message || 'Unknown error'}`);
      }

      setAddToCartMessage(`Added ${product.name} to cart!`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setAddToCartMessage(`Error: ${err.message}`);
      setTimeout(() => setAddToCartMessage(''), 3000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 cursor-pointer">
      {/* Product Image Section */}
      <a href={`/product/${product._id}`} className="block relative h-56 w-full overflow-hidden rounded-t-xl">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 hover:scale-110 p-2"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/e0e0e0/555555?text=No+Image'; }}
        />
        {/* Optional: Add a badge for offers/deals */}
        {product.price < 500 && (
            <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-700 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wide">
                Deal!
            </span>
        )}
      </a>

      {/* Product Details Section */}
      <div className="p-5 flex flex-col justify-between">
        <a href={`/product/${product._id}`} className="block">
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight line-clamp-2">
            {product.name}
          </h3>
        </a>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-3xl font-extrabold text-indigo-700">${product.price.toFixed(2)}</span> {/* Adjusted price color */}
          {product.price < 500 && (
            <span className="text-gray-500 text-sm line-through ml-2">
              ${(product.price * 1.2).toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center mb-4">
          {renderStars(product.rating)}
          <span className="text-gray-600 text-sm ml-2">({product.numReviews} reviews)</span>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg w-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Add to Cart
        </button>
        {addToCartMessage && (
          <div className="mt-3 p-2 bg-green-100 text-green-800 rounded-md text-center text-sm">
            {addToCartMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
