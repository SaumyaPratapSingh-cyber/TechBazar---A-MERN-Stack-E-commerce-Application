// src/screens/ProductListAdminScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // For access control

function ProductListAdminScreen() {
  const { user } = useAuth(); // Get user from context for admin check

  // Basic access control
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Access Denied</div>
        <p className="text-lg text-gray-700">You must be an admin to view this page.</p>
        <Link to="/login" className="text-blue-600 hover:underline mt-4">Go to Login</Link>
        <Link to="/admin/dashboard" className="text-blue-600 hover:underline mt-2">Go Back to Admin Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Manage Products (Admin)</h2>
        <p className="text-center text-xl text-gray-700 mb-8">
          This is where you'll add, edit, or delete products. (Functionality to be built)
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/admin/dashboard" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
            Back to Dashboard
          </Link>
          {/* Future: Link to Add Product Form */}
          {/* <Link to="/admin/product/create" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
            Add New Product
          </Link> */}
        </div>
      </div>
    </div>
  );
}

export default ProductListAdminScreen;
