// src/screens/PlaceOrderScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PlaceOrderScreen() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const storedShippingAddress = localStorage.getItem('shippingAddress');
    const storedPaymentMethod = localStorage.getItem('paymentMethod');

    if (!storedShippingAddress || !storedPaymentMethod) {
      setError("Missing shipping or payment information. Please go back to cart.");
      setLoading(false);
      return;
    }

    setShippingAddress(JSON.parse(storedShippingAddress));
    setPaymentMethod(JSON.parse(storedPaymentMethod));

    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('userToken');
            navigate('/login');
            return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        if (data.items.length === 0) {
            setError("Your cart is empty. Please add items before placing an order.");
            setLoading(false);
            return;
        }
        setCartItems(data.items);
      } catch (err) {
        console.error("Failed to fetch cart for order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token, navigate]);

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  const placeOrderHandler = async () => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        orderItems: cartItems.map(item => ({
            _id: item.product._id, // Send product ID as _id for backend mapping
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            qty: item.qty,
        })),
        shippingAddress,
        paymentMethod,
        taxPrice: taxPrice.toFixed(2),
        shippingPrice: shippingPrice.toFixed(2),
        totalPrice: totalPrice.toFixed(2),
        deliveryType: shippingAddress.deliveryType // Pass delivery type from shipping
      };

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Order creation failed: ${errorData.message || 'Unknown error'}`);
      }

      const createdOrder = await response.json();
      // setOrderCreated(createdOrder); // No longer needed here
      localStorage.removeItem('shippingAddress');
      localStorage.removeItem('paymentMethod');
      navigate(`/order/${createdOrder._id}`); // Navigate to order detail page
    } catch (err) {
      console.error("Error placing order:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading order summary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {error}</div>
        <Link to="/cart" className="text-blue-600 hover:underline mt-4">Go Back to Cart</Link>
        <Link to="/" className="text-blue-600 hover:underline mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Place Order</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Shipping</h3>
              <p className="text-gray-700 text-lg">
                <strong>Address:</strong> {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Mobile:</strong> {shippingAddress.mobileNumber}
              </p>
              <p className="text-gray-700 text-lg">
                <strong>Delivery Type:</strong> {shippingAddress.deliveryType === 'now' ? 'Deliver Now (within 24 hours)' : 'Deliver within a week'}
              </p>
            </div>

            {/* Payment Method */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Payment Method</h3>
              <p className="text-gray-700 text-lg">
                <strong>Method:</strong> {paymentMethod}
              </p>
            </div>

            {/* Order Items */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Items</h3>
              {cartItems.length === 0 ? (
                <div className="text-center text-xl text-gray-700">Your cart is empty.</div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.product._id} className="flex items-center border-b border-gray-200 py-3 last:border-b-0">
                    <div className="flex-shrink-0 w-16 h-16 mr-4">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain rounded-md" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.product._id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </Link>
                      <p className="text-gray-600 text-sm">
                        {item.qty} x ${item.price.toFixed(2)} = ${item.qty * item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-gray-50 p-6 rounded-lg shadow-inner flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-lg mb-2">
                <span>Items:</span>
                <span>${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg mb-2">
                <span>Shipping:</span>
                <span>${shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg mb-4">
                <span>Tax:</span>
                <span>${taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t border-gray-300 pt-4 mt-4">
                <span>Total:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={placeOrderHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-200 ease-in-out transform hover:scale-105 mt-6"
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrderScreen;
