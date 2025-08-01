// src/screens/CartScreen.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CartScreen() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const { token, user, logout } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (!token) {
        setError("Please log in to view your cart.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
            logout();
            setError("Session expired. Please log in again.");
            setLoading(false);
            return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setCartItems(data.items || []);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, logout]);

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  };

  const handleRemoveItem = async (productId) => {
    if (!token) {
        setError("You must be logged in to remove items.");
        return;
    }
    setLoading(true);
    try {
        const response = await fetch(`http://localhost:5000/api/cart/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to remove item: ${errorData.message || 'Unknown error'}`);
        }
        const data = await response.json();
        setCartItems(data.items || []);
    } catch (err) {
        console.error("Error removing item:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleUpdateQty = async (productId, newQty) => {
    if (!token) {
        setError("You must be logged in to update quantities.");
        return;
    }
    setLoading(true);
    try {
        const response = await fetch('http://localhost:5000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ productId, qty: Number(newQty) }),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to update quantity: ${errorData.message || 'Unknown error'}`);
        }
        const data = await response.json();
        setCartItems(data.items || []);
    } catch (err) {
        console.error("Error updating quantity:", err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleCheckout = () => {
    // Navigate to shipping page
    navigate('/shipping');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {error}</div>
        <Link to="/login" className="text-blue-600 hover:underline mt-4">Go to Login</Link>
        <Link to="/" className="text-blue-600 hover:underline mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Shopping Cart</h2>
        
        {cartItems.length === 0 ? (
          <div className="text-center text-xl text-gray-700">
            Your cart is empty. <Link to="/" className="text-blue-600 hover:underline">Go shopping!</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items List */}
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex items-center border-b border-gray-200 py-4 last:border-b-0">
                  <div className="flex-shrink-0 w-24 h-24 mr-4">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain rounded-md" />
                  </div>
                  <div className="flex-grow">
                    <Link to={`/product/${item.product._id}`} className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                      {item.product.name}
                    </Link>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center">
                    <select
                      value={item.qty}
                      onChange={(e) => handleUpdateQty(item.product._id, e.target.value)}
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
                    >
                      {[...Array(item.product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-lg mb-2">
                <span>Items:</span>
                <span>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold mb-6">
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-green-600 text-white py-3 px-6 rounded-lg w-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
        <Link to="/" className="block text-center text-blue-600 hover:underline mt-8">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default CartScreen;
