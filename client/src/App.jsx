import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminRoute from './components/Admin/AdminProtectedRoute';
import AdminProductManager from './components/Admin/AdminProductManager';
import ShopPage from './pages/Shop';
import CategoryPage from './pages/Category';
import Profile from './components/Common/Profile';
import CheckoutScreen from './components/Common/CheckoutScreen';
import ContactUs from './pages/Footer/ContactUs';
import AboutUs from './pages/Footer/AboutUs';
//import PaymentInstructionsScreen from './pages/PaymentInstruction';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            
            {/* 🟢 CRITICAL CHANGE: Redirects the root path to /signup */}
            <Route path="/" element={<Navigate to="/signup" replace />} />

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            {/* User Layout Routes - Now under /app to avoid conflicting with the root redirect.
              Home is accessible at /app, Profile at /app/profile.
            */}
            <Route path="/app" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* Shop Routes (Remains outside the main layout shell as per your original structure) */}
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/category/men" element={<CategoryPage categoryName="Men" />} />
            <Route path="/category/women" element={<CategoryPage categoryName="Women" />} />
            <Route path="/category/top-wear" element={<CategoryPage categoryName="Top Wear" />} />
            <Route path="/category/bottom-wear" element={<CategoryPage categoryName="Bottom Wear" />} />
            <Route path="/checkout" element={<CheckoutScreen />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<AboutUs />} />
            {/* <Route 
            path="/order/:orderId/pay" 
            element={<PaymentInstructionsScreen />} 
        /> */}

            {/* Admin Layout */}
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminProductManager />} />
            </Route>
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
