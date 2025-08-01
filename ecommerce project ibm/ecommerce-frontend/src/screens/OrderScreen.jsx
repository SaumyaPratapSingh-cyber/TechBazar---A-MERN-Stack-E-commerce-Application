// src/screens/OrderScreen.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function OrderScreen() {
  const { id: orderId } = useParams(); // Get order ID from URL
  const { token, user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(''); // State for payment message

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        setError("Please log in to view orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          localStorage.removeItem('userInfo');
          localStorage.removeItem('userToken');
          setError("Session expired. Please log in again.");
          setLoading(false);
          return;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && token) {
      fetchOrder();
    }
  }, [orderId, token]);

  const handlePayNow = async () => {
    // This is a simulated payment. In a real app, you'd integrate PayPal/Stripe SDK.
    setPaymentMessage('Processing payment...');
    try {
      // Simulate a payment result (replace with actual payment gateway response)
      const paymentResult = {
        id: 'PAYID-Simulated123',
        status: 'COMPLETED',
        update_time: new Date().toISOString(),
        email_address: user.email,
      };

      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentResult),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Payment failed: ${errorData.message || 'Unknown error'}`);
      }

      const updatedOrder = await response.json();
      setOrder(updatedOrder); // Update the order state with paid status
      setPaymentMessage('Payment made successful!');
    } catch (err) {
      console.error("Error processing payment:", err);
      setPaymentMessage(`Payment Error: ${err.message}`);
    } finally {
      setTimeout(() => setPaymentMessage(''), 5000); // Clear message after 5 seconds
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading order details...</div>
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

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="text-center text-2xl text-gray-700 font-bold mb-4">Order Not Found</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4">Go Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex justify-center items-start">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Order {order._id}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Details */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Shipping</h3>
            <p className="text-gray-700 text-lg">
              <strong>Name:</strong> {order.user ? order.user.name : 'N/A'}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Email:</strong> {order.user ? <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">{order.user.email}</a> : 'N/A'}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Address:</strong> {order.shippingAddress ? order.shippingAddress.address : 'N/A'},{' '}
              {order.shippingAddress ? order.shippingAddress.city : 'N/A'},{' '}
              {order.shippingAddress ? order.shippingAddress.postalCode : 'N/A'},{' '}
              {order.shippingAddress ? order.shippingAddress.country : 'N/A'}
            </p>
            <p className="text-gray-700 text-lg">
              <strong>Mobile:</strong> {order.shippingAddress ? order.shippingAddress.mobileNumber : 'N/A'}
            </p>
            {order.isDelivered ? (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                Delivered on {order.deliveredAt ? new Date(order.deliveredAt).toLocaleDateString() : 'N/A'}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">Not Delivered</div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Payment Method</h3>
            <p className="text-gray-700 text-lg">
              <strong>Method:</strong> {order.paymentMethod ? order.paymentMethod : 'N/A'}
            </p>
            {order.isPaid ? (
              <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md">
                Paid on {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : 'N/A'}
              </div>
            ) : (
              <div className="mt-4 p-3 bg-red-100 text-red-800 rounded-md">Not Paid</div>
            )}
            {paymentMessage && ( // Display payment message
                <div className={`mt-4 p-3 rounded-md text-center ${paymentMessage.includes('successful') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {paymentMessage}
                </div>
            )}

            <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Order Items</h3>
            {order.orderItems && order.orderItems.length === 0 ? (
              <div className="text-center text-xl text-gray-700">Order is empty</div>
            ) : (
              <div className="space-y-4">
                {order.orderItems && order.orderItems.map((item) => (
                  <div key={item.product ? item.product._id : item._id} className="flex items-center border-b border-gray-200 pb-3 last:border-b-0">
                    <div className="flex-shrink-0 w-16 h-16 mr-4">
                      <img src={item.image || 'https://placehold.co/64x64/e0e0e0/555555?text=No+Img'} alt={item.name} className="w-full h-full object-contain rounded-md" />
                    </div>
                    <div className="flex-grow">
                      <Link to={`/product/${item.product ? item.product._id : item._id}`} className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-gray-600 text-sm">
                        {item.qty} x ${item.price ? item.price.toFixed(2) : '0.00'} = ${item.qty * (item.price || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h3>
              <div className="flex justify-between text-lg mb-2">
                <span>Items:</span>
                <span>${order.itemsPrice ? order.itemsPrice.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg mb-2">
                <span>Shipping:</span>
                <span>${order.shippingPrice ? order.shippingPrice.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-lg mb-4">
                <span>Tax:</span>
                <span>${order.taxPrice ? order.taxPrice.toFixed(2) : '0.00'}</span>
              </div>
              <div className="flex justify-between text-2xl font-bold border-t border-gray-300 pt-4 mt-4">
                <span>Total:</span>
                <span>${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</span>
              </div>
            </div>
            {/* Payment Button (e.g., PayPal/Stripe integration would go here) */}
            {!order.isPaid && order.paymentMethod !== 'Cash On Delivery' && (
              <button
                onClick={handlePayNow} // Add onClick handler
                className="bg-green-600 text-white py-3 px-6 rounded-lg w-full font-semibold hover:bg-green-700 transition-colors duration-200 shadow-md mt-6"
              >
                Pay Now
              </button>
            )}
            {order.paymentMethod === 'Cash On Delivery' && !order.isPaid && (
              <div className="mt-6 p-3 bg-blue-100 text-blue-800 rounded-md text-center">
                Payment due on delivery.
              </div>
            )}
          </div>
        </div>
        <Link to="/myorders" className="block text-center text-blue-600 hover:underline mt-8">
          View My Orders
        </Link>
      </div>
    </div>
  );
}

export default OrderScreen;
