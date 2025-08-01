// src/screens/MyProfileScreen.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyProfileScreen() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [errorProfile, setErrorProfile] = useState(null);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    } else {
      // In a real app, you might fetch fresh user data from /api/users/profile here
      // For now, we rely on user data from AuthContext (loaded from localStorage)
      setLoadingProfile(false);
    }
  }, [user, token, navigate]);

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <div className="mt-4 text-xl text-gray-700">Loading profile...</div>
      </div>
    );
  }

  if (errorProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex justify-center items-center flex-col">
        <div className="text-center text-2xl text-red-600 font-bold mb-4">Error: {errorProfile}</div>
        <Link to="/" className="text-blue-600 hover:underline mt-4">Go Back to Products</Link>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-8 flex justify-center items-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-2xl w-full border-4 border-white transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8">My Profile</h2>
        
        <div className="space-y-8">
          {/* Personal Details Card */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-300">Personal Details</h3>
            <p className="text-gray-700 text-lg mb-2">
              <strong className="text-gray-900">Name:</strong> {user.name}
            </p>
            <p className="text-gray-700 text-lg">
              <strong className="text-gray-900">Email:</strong> {user.email}
            </p>
          </div>

          {/* Shipping Address Card */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-300">Shipping Address</h3>
            {user.shippingAddress && user.shippingAddress.address ? (
              <>
                <p className="text-gray-700 text-lg mb-1">
                  <strong className="text-gray-900">Address:</strong> {user.shippingAddress.address},{' '}
                  {user.shippingAddress.city},{' '}
                  {user.shippingAddress.postalCode},{' '}
                  {user.shippingAddress.country}
                </p>
                <p className="text-gray-700 text-lg">
                  <strong className="text-gray-900">Mobile:</strong> {user.shippingAddress.mobileNumber}
                </p>
              </>
            ) : (
              <p className="text-gray-600">No shipping address found. Please update your profile or proceed to checkout to add one.</p>
            )}
          </div>

          {/* Account Details Card */}
          <div className="p-6 bg-gray-50 rounded-2xl shadow-inner">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2 border-gray-300">Account Details</h3>
            <p className="text-gray-700 text-lg mb-1">
              <strong className="text-gray-900">User ID:</strong> {user._id}
            </p>
            <p className="text-gray-700 text-lg">
              <strong className="text-gray-900">Admin Status:</strong>{' '}
              {user.isAdmin ? (
                <span className="text-green-600 font-semibold">Yes</span>
              ) : (
                <span className="text-red-600 font-semibold">No</span>
              )}
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="text-indigo-600 hover:underline text-lg font-semibold">Go Back to Products</Link>
        </div>
      </div>
    </div>
  );
}

export default MyProfileScreen;
