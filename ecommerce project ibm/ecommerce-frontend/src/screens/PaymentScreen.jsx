// src/screens/PaymentScreen.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentScreen() {
  const navigate = useNavigate();
  // Default to 'Cash On Delivery' as it's a common and simple option
  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery'); 

  // Check if shipping address exists in localStorage, if not, redirect to shipping
  useEffect(() => {
    const shippingAddress = localStorage.getItem('shippingAddress');
    if (!shippingAddress) {
      navigate('/shipping'); // Redirect if shipping info is missing
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save payment method to localStorage for use in subsequent steps
    localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod));
    console.log('Payment Method Saved:', paymentMethod);

    // Navigate to place order screen
    navigate('/placeorder'); // This route will be created next
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-8 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-8">Payment Method</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cash on Delivery */}
          <div className="flex items-center">
            <input
              type="radio"
              id="CashOnDelivery"
              name="paymentMethod"
              value="Cash On Delivery"
              checked={paymentMethod === 'Cash On Delivery'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="CashOnDelivery" className="ml-3 text-lg font-medium text-gray-700">
              Cash on Delivery (COD)
            </label>
          </div>

          {/* Credit/Debit Card */}
          <div className="flex items-center">
            <input
              type="radio"
              id="CreditDebitCard"
              name="paymentMethod"
              value="Credit/Debit Card"
              checked={paymentMethod === 'Credit/Debit Card'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="CreditDebitCard" className="ml-3 text-lg font-medium text-gray-700">
              Credit/Debit Card
            </label>
          </div>

          {/* UPI Options */}
          <div className="flex flex-col space-y-2 border border-gray-200 p-4 rounded-lg">
            <p className="text-lg font-medium text-gray-800 mb-2">UPI / Wallets</p>
            <div className="flex items-center">
              <input
                type="radio"
                id="UPI"
                name="paymentMethod"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="UPI" className="ml-3 text-lg font-medium text-gray-700">
                Generic UPI
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="GPay"
                name="paymentMethod"
                value="GPay"
                checked={paymentMethod === 'GPay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="GPay" className="ml-3 text-lg font-medium text-gray-700">
                GPay
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="Paytm"
                name="paymentMethod"
                value="Paytm"
                checked={paymentMethod === 'Paytm'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="Paytm" className="ml-3 text-lg font-medium text-gray-700">
                Paytm
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="PhonePe"
                name="paymentMethod"
                value="PhonePe"
                checked={paymentMethod === 'PhonePe'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="PhonePe" className="ml-3 text-lg font-medium text-gray-700">
                PhonePe
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="BhimUPI"
                name="paymentMethod"
                value="BhimUPI"
                checked={paymentMethod === 'BhimUPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="BhimUPI" className="ml-3 text-lg font-medium text-gray-700">
                BhimUPI
              </label>
            </div>
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

export default PaymentScreen;
