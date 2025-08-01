// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductListPage from './screens/ProductListPage';
import ProductDetailPage from './screens/ProductDetailPage';
import AuthForm from './components/AuthForm';
import CartScreen from './screens/CartScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import MyOrdersScreen from './screens/MyOrdersScreen';
import AdminDashboardScreen from './screens/AdminDashboardScreen';
import UserListScreen from './screens/UserListScreen';
import MyProfileScreen from './screens/MyProfileScreen';
import ProductListAdminScreen from './screens/ProductListAdminScreen'; // Import new admin screen
import OrderListAdminScreen from './screens/OrderListAdminScreen';     // Import new admin screen
import { AuthProvider } from './context/AuthContext';
import './output.css'; // Your generated Tailwind CSS

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/login" element={
            <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
              <h1 className="text-5xl font-extrabold text-gray-900 mb-8">E-commerce App</h1>
              <AuthForm />
            </div>
          } />
          <Route path="/shipping" element={<ShippingScreen />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/placeorder" element={<PlaceOrderScreen />} />
          <Route path="/order/:id" element={<OrderScreen />} />
          <Route path="/myorders" element={<MyOrdersScreen />} />
          <Route path="/myprofile" element={<MyProfileScreen />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboardScreen />} />
          <Route path="/admin/users" element={<UserListScreen />} />
          <Route path="/admin/products" element={<ProductListAdminScreen />} /> {/* New Admin Product Route */}
          <Route path="/admin/orders" element={<OrderListAdminScreen />} />     {/* New Admin Order Route */}
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
