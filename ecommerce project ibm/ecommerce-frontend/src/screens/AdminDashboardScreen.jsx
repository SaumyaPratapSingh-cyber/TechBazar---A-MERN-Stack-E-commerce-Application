// src/screens/AdminDashboardScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminDashboardScreen() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    } else if (!user.isAdmin) {
      setError("Access Denied. You must be an admin to view this page.");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user, token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen flex-col bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading admin dashboard...</div>
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

  if (user && user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
        <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Admin Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Manage Products Card */}
            <Link to="/admin/products" className="block bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 text-center">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">Manage Products</h3>
              <p className="text-blue-700">Add, edit, or delete products.</p>
            </Link>

            {/* Manage Users Card */}
            <Link to="/admin/users" className="block bg-green-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 text-center">
              <h3 className="text-2xl font-bold text-green-800 mb-2">Manage Users</h3>
              <p className="text-green-700">View and manage user accounts.</p>
            </Link>

            {/* Manage Orders Card */}
            <Link to="/admin/orders" className="block bg-purple-100 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 text-center">
              <h3 className="text-2xl font-bold text-purple-800 mb-2">Manage Orders</h3>
              <p className="text-purple-700">View and update customer orders.</p>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default AdminDashboardScreen;
