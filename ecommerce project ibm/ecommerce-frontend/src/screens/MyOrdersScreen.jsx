// src/screens/MyOrdersScreen.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyOrdersScreen() {
  const navigate = useNavigate();
  const { token, user, logout } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!token) {
        setError("Please log in to view your orders.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/orders/myorders', {
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
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch my orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [token, logout]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading your orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {error}</div>
        <Link to="/login" className="text-blue-600 hover:underline mt-4">Go to Login</Link>
        <Link to="/" className="text-blue-600 hover:underline mt-2">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8">
      <div className="container mx-auto bg-white rounded-3xl shadow-2xl p-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-10">My Orders</h2>
        
        {orders.length === 0 ? (
          <div className="text-center text-xl text-gray-700">
            You have not placed any orders yet. <Link to="/" className="text-blue-600 hover:underline">Go shopping!</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-50 rounded-2xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center transition-all duration-300 transform hover:scale-[1.01] hover:shadow-xl border border-gray-100">
                <div className="flex-grow md:w-1/3">
                  <p className="text-lg font-semibold text-gray-800">Order ID: <span className="font-normal text-gray-600">{order._id.substring(0, 10)}...</span></p>
                  <p className="text-sm text-gray-500">Placed on: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
                </div>
                <div className="flex-grow-0 md:w-1/3 flex justify-center items-center my-4 md:my-0">
                  <div className="text-2xl font-bold text-gray-900">${order.totalPrice.toFixed(2)}</div>
                </div>
                <div className="flex-grow-0 md:w-1/3 flex justify-end items-center space-x-4">
                  {order.isPaid ? (
                    <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">Paid</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-semibold">Not Paid</span>
                  )}
                  {order.isDelivered ? (
                    <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-semibold">Delivered</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-semibold">Not Delivered</span>
                  )}
                  <Link to={`/order/${order._id}`} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors shadow-sm">
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        <Link to="/" className="block text-center text-blue-600 hover:underline mt-8">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default MyOrdersScreen;
