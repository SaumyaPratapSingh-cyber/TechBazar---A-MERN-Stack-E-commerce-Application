// src/screens/ShippingScreen.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // To get user info if needed

function ShippingScreen() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user info from context

  // Initialize state with empty strings or pre-fill from user profile if available
  const [address, setAddress] = useState(user?.shippingAddress?.address || '');
  const [city, setCity] = useState(user?.shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(user?.shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(user?.shippingAddress?.country || '');
  const [mobileNumber, setMobileNumber] = useState(user?.shippingAddress?.mobileNumber || '');
  const [deliveryType, setDeliveryType] = useState('now'); // Default to 'now'

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save shipping info to localStorage or a global state for use in subsequent steps
    const shippingInfo = { address, city, postalCode, country, mobileNumber, deliveryType };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingInfo));
    console.log('Shipping Info Saved:', shippingInfo);

    // Navigate to payment screen
    navigate('/payment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Shipping</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="address" className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="city" className="block text-gray-700 text-sm font-bold mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-gray-700 text-sm font-bold mb-2">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              placeholder="Enter postal code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-gray-700 text-sm font-bold mb-2">
              Country
            </label>
            <input
              type="text"
              id="country"
              placeholder="Enter country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="mobileNumber" className="block text-gray-700 text-sm font-bold mb-2">
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              placeholder="Enter mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="deliveryType" className="block text-gray-700 text-sm font-bold mb-2">
              Delivery Type
            </label>
            <select
              id="deliveryType"
              value={deliveryType}
              onChange={(e) => setDeliveryType(e.target.value)}
              className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
              required
            >
              <option value="now">Deliver Now (within 24 hours)</option>
              <option value="week">Deliver within a week</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-200 ease-in-out transform hover:scale-105"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShippingScreen;
