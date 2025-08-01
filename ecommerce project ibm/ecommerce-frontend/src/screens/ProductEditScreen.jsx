// src/screens/ProductEditScreen.jsx
import React from 'react';
import { Link, useParams } from 'react-router-dom';

function ProductEditScreen() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex justify-center items-center">
      <div className="container mx-auto bg-white rounded-xl shadow-2xl p-8 max-w-lg text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Edit Product {id}</h2>
        <p className="text-gray-700 mb-6">This is the form to edit product details. (Functionality to be built)</p>
        <Link to="/admin/products" className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
          Back to Manage Products
        </Link>
      </div>
    </div>
  );
}

export default ProductEditScreen;
